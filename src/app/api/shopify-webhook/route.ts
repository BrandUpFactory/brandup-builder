import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Types for Shopify webhook payload
interface ShopifyOrderItem {
  id: number
  product_id: number
  variant_id: number | null
  quantity: number
  title: string
  price?: string
  sku?: string
}

interface ShopifyOrder {
  id: number
  name: string
  email: string
  total_price?: string
  created_at: string
  line_items: ShopifyOrderItem[]
  customer?: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  }
}

export async function POST(request: NextRequest) {
  console.log('🔔 Shopify webhook empfangen')
  
  // Shopify Custom App Webhook Secret validation
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET
  const shopifyApiSecret = process.env.SHOPIFY_API_SECRET
  // Verwende entweder das dedizierte Webhook-Secret oder als Fallback den API Secret
  const secretToUse = shopifySecret || shopifyApiSecret
  
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256')
  
  if (!hmacHeader) {
    console.error('❌ Fehlender HMAC Header')
    return NextResponse.json({ error: 'Unauthorized: Missing HMAC header' }, { status: 401 })
  }
  
  if (!secretToUse) {
    console.error('❌ Fehlender Secret Key in Umgebungsvariablen')
    return NextResponse.json({ error: 'Unauthorized: Missing secret key' }, { status: 401 })
  }
  
  // Log request headers for debugging
  console.log('📝 Request Headers:', JSON.stringify(Object.fromEntries([...request.headers.entries()]), null, 2))
  
  try {
    // Get request body as text for HMAC validation
    const rawBody = await request.text()
    console.log('📦 Raw-Body empfangen', { length: rawBody.length })
    
    // Parse the JSON - with fallback for parsing errors
    let payload: ShopifyOrder;
    
    try {
      console.log('📦 Versuche JSON zu parsen')
      payload = JSON.parse(rawBody) as ShopifyOrder
    } catch (parseError) {
      console.error('⚠️ Fehler beim ersten Parsen des JSON:', parseError)
      
      // Try alternative parsing - sometimes there are escape issues
      try {
        // Manually remove escape sequences
        const cleanBody = rawBody
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\');
        
        console.log('📦 Body für erneutes Parsen bereinigt', { 
          originalLength: rawBody.length,
          cleanedLength: cleanBody.length 
        })
        
        payload = JSON.parse(cleanBody) as ShopifyOrder
        console.log('✅ Alternative Parsing-Methode erfolgreich')
      } catch (secondError) {
        console.error('❌ Auch alternative Parsing-Methode fehlgeschlagen:', secondError)
        return NextResponse.json({ error: 'Invalid JSON payload - parsing failed' }, { status: 400 })
      }
    }
    
    console.log('📦 Webhook Payload (Auszug):', {
      id: payload.id,
      name: payload.name,
      email: payload.email || payload.customer?.email,
      items_count: payload.line_items?.length || 0
    })
    
    // Validate the HMAC signature
    try {
      const calculatedHmac = crypto
        .createHmac('sha256', secretToUse)
        .update(rawBody)
        .digest('base64')
      
      console.log('🔐 Validiere HMAC:')
      console.log('  Empfangen:', hmacHeader)
      console.log('  Berechnet:', calculatedHmac)
        
      // Verify the hmac
      if (calculatedHmac !== hmacHeader) {
        console.error('❌ HMAC Validierung fehlgeschlagen')
        return NextResponse.json({ error: 'Unauthorized: HMAC validation failed' }, { status: 401 })
      }
      
      console.log('✅ HMAC Validierung erfolgreich')
    } catch (error) {
      console.error('❌ Fehler bei der HMAC Validierung:', error)
      return NextResponse.json({ error: 'HMAC validation error' }, { status: 401 })
    }
    
    // Process the order
    try {
      // Create Supabase client
      const supabase = createClient()
      
      // Extract order information
      const orderId = payload.id
      const orderName = payload.name // Usually in the format #1234
      const customerEmail = payload.customer?.email || payload.email
      const lineItems = payload.line_items || []
      
      console.log(`🛒 Verarbeite Shopify-Bestellung ${orderName} (ID: ${orderId})`)
      
      // Track created licenses to return in the response
      const createdLicenses = []
      
      // Create a license for each purchased product
      for (const item of lineItems) {
        const productId = item.product_id
        const variantId = item.variant_id
        const quantity = item.quantity || 1
        
        console.log(`📦 Verarbeite Produkt: ${item.title}`)
        console.log(`   Produkt-ID: ${productId}, Varianten-ID: ${variantId}, Menge: ${quantity}`)
        
        // Debug-Informationen zu product_template_mapping
        const { data: mappingDebug, error: mappingDebugError } = await supabase
          .from('product_template_mapping')
          .select('*')
        
        if (mappingDebugError) {
          console.error('❌ Fehler beim Abrufen der Mappings:', mappingDebugError)
        } else {
          console.log(`ℹ️ Vorhandene Mappings in der Datenbank: ${mappingDebug.length}`)
        }
        
        // Try to find a matching template based on product ID and variant ID
        let templateMapping = null
        
        // First try with both product and variant
        if (variantId) {
          console.log(`🔍 Suche Mapping für Produkt ${productId} und Variante ${variantId}`)
          const { data, error } = await supabase
            .from('product_template_mapping')
            .select('template_id, templates(id, name)')
            .eq('shopify_product_id', productId.toString())
            .eq('shopify_variant_id', variantId.toString())
            .maybeSingle()
            
          if (error) {
            console.error(`❌ Fehler bei der Suche nach Produkt/Varianten-Mapping:`, error)
          }
          
          if (data) {
            console.log(`✅ Mapping mit Variante gefunden`)
            templateMapping = data
          }
        }
        
        // If no result, try with just product ID
        if (!templateMapping) {
          console.log(`🔍 Suche Mapping nur für Produkt ${productId} (ohne Variante)`)
          const { data, error } = await supabase
            .from('product_template_mapping')
            .select('template_id, templates(id, name)')
            .eq('shopify_product_id', productId.toString())
            .is('shopify_variant_id', null)
            .maybeSingle()
            
          if (error) {
            console.error(`❌ Fehler bei der Suche nach Produkt-Mapping:`, error)
          }
          
          if (data) {
            console.log(`✅ Mapping ohne Variante gefunden`)
            templateMapping = data
          }
        }
        
        // Wenn immer noch kein Mapping gefunden, probiere mit Stringvergleich
        if (!templateMapping && mappingDebug) {
          console.log(`🔍 Versuche alternativen Stringvergleich für Produkt-ID ${productId}`)
          const manualMatch = mappingDebug.find(m => 
            m.shopify_product_id === productId.toString() || 
            parseInt(m.shopify_product_id) === productId
          );
          
          if (manualMatch) {
            console.log(`✅ Manueller Match gefunden für Produkt ${productId}`)
            // Hole Template-Details
            const { data: template } = await supabase
              .from('templates')
              .select('id, name')
              .eq('id', manualMatch.template_id)
              .single()
            
            if (template) {
              templateMapping = {
                template_id: manualMatch.template_id,
                templates: template
              }
            }
          }
        }
        
        if (!templateMapping) {
          console.error(`❌ Kein Template-Mapping gefunden für Produkt ${productId}, Variante ${variantId}`)
          continue
        }
        
        const templateId = templateMapping.template_id
        const templateName = Array.isArray(templateMapping.templates) 
          ? templateMapping.templates[0]?.name || 'Unbenanntes Template'
          : templateMapping.templates?.name || 'Unbenanntes Template'
        
        console.log(`🎯 Template gefunden: ${templateName} (ID: ${templateId})`)
        
        // Generate the specified number of license codes based on quantity
        for (let i = 0; i < quantity; i++) {
          console.log(`🔑 Generiere Lizenz ${i+1} von ${quantity}`)
          
          // Prüfe, ob die Funktion existiert
          const { data: licenseCode, error: codeError } = await supabase.rpc('generate_license_code')
          
          if (codeError) {
            console.error('❌ Fehler beim Aufruf der Funktion generate_license_code:', codeError)
            console.log('⚠️ Versuche, alternative Lizenzgenerierung zu verwenden')
            
            // Generiere einen alternativen Lizenzcode, falls die Funktion nicht verfügbar ist
            const letterChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // ohne I, O zur Vermeidung von Verwechslungen
            const numberChars = '23456789' // ohne 0, 1 zur Vermeidung von Verwechslungen
            let alternativeLicenseCode = ''
            
            // Format: XXX-YYYYY (3 Buchstaben, Bindestrich, 5 Zahlen)
            // Erster Block - 3 Buchstaben
            for (let j = 0; j < 3; j++) {
              alternativeLicenseCode += letterChars.charAt(Math.floor(Math.random() * letterChars.length))
            }
            alternativeLicenseCode += '-'
            // Zweiter Block - 5 Zahlen
            for (let j = 0; j < 5; j++) {
              alternativeLicenseCode += numberChars.charAt(Math.floor(Math.random() * numberChars.length))
            }
            
            // Erstelle die Lizenz in der Datenbank
            const licenseData = {
              license_code: alternativeLicenseCode,
              template_id: templateId,
              shopify_order_id: orderId.toString(),
              used: false
            }
            
            console.log(`📝 Erstelle Lizenz mit Daten:`, licenseData)
            
            const { data: newLicense, error: insertError } = await supabase
              .from('licenses')
              .insert(licenseData)
              .select('*')
              .single()
            
            if (insertError) {
              console.error('❌ Fehler beim Erstellen der Lizenz:', insertError)
              continue
            }
            
            createdLicenses.push({
              license_code: alternativeLicenseCode,
              template_id: templateId,
              template_name: templateName,
              ...newLicense
            })
            
            console.log(`✅ Lizenz erstellt: ${alternativeLicenseCode} für Template ${templateName}`)
            continue
          }
          
          // Create the license in the database
          const licenseData = {
            license_code: licenseCode,
            template_id: templateId,
            shopify_order_id: orderId.toString(),
            used: false
          }
          
          console.log(`📝 Erstelle Lizenz mit Daten:`, licenseData)
          
          const { data: newLicense, error: insertError } = await supabase
            .from('licenses')
            .insert(licenseData)
            .select('*')
            .single()
          
          if (insertError) {
            console.error('❌ Fehler beim Erstellen der Lizenz:', insertError)
            continue
          }
          
          createdLicenses.push({
            license_code: licenseCode,
            template_id: templateId,
            template_name: templateName,
            ...newLicense
          })
          
          console.log(`✅ Lizenz erstellt: ${licenseCode} für Template ${templateName}`)
        }
      }
      
      // TODO: Here you could send an email to the customer with their license codes
      if (createdLicenses.length > 0 && customerEmail) {
        console.log(`📧 Könnte E-Mail senden an ${customerEmail} mit ${createdLicenses.length} Lizenzcodes`)
      }
      
      return NextResponse.json({ 
        success: true,
        message: `${createdLicenses.length} Lizenzen für Bestellung ${orderName} erstellt`,
        licenses: createdLicenses
      })
    } catch (error) {
      console.error('❌ Fehler bei der Verarbeitung des Shopify-Webhooks:', error)
      return NextResponse.json({ 
        error: 'Interner Serverfehler bei der Webhook-Verarbeitung',
        message: error instanceof Error ? error.message : String(error)
      }, { status: 500 })
    }
  } catch (outerError) {
    console.error('❌ Kritischer Fehler im Webhook-Handler:', outerError)
    return NextResponse.json({ 
      error: 'Kritischer Fehler im Webhook-Handler',
      message: outerError instanceof Error ? outerError.message : String(outerError)
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    error: 'Diese API-Route unterstützt nur POST-Anfragen' 
  }, { status: 405 })
}