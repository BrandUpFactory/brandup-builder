import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔍 Debug-Webhook aufgerufen')
  
  // Log all headers for debugging
  console.log('📋 Headers:', JSON.stringify(Object.fromEntries([...request.headers.entries()]), null, 2))
  
  try {
    // Get the body as text
    const rawBody = await request.text()
    console.log('📄 Raw Body:', rawBody)
    
    // Parse the body as JSON if possible
    try {
      const jsonBody = JSON.parse(rawBody)
      console.log('🧩 JSON Body:', JSON.stringify(jsonBody, null, 2))
    } catch (parseErr) {
      console.log('⚠️ Konnte Body nicht als JSON parsen')
    }
    
    // Test Supabase connection
    console.log('🔌 Teste Supabase-Verbindung...')
    const supabase = createClient()
    
    // Test a simple query
    console.log('🔍 Teste Supabase-Abfrage...')
    const { data: testData, error: testError } = await supabase
      .from('templates')
      .select('id, name')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase-Abfrage fehlgeschlagen:', testError)
      return NextResponse.json({ 
        success: false, 
        error: 'Datenbankfehler',
        details: testError
      }, { status: 500 })
    }
    
    console.log('✅ Supabase-Verbindung erfolgreich. Daten:', testData)
    
    // Test the license code generation function
    try {
      console.log('🔑 Teste Lizenzcode-Generierung...')
      const { data: licenseCode, error: codeError } = await supabase.rpc('generate_license_code')
      
      if (codeError) {
        console.error('❌ Lizenzcode-Generierung fehlgeschlagen:', codeError)
        
        // Try to create the function if it doesn't exist
        if (codeError.message.includes('does not exist')) {
          console.log('⚠️ Funktion existiert nicht, versuche alternative Generierung...')
          
          // Generiere einen alternativen Lizenzcode
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
          let altLicenseCode = ''
          
          // Format: XXX-XXXX-XXXX
          for (let j = 0; j < 3; j++) {
            altLicenseCode += chars.charAt(Math.floor(Math.random() * chars.length))
          }
          altLicenseCode += '-'
          for (let j = 0; j < 4; j++) {
            altLicenseCode += chars.charAt(Math.floor(Math.random() * chars.length))
          }
          altLicenseCode += '-'
          for (let j = 0; j < 4; j++) {
            altLicenseCode += chars.charAt(Math.floor(Math.random() * chars.length))
          }
          
          console.log('✅ Alternative Generierung erfolgreich:', altLicenseCode)
        }
      } else {
        console.log('✅ Lizenzcode-Generierung erfolgreich:', licenseCode)
      }
    } catch (licenseErr) {
      console.error('❌ Fehler bei der Lizenzcode-Generierung:', licenseErr)
    }
    
    // Check product_template_mapping table
    try {
      console.log('🔍 Prüfe product_template_mapping Tabelle...')
      const { data: mappingData, error: mappingError } = await supabase
        .from('product_template_mapping')
        .select('*')
      
      if (mappingError) {
        console.error('❌ Mapping-Abfrage fehlgeschlagen:', mappingError)
      } else {
        console.log(`✅ Mapping-Abfrage erfolgreich. ${mappingData.length} Einträge gefunden:`, mappingData)
      }
    } catch (mappingErr) {
      console.error('❌ Fehler bei der Mapping-Abfrage:', mappingErr)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Debug-Informationen wurden protokolliert'
    })
  } catch (error) {
    console.error('❌ Debug-Fehler:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Debug-Fehler',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}