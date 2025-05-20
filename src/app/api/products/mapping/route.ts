import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    
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

    // Get request data
    const { templateId, productId, variantId } = await request.json()

    if (!templateId || !productId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Template-ID und Produkt-ID sind erforderlich' 
      }, { status: 400 })
    }

    // Verify the template exists
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('id, name')
      .eq('id', templateId)
      .single()
    
    if (templateError || !template) {
      return NextResponse.json({ 
        success: false, 
        error: 'Template nicht gefunden' 
      }, { status: 404 })
    }

    // Check if this product/variant mapping already exists
    const { data: existingMapping } = await supabase
      .from('product_template_mapping')
      .select('id')
      .eq('shopify_product_id', productId)
      .eq('shopify_variant_id', variantId || null)
      .maybeSingle()
    
    if (existingMapping) {
      return NextResponse.json({ 
        success: false, 
        error: 'Diese Produkt/Varianten-Kombination ist bereits zugeordnet' 
      }, { status: 409 })
    }

    // Create the mapping
    const mappingData = {
      shopify_product_id: productId,
      shopify_variant_id: variantId || null,
      template_id: templateId
    }

    const { data: newMapping, error: mappingError } = await supabase
      .from('product_template_mapping')
      .insert(mappingData)
      .select('*')
      .single()
    
    if (mappingError) {
      console.error('Error creating product mapping:', mappingError)
      return NextResponse.json({ 
        success: false, 
        error: 'Fehler beim Erstellen der Zuordnung' 
      }, { status: 500 })
    }

    // Success
    return NextResponse.json({ 
      success: true, 
      message: 'Zuordnung erfolgreich erstellt',
      mapping: newMapping
    })

  } catch (error) {
    console.error('Unexpected error creating product mapping:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Ein unerwarteter Fehler ist aufgetreten' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    error: 'Diese API-Route unterstützt nur POST-Anfragen' 
  }, { status: 405 })
}