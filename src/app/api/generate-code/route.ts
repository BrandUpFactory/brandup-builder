import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Authentifizierung prüfen - nur Admins dürfen Codes generieren
  // Dies ist ein einfaches Beispiel - in Produktion sollte ein robusteres System verwendet werden
  const authHeader = request.headers.get('authorization')
  const apiSecret = process.env.ADMIN_API_SECRET
  
  if (!authHeader || authHeader !== `Bearer ${apiSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { templateId, count = 1 } = await request.json()
    
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID ist erforderlich' }, 
        { status: 400 }
      )
    }
    
    // Supabase-Client erstellen
    const supabase = createClient()
    
    // Prüfen, ob das Template existiert
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('id')
      .eq('id', templateId)
      .single()
    
    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template nicht gefunden' }, 
        { status: 404 }
      )
    }
    
    // Generierte Codes sammeln
    const generatedCodes = []
    
    // Codes generieren (Anzahl = count)
    for (let i = 0; i < count; i++) {
      // SQL-Funktion zum Generieren eines einzigartigen Lizenz-Codes aufrufen
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_license_code')
      
      if (codeError) {
        console.error('Fehler beim Generieren des Codes:', codeError)
        continue
      }
      
      const licenseCode = codeData
      
      // Neuen Lizenzcode in die Datenbank einfügen
      const { data: license, error: insertError } = await supabase
        .from('licenses')
        .insert({
          license_code: licenseCode,
          template_id: templateId,
          used: false
        })
        .select('license_code, created_at')
        .single()
      
      if (insertError) {
        console.error('Fehler beim Speichern des Lizenzcodes:', insertError)
        continue
      }
      
      generatedCodes.push(license)
    }
    
    return NextResponse.json({ 
      success: true,
      codes: generatedCodes,
      count: generatedCodes.length
    })
  } catch (error) {
    console.error('Fehler bei der Code-Generierung:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}