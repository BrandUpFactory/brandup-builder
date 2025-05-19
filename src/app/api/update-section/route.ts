import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { sectionId, data } = await request.json();

    if (!sectionId || !data) {
      return NextResponse.json({ error: 'Missing sectionId or data' }, { status: 400 });
    }

    console.log('API: Updating section', sectionId);
    console.log('API: With data length', typeof data === 'string' ? data.length : 'not a string');

    // First attempt: regular update
    const { error: updateError } = await supabase
      .from('sections')
      .update({ 
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', sectionId);

    if (updateError) {
      console.error('API: Error in first update attempt:', updateError);
      
      // Second attempt: direct SQL via RPC (if available in your Supabase setup)
      try {
        const { error: rpcError } = await supabase.rpc('update_section_data', {
          section_id: sectionId,
          section_data: data
        });
        
        if (rpcError) {
          console.error('API: RPC attempt failed:', rpcError);
          throw rpcError;
        }
        
        console.log('API: Update via RPC successful');
        return NextResponse.json({ success: true, method: 'rpc' });
      } catch (rpcError) {
        console.error('API: All update attempts failed');
        return NextResponse.json({ error: 'Failed to update section', details: updateError }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, method: 'standard' });
  } catch (error) {
    console.error('API: Unexpected error in update-section route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}