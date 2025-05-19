import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = cookies()
    
    // Create a Supabase client with server-side cookies
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

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nicht autorisiert. Bitte melden Sie sich an.' 
      }, { status: 401 })
    }

    // Generate a license code (using the database function)
    const { data: licenseCodeData, error: codeGenError } = await supabase.rpc('generate_license_code')
    
    if (codeGenError) {
      console.error('Error generating license code:', codeGenError)
      return NextResponse.json({ 
        success: false, 
        error: 'Fehler bei der Generierung des Lizenz-Codes' 
      }, { status: 500 })
    }

    // Get a random template for demo purposes
    const { data: templates, error: templateError } = await supabase
      .from('templates')
      .select('id')
      .eq('active', true)
      .limit(10)
    
    if (templateError || !templates || templates.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Keine Templates verfügbar' 
      }, { status: 500 })
    }

    // Select a random template
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

    // Create the license
    const licenseData = {
      license_code: licenseCodeData,
      template_id: randomTemplate.id,
      user_id: user.id,
      used: false
    }

    const { data: newLicense, error: licenseError } = await supabase
      .from('licenses')
      .insert(licenseData)
      .select('*')
      .single()
    
    if (licenseError) {
      console.error('Error creating license:', licenseError)
      return NextResponse.json({ 
        success: false, 
        error: 'Fehler beim Erstellen der Lizenz' 
      }, { status: 500 })
    }

    // Success
    return NextResponse.json({ 
      success: true, 
      message: 'Lizenz erfolgreich erstellt',
      license: {
        license_key: licenseCodeData,
        template_id: randomTemplate.id,
        ...newLicense
      }
    })

  } catch (error) {
    console.error('Unexpected error creating license:', error)
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