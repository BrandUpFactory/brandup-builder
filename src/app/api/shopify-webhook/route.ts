import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Shopify Webhook Secret prüfen
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256')
  
  // Hier sollte eine HMAC-Validierung erfolgen, um sicherzustellen,
  // dass der Webhook wirklich von Shopify kommt
  
  if (!hmacHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Webhook-Daten abrufen
    const payload = await request.json()
    
    // Supabase-Client erstellen
    const supabase = createClient()
    
    // Order-ID aus Webhook extrahieren
    const orderId = payload.id
    const lineItems = payload.line_items || []
    
    // Für jedes gekaufte Produkt einen Lizenzcode erstellen
    for (const item of lineItems) {
      // Hier müsste eine Logik sein, die das gekaufte Produkt einem Template zuordnet
      // Beispiel: Produkt-ID oder Varianten-ID mit Template-ID verknüpfen
      const productId = item.product_id
      const variantId = item.variant_id
      
      // Template-ID basierend auf Produkt/Variante aus einer Mapping-Tabelle abrufen
      const { data: templateMapping } = await supabase
        .from('product_template_mapping')
        .select('template_id')
        .eq('shopify_product_id', productId.toString())
        .single()
      
      if (!templateMapping) {
        console.error(`Kein Template-Mapping für Produkt ${productId} gefunden`)
        continue
      }
      
      const templateId = templateMapping.template_id
      
      // SQL-Funktion zum Generieren eines einzigartigen Lizenz-Codes aufrufen
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_license_code')
      
      if (codeError) {
        console.error('Fehler beim Generieren des Codes:', codeError)
        continue
      }
      
      const licenseCode = codeData
      
      // Neuen Lizenzcode in die Datenbank einfügen
      const { error: insertError } = await supabase
        .from('licenses')
        .insert({
          license_code: licenseCode,
          template_id: templateId,
          shopify_order_id: orderId.toString(),
          used: false
        })
      
      if (insertError) {
        console.error('Fehler beim Speichern des Lizenzcodes:', insertError)
        continue
      }
      
      // Optional: Hier könnte eine E-Mail mit dem generierten Code versendet werden
      // oder der Code in die Shopify-Order-Metadaten zurückgeschrieben werden
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler bei der Verarbeitung des Webhooks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}