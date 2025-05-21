import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Calculate delay based on retry count (exponential backoff)
const getRetryDelay = (retryCount: number): number => {
  return Math.min(100 * Math.pow(2, retryCount), 5000); // Max 5 seconds
};

// Retry function with exponential backoff
const retryOperation = async <T>(
  operation: () => Promise<T>,
  isRetryable: (error: any) => boolean,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: any;
  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (retryCount >= maxRetries || !isRetryable(error)) {
        throw error;
      }
      
      // Wait before retrying
      const delay = getRetryDelay(retryCount);
      console.log(`Retrying operation after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { sectionId, data } = await request.json();

    if (!sectionId || !data) {
      return NextResponse.json({ error: 'Missing sectionId or data' }, { status: 400 });
    }

    console.log('API: Updating section', sectionId);
    console.log('API: With data length', typeof data === 'string' ? data.length : 'not a string');

    // Define retry function for Supabase operations
    const isRetryableError = (error: any) => {
      const overloadedErrors = ['overloaded_error', 'timeout'];
      const errorType = error?.error?.type || error?.type || '';
      return overloadedErrors.includes(errorType) || error?.message?.includes('timeout');
    };

    try {
      // Attempt the update with retries for overloaded errors
      const result = await retryOperation(
        async () => {
          // First attempt: regular update
          const { error: updateError } = await supabase
            .from('sections')
            .update({ 
              data,
              updated_at: new Date().toISOString()
            })
            .eq('id', sectionId);

          if (updateError) {
            throw updateError;
          }
          
          return { success: true, method: 'standard' };
        },
        isRetryableError,
        3
      );
      
      return NextResponse.json(result);
    } catch (updateError) {
      console.error('API: Error in update attempts:', updateError);
      
      // Fallback to RPC if available
      try {
        console.log('API: Attempting RPC fallback...');
        const result = await retryOperation(
          async () => {
            const { error: rpcError } = await supabase.rpc('update_section_data', {
              section_id: sectionId,
              section_data: data
            });
            
            if (rpcError) {
              throw rpcError;
            }
            
            return { success: true, method: 'rpc' };
          },
          isRetryableError,
          2
        );
        
        console.log('API: Update via RPC successful');
        return NextResponse.json(result);
      } catch (rpcError) {
        console.error('API: All update attempts failed');
        return NextResponse.json(
          { error: 'Failed to update section', details: updateError }, 
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('API: Unexpected error in update-section route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}