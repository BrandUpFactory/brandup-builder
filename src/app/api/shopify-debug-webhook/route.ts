import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Typen für Shopify-Webhook-Payload
interface ShopifyOrderItem {
  id: number
  product_id: number
  variant_id: number
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

// Debug-Logger
class DebugLogger {
  logs: any[] = [];
  startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.log('🔍 Debug-Webhook gestartet');
  }

  log(message: string, details?: any, error?: any) {
    const timestamp = Date.now() - this.startTime;
    const entry = {
      timestamp: `+${timestamp}ms`,
      message,
      details: details || null,
      error: error ? {
        message: error.message || String(error),
        stack: error.stack,
        name: error.name
      } : null
    };
    
    this.logs.push(entry);
    
    // Log auch zur Konsole
    console.log(`[${entry.timestamp}] ${message}`);
    if (details) console.log('  Details:', JSON.stringify(details));
    if (error) console.error('  ERROR:', error);
  }

  getFormattedLogs() {
    return this.logs;
  }
}

export async function POST(request: NextRequest) {
  const logger = new DebugLogger();
  
  try {
    // Debug-Informationen zu Umgebungsvariablen
    logger.log('📋 Umgebungsvariablen', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ (gesetzt)' : '✗ (nicht gesetzt)',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ (gesetzt)' : '✗ (nicht gesetzt)',
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? '✓ (gesetzt)' : '✗ (nicht gesetzt)',
      SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET ? '✓ (gesetzt)' : '✗ (nicht gesetzt)',
      SHOPIFY_SHOP_NAME: process.env.SHOPIFY_SHOP_NAME ? '✓ (gesetzt)' : '✗ (nicht gesetzt)',
      SHOPIFY_WEBHOOK_SECRET: process.env.SHOPIFY_WEBHOOK_SECRET ? '✓ (gesetzt)' : '✗ (nicht gesetzt)',
    });
    
    // Logge die Header
    logger.log('📋 Request-Headers', Object.fromEntries([...request.headers.entries()]));
    
    // Shopify-Secret für HMAC-Validierung
    const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;
    // Verwende entweder das dedizierte Webhook-Secret oder den API Secret als Fallback
    const secretToUse = shopifySecret || shopifyApiSecret;
    
    logger.log('🔐 Secret für HMAC-Validierung', { 
      useWebhookSecret: !!shopifySecret,
      useApiSecret: !!shopifyApiSecret && !shopifySecret
    });
    
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    logger.log('🔐 HMAC-Header', { hmacHeader });
    
    // Prüfe, ob notwendige Komponenten fehlen
    if (!hmacHeader) {
      logger.log('❌ Fehlender HMAC-Header');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized: Missing HMAC header',
        debug: logger.getFormattedLogs()
      }, { status: 401 });
    }
    
    if (!secretToUse) {
      logger.log('❌ Fehlender Secret-Key in Umgebungsvariablen');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized: Missing secret key',
        debug: logger.getFormattedLogs()
      }, { status: 401 });
    }
    
    // Raw-Body für HMAC-Validierung
    let rawBody: string;
    try {
      rawBody = await request.text();
      logger.log('📦 Raw-Body empfangen', { length: rawBody.length });
    } catch (error) {
      logger.log('❌ Fehler beim Lesen des Request-Body', null, error);
      return NextResponse.json({ 
        success: false, 
        error: 'Fehler beim Lesen des Request-Body',
        debug: logger.getFormattedLogs()
      }, { status: 400 });
    }
    
    // JSON-Body parsen
    let payload: ShopifyOrder;
    try {
      // Parse the raw body data as JSON
      logger.log('📦 Versuche JSON zu parsen', { bodyLength: rawBody.length });
      try {
        payload = JSON.parse(rawBody) as ShopifyOrder;
      } catch (parseError) {
        logger.log('⚠️ Fehler beim ersten Parsen des JSON', null, parseError);
        // Manchmal hat der rawBody Escape-Zeichen - manuell entfernen und erneut versuchen
        try {
          // Manuell Escape-Sequenzen entfernen
          const cleanBody = rawBody
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\');
            
          logger.log('📦 Body für erneutes Parsen bereinigt', { 
            originalLength: rawBody.length,
            cleanedLength: cleanBody.length 
          });
          
          // Versuche erneut zu parsen
          payload = JSON.parse(cleanBody) as ShopifyOrder;
          logger.log('✅ Alternative Parsing-Methode erfolgreich');
        } catch (secondError) {
          logger.log('❌ Auch alternative Parsing-Methode fehlgeschlagen', null, secondError);
          throw secondError;
        }
      }
      
      logger.log('📦 JSON-Body erfolgreich geparst', {
        id: payload.id,
        name: payload.name,
        email: payload.email || payload.customer?.email,
        items_count: payload.line_items?.length || 0
      });
    } catch (error) {
      logger.log('❌ Fehler beim Parsen des JSON-Body', { 
        rawBodyStart: rawBody.substring(0, 100) + '...',
        rawBodyLength: rawBody.length
      }, error);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON payload',
        debug: logger.getFormattedLogs()
      }, { status: 400 });
    }
    
    // HMAC-Signatur validieren
    try {
      const calculatedHmac = crypto
        .createHmac('sha256', secretToUse)
        .update(rawBody)
        .digest('base64');
      
      logger.log('🔐 Berechne HMAC-Signatur', { 
        received: hmacHeader,
        calculated: calculatedHmac 
      });
      
      // Verify the hmac
      if (calculatedHmac !== hmacHeader) {
        logger.log('❌ HMAC-Validierung fehlgeschlagen', {
          received: hmacHeader,
          calculated: calculatedHmac,
        });
        return NextResponse.json({ 
          success: false, 
          error: 'Unauthorized: HMAC validation failed',
          debug: logger.getFormattedLogs()
        }, { status: 401 });
      }
      
      logger.log('✅ HMAC-Validierung erfolgreich');
    } catch (error) {
      logger.log('❌ Fehler bei der HMAC-Validierung', null, error);
      return NextResponse.json({ 
        success: false, 
        error: 'HMAC validation error',
        debug: logger.getFormattedLogs()
      }, { status: 401 });
    }
    
    // Ab hier verarbeiten wir die Bestellung
    try {
      // Supabase-Client erstellen
      logger.log('🔌 Erstelle Supabase-Client');
      let supabase;
      
      try {
        supabase = createClient();
        logger.log('✅ Supabase-Client erstellt');
      } catch (error) {
        logger.log('❌ Fehler beim Erstellen des Supabase-Clients', null, error);
        return NextResponse.json({ 
          success: false, 
          error: 'Supabase client creation failed',
          debug: logger.getFormattedLogs()
        }, { status: 500 });
      }
      
      // Test der Supabase-Verbindung
      try {
        logger.log('🔌 Teste Supabase-Verbindung');
        const { data: testData, error: testError } = await supabase
          .from('templates')
          .select('id, name')
          .limit(1);
        
        if (testError) {
          logger.log('❌ Supabase-Verbindungstest fehlgeschlagen', null, testError);
          return NextResponse.json({ 
            success: false, 
            error: 'Supabase connection test failed',
            details: testError,
            debug: logger.getFormattedLogs()
          }, { status: 500 });
        }
        
        logger.log('✅ Supabase-Verbindungstest erfolgreich', { testData });
      } catch (error) {
        logger.log('❌ Fehler beim Supabase-Verbindungstest', null, error);
        return NextResponse.json({ 
          success: false, 
          error: 'Supabase connection test error',
          debug: logger.getFormattedLogs()
        }, { status: 500 });
      }
      
      // Bestellinformationen extrahieren
      const orderId = payload.id;
      const orderName = payload.name; // Usually in the format #1234
      const customerEmail = payload.customer?.email || payload.email;
      const lineItems = payload.line_items || [];
      
      logger.log('🛒 Bestellinformationen', {
        orderId,
        orderName,
        customerEmail,
        itemCount: lineItems.length
      });
      
      // Erstelle für jeden Artikel Lizenzen
      const createdLicenses = [];
      
      for (const item of lineItems) {
        const productId = item.product_id;
        const variantId = item.variant_id;
        const quantity = item.quantity || 1;
        
        logger.log('📦 Verarbeite Artikel', {
          title: item.title,
          productId,
          variantId,
          quantity
        });
        
        // Debug-Informationen zu product_template_mapping
        let mappingDebug;
        try {
          const { data: mappings, error: mappingError } = await supabase
            .from('product_template_mapping')
            .select('*');
          
          if (mappingError) {
            logger.log('❌ Fehler beim Abrufen der Mappings', null, mappingError);
          } else {
            mappingDebug = mappings;
            logger.log('ℹ️ Vorhandene Mappings', {
              count: mappings.length,
              mappings
            });
          }
        } catch (error) {
          logger.log('❌ Fehler beim Abrufen der Mappings', null, error);
        }
        
        // Template-Mapping suchen
        let templateMapping = null;
        
        // Strategie 1: Produkt-ID + Varianten-ID
        if (variantId) {
          logger.log('🔍 Suche Mapping mit Produkt-ID und Varianten-ID', {
            productId,
            variantId
          });
          
          try {
            const { data, error } = await supabase
              .from('product_template_mapping')
              .select('template_id, templates(id, name)')
              .eq('shopify_product_id', productId.toString())
              .eq('shopify_variant_id', variantId.toString())
              .maybeSingle();
            
            if (error) {
              logger.log('❌ Fehler bei der Suche nach Produkt/Varianten-Mapping', null, error);
            } else if (data) {
              logger.log('✅ Mapping mit Variante gefunden', { data });
              templateMapping = data;
            } else {
              logger.log('ℹ️ Kein Mapping mit Variante gefunden');
            }
          } catch (error) {
            logger.log('❌ Fehler bei der Suche nach Produkt/Varianten-Mapping', null, error);
          }
        }
        
        // Strategie 2: Nur Produkt-ID
        if (!templateMapping) {
          logger.log('🔍 Suche Mapping nur mit Produkt-ID', { productId });
          
          try {
            const { data, error } = await supabase
              .from('product_template_mapping')
              .select('template_id, templates(id, name)')
              .eq('shopify_product_id', productId.toString())
              .is('shopify_variant_id', null)
              .maybeSingle();
            
            if (error) {
              logger.log('❌ Fehler bei der Suche nach Produkt-Mapping', null, error);
            } else if (data) {
              logger.log('✅ Mapping ohne Variante gefunden', { data });
              templateMapping = data;
            } else {
              logger.log('ℹ️ Kein Mapping ohne Variante gefunden');
            }
          } catch (error) {
            logger.log('❌ Fehler bei der Suche nach Produkt-Mapping', null, error);
          }
        }
        
        // Strategie 3: Manueller String-Vergleich
        if (!templateMapping && mappingDebug) {
          logger.log('🔍 Versuche alternativen String-Vergleich für Produkt-ID', { 
            productId,
            productIdType: typeof productId
          });
          
          try {
            const manualMatch = mappingDebug.find((m: any) => 
              m.shopify_product_id === productId.toString() || 
              parseInt(m.shopify_product_id) === productId
            );
            
            if (manualMatch) {
              logger.log('✅ Manueller Match gefunden', { manualMatch });
              
              // Template-Details holen
              try {
                const { data: template, error } = await supabase
                  .from('templates')
                  .select('id, name')
                  .eq('id', manualMatch.template_id)
                  .single();
                
                if (error) {
                  logger.log('❌ Fehler beim Abrufen der Template-Details', null, error);
                } else if (template) {
                  logger.log('✅ Template-Details abgerufen', { template });
                  templateMapping = {
                    template_id: manualMatch.template_id,
                    templates: template
                  };
                }
              } catch (error) {
                logger.log('❌ Fehler beim Abrufen der Template-Details', null, error);
              }
            } else {
              logger.log('ℹ️ Kein manueller Match gefunden');
            }
          } catch (error) {
            logger.log('❌ Fehler beim manuellen String-Vergleich', null, error);
          }
        }
        
        // Kein passendes Template gefunden
        if (!templateMapping) {
          logger.log('❌ Kein Template-Mapping gefunden', {
            productId,
            variantId
          });
          continue;
        }
        
        // Template-Informationen extrahieren
        const templateId = templateMapping.template_id;
        const templateName = Array.isArray(templateMapping.templates) 
          ? templateMapping.templates[0]?.name || 'Unbenanntes Template'
          : templateMapping.templates?.name || 'Unbenanntes Template';
        
        logger.log('🎯 Template gefunden', {
          templateId,
          templateName
        });
        
        // Lizenzen basierend auf Menge generieren
        for (let i = 0; i < quantity; i++) {
          logger.log(`🔑 Generiere Lizenz ${i+1} von ${quantity}`);
          
          // Versuche, die Lizenzcode-Funktion zu nutzen
          let licenseCode;
          let usingAlternative = false;
          
          try {
            const { data: generatedCode, error: codeError } = await supabase.rpc('generate_license_code');
            
            if (codeError) {
              logger.log('⚠️ Fehler bei der Lizenzcode-Generierung', null, codeError);
              logger.log('⚠️ Verwende alternative Generierungsmethode');
              usingAlternative = true;
            } else {
              licenseCode = generatedCode;
              logger.log('✅ Lizenzcode generiert', { licenseCode });
            }
          } catch (error) {
            logger.log('❌ Fehler bei der Lizenzcode-Generierung', null, error);
            logger.log('⚠️ Verwende alternative Generierungsmethode');
            usingAlternative = true;
          }
          
          // Alternative Generierung, falls nötig
          if (usingAlternative) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            licenseCode = '';
            
            // Format: XXX-XXXX-XXXX
            for (let j = 0; j < 3; j++) {
              licenseCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            licenseCode += '-';
            for (let j = 0; j < 4; j++) {
              licenseCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            licenseCode += '-';
            for (let j = 0; j < 4; j++) {
              licenseCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            logger.log('✅ Alternativer Lizenzcode generiert', { licenseCode });
          }
          
          // Lizenz in der Datenbank erstellen
          const licenseData = {
            license_code: licenseCode,
            template_id: templateId,
            shopify_order_id: orderId.toString(),
            used: false
          };
          
          logger.log('📝 Erstelle Lizenz in der Datenbank', licenseData);
          
          try {
            const { data: newLicense, error: insertError } = await supabase
              .from('licenses')
              .insert(licenseData)
              .select('*')
              .single();
            
            if (insertError) {
              logger.log('❌ Fehler beim Erstellen der Lizenz', null, insertError);
              continue;
            }
            
            logger.log('✅ Lizenz erfolgreich erstellt', newLicense);
            
            createdLicenses.push({
              license_code: licenseCode,
              template_id: templateId,
              template_name: templateName,
              ...newLicense
            });
          } catch (error) {
            logger.log('❌ Fehler beim Erstellen der Lizenz', null, error);
          }
        }
      }
      
      // E-Mail-Benachrichtigung (für zukünftige Implementierung)
      if (createdLicenses.length > 0 && customerEmail) {
        logger.log('📧 Könnte E-Mail senden', {
          email: customerEmail,
          licenseCount: createdLicenses.length
        });
      }
      
      logger.log('✅ Webhook-Verarbeitung abgeschlossen', {
        createdLicenses: createdLicenses.length
      });
      
      return NextResponse.json({ 
        success: true,
        message: `${createdLicenses.length} Lizenzen für Bestellung ${orderName} erstellt`,
        licenses: createdLicenses,
        debug: logger.getFormattedLogs()
      });
    } catch (error) {
      logger.log('❌ Unerwarteter Fehler bei der Webhook-Verarbeitung', null, error);
      return NextResponse.json({ 
        success: false,
        error: 'Unerwarteter Fehler bei der Webhook-Verarbeitung',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        debug: logger.getFormattedLogs()
      }, { status: 500 });
    }
  } catch (error) {
    logger.log('❌ Kritischer Fehler im Debug-Webhook', null, error);
    return NextResponse.json({ 
      success: false,
      error: 'Kritischer Fehler im Debug-Webhook',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      debug: logger.getFormattedLogs()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    error: 'Diese API-Route unterstützt nur POST-Anfragen' 
  }, { status: 405 });
}