import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import isAdmin from '@/utils/isAdmin'

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
    
    // Überprüfen, ob der Benutzer Admin-Rechte hat
    if (!isAdmin(user)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Keine Berechtigung für diese Aktion.' 
      }, { status: 403 })
    }

    // Get request body data
    const requestData = await request.json()
    const { templateId, quantity = 1, customPrefix = '', shopifyOrderId = null } = requestData

    if (!templateId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Template-ID ist erforderlich' 
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

    // Generate the specified number of license codes
    const licenses = []
    
    for (let i = 0; i < quantity; i++) {
      // Generate a license code (using the database function)
      const { data: licenseCodeData, error: codeGenError } = await supabase.rpc('generate_license_code')
      
      if (codeGenError) {
        console.error('Error generating license code:', codeGenError)
        continue
      }

      // Apply custom prefix if provided
      const licenseCode = customPrefix 
        ? `${customPrefix}-${licenseCodeData}` 
        : licenseCodeData
      
      // Create the license
      const licenseData = {
        license_code: licenseCode,
        template_id: templateId,
        shopify_order_id: shopifyOrderId,
        user_id: null, // Will be set when activated by a user
        used: false
      }

      const { data: newLicense, error: licenseError } = await supabase
        .from('licenses')
        .insert(licenseData)
        .select('*')
        .single()
      
      if (licenseError) {
        console.error('Error creating license:', licenseError)
        continue
      }

      licenses.push({
        license_code: licenseCode,
        template_id: templateId,
        template_name: template.name,
        ...newLicense
      })
    }

    if (licenses.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Keine Lizenzen konnten erstellt werden' 
      }, { status: 500 })
    }

    // Success
    return NextResponse.json({ 
      success: true, 
      message: `${licenses.length} Lizenz(en) erfolgreich erstellt`,
      licenses
    })

  } catch (error) {
    console.error('Unexpected error creating licenses:', error)
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