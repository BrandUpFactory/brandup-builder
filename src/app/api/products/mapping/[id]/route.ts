import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const mappingId = params.id
    
    if (!mappingId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mapping-ID ist erforderlich' 
      }, { status: 400 })
    }
    
    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Get the current user and ensure they're authorized
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nicht autorisiert. Bitte melden Sie sich an.' 
      }, { status: 401 })
    }

    // Check if mapping exists
    const { data: mapping, error: findError } = await supabase
      .from('product_template_mapping')
      .select('id')
      .eq('id', mappingId)
      .single()
    
    if (findError || !mapping) {
      return NextResponse.json({ 
        success: false, 
        error: 'Zuordnung nicht gefunden' 
      }, { status: 404 })
    }

    // Delete the mapping
    const { error: deleteError } = await supabase
      .from('product_template_mapping')
      .delete()
      .eq('id', mappingId)
    
    if (deleteError) {
      console.error('Error deleting product mapping:', deleteError)
      return NextResponse.json({ 
        success: false, 
        error: 'Fehler beim Löschen der Zuordnung' 
      }, { status: 500 })
    }

    // Success
    return NextResponse.json({ 
      success: true, 
      message: 'Zuordnung erfolgreich gelöscht'
    })

  } catch (error) {
    console.error('Unexpected error deleting product mapping:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Ein unerwarteter Fehler ist aufgetreten' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    error: 'Diese API-Route unterstützt nur DELETE-Anfragen' 
  }, { status: 405 })
}