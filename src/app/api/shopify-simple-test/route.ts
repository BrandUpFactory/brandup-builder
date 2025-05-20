import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Simple Test Webhook aktiviert');
  
  // Logge alle Header
  console.log('Headers:', JSON.stringify(Object.fromEntries([...request.headers.entries()]), null, 2));
  
  let bodyText = '';
  
  try {
    // Body als Text
    bodyText = await request.text();
    console.log('Body als Text (erste 200 Zeichen):', bodyText.substring(0, 200));
    
    // Versuche, den Body als JSON zu parsen
    let body;
    try {
      body = JSON.parse(bodyText);
      console.log('Body konnte als JSON geparst werden:', JSON.stringify(body, null, 2).substring(0, 200));
    } catch (parseError) {
      console.error('Konnte Body nicht als JSON parsen:', parseError.message);
    }
    
    // Teste Supabase-Verbindung
    try {
      console.log('Teste Supabase-Verbindung...');
      const supabase = createClient();
      
      const { data: templates, error } = await supabase
        .from('templates')
        .select('id, name')
        .limit(1);
      
      if (error) {
        console.error('Supabase-Fehler:', error);
      } else {
        console.log('Supabase-Ergebnis:', templates);
      }
      
      // Teste product_template_mapping Tabelle
      const { data: mappings, error: mappingError } = await supabase
        .from('product_template_mapping')
        .select('*');
      
      if (mappingError) {
        console.error('Mapping-Tabellen-Fehler:', mappingError);
      } else {
        console.log('Mappings gefunden:', mappings.length);
        console.log('Mapping-Beispiel:', mappings[0]);
      }
      
      // Teste generate_license_code Funktion
      try {
        const { data: licenseCode, error: codeError } = await supabase.rpc('generate_license_code');
        
        if (codeError) {
          console.error('Lizenzcode-Generierungs-Fehler:', codeError);
        } else {
          console.log('Generierter Lizenzcode:', licenseCode);
        }
      } catch (funcError) {
        console.error('Fehler beim Aufrufen der Lizenzcode-Funktion:', funcError);
      }
      
    } catch (supabaseError) {
      console.error('Supabase-Verbindungsfehler:', supabaseError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Simple test completed',
      body_length: bodyText.length,
      headers: Object.fromEntries([...request.headers.entries()])
    });
  } catch (error) {
    console.error('Fehler im Simple Test:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      body_partial: bodyText.substring(0, 100)
    }, { status: 500 });
  }
}