/**
 * Test-Skript für den erweiterten Debug-Webhook
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');
const fs = require('fs');

// Konfiguration
const API_SECRET = process.env.SHOPIFY_API_SECRET || '01fb4b03c54c798dbde3466ac838913a';
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '6e4331044b9af29e8abf549c227b385bdaeadc8cfaddc2d5981151a26f4eeeb7';
const DEBUG_URL = 'http://localhost:3000/api/shopify-debug-webhook';

// Secret auswählen
const secretToUse = WEBHOOK_SECRET || API_SECRET;
console.log('\n🔐 Verwende folgendes Secret für HMAC:', secretToUse);

// Log-Datei initialisieren
const logFilePath = './debug-webhook-test.log';
fs.writeFileSync(logFilePath, `=== Debug-Webhook-Test ${new Date().toISOString()} ===\n\n`);

function log(message) {
  console.log(message);
  fs.appendFileSync(logFilePath, message + '\n');
}

// Beispiel-Bestellung mit Produkt-ID
const orderPayload = {
  id: 12345678901234,
  name: "#1001",
  email: "customer@example.com",
  created_at: new Date().toISOString(),
  line_items: [
    {
      id: 987654321,
      product_id: 15067425112408, // Korrekte Shopify Produkt-ID aus: https://admin.shopify.com/store/1aa0nn-wh/products/15067425112408
      variant_id: null, // Keine spezifische Variante verwenden
      quantity: 1,
      title: "Test Template",
      price: "19.99",
      sku: "TEMPLATE-001"
    }
  ],
  customer: {
    id: 123456789,
    email: "customer@example.com",
    first_name: "Test",
    last_name: "User"
  }
};

log('\n📦 Verwendete Produkt-ID für Test:', orderPayload.line_items[0].product_id);
log('📦 Verwendete Varianten-ID für Test:', orderPayload.line_items[0].variant_id);

// Bereite Webhook vor
const orderJSON = JSON.stringify(orderPayload);

// HMAC Signatur
const hmac = crypto
  .createHmac('sha256', secretToUse)
  .update(orderJSON)
  .digest('base64');

log('\n🔏 HMAC-Signatur generiert:', hmac);

// URL parsen
const urlObj = new URL(DEBUG_URL);
const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
  path: urlObj.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': orderJSON.length,
    'X-Shopify-Hmac-SHA256': hmac,
    'X-Shopify-Topic': 'orders/create',
    'X-Shopify-Shop-Domain': '1aa0nn-wh.myshopify.com',
    'X-Shopify-API-Version': '2023-07',
    'X-Shopify-Order-Id': orderPayload.id.toString()
  }
};

log('\n🌐 Sende Debug-Webhook-Request an:', DEBUG_URL);
log('\n📋 Request Headers:');
Object.entries(options.headers).forEach(([key, value]) => {
  log(`  ${key}: ${value}`);
});

// Sende Request
log('\n🚀 Sende Anfrage...');
const requestLib = urlObj.protocol === 'https:' ? https : http;
const req = requestLib.request(options, (res) => {
  log(`\n📢 Statuscode: ${res.statusCode}`);
  log('📢 Response Headers:');
  Object.entries(res.headers).forEach(([key, value]) => {
    log(`  ${key}: ${value}`);
  });
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    log('\n📄 Response erhalten');
    
    try {
      if (responseData.trim()) {
        const jsonResponse = JSON.parse(responseData);
        log('\n✅ Debug-Ergebnisse erhalten');
        
        // Speichere die vollständige Antwort in einer Datei
        const detailLogPath = './debug-webhook-details.json';
        fs.writeFileSync(detailLogPath, JSON.stringify(jsonResponse, null, 2));
        log(`\n📝 Detaillierte Debug-Informationen wurden in ${detailLogPath} gespeichert`);
        
        // Zeige Zusammenfassung
        if (jsonResponse.success) {
          log(`\n✅ Erfolg: ${jsonResponse.message}`);
          if (jsonResponse.licenses && jsonResponse.licenses.length > 0) {
            log(`\n🔑 Erzeugte Lizenzen (${jsonResponse.licenses.length}):`);
            jsonResponse.licenses.forEach((license, idx) => {
              log(`  ${idx + 1}. ${license.license_code} für ${license.template_name}`);
            });
          }
        } else {
          log(`\n❌ Fehler: ${jsonResponse.error}`);
          if (jsonResponse.message) {
            log(`   Details: ${jsonResponse.message}`);
          }
        }
        
        // Zeige wichtige Debug-Logs
        if (jsonResponse.debug && jsonResponse.debug.length > 0) {
          log('\n🔍 Wichtige Debug-Informationen:');
          
          // Filter für wichtige Fehler-Logs
          const errorLogs = jsonResponse.debug.filter(entry => 
            entry.message.startsWith('❌') || 
            entry.message.startsWith('⚠️')
          );
          
          if (errorLogs.length > 0) {
            log('\n⚠️ Fehler und Warnungen:');
            errorLogs.forEach(entry => {
              log(`  ${entry.timestamp} ${entry.message}`);
              if (entry.details) log(`    Details: ${JSON.stringify(entry.details)}`);
              if (entry.error) log(`    Error: ${entry.error.message}`);
            });
          }
          
          // Letzte Schritte
          const lastSteps = jsonResponse.debug.slice(-5);
          log('\n📋 Letzte Verarbeitungsschritte:');
          lastSteps.forEach(entry => {
            log(`  ${entry.timestamp} ${entry.message}`);
          });
        }
      } else {
        log('\n⚠️ Leere Antwort vom Server');
      }
    } catch (e) {
      log('\n❌ Fehler beim Parsen der Antwort:', e.message);
      // Speichere die Rohdaten in einer Datei für die Diagnose
      fs.writeFileSync('./debug-webhook-raw.txt', responseData);
      log('\n📝 Rohdaten wurden in debug-webhook-raw.txt gespeichert');
    }
    
    log('\n📝 Test abgeschlossen');
  });
});

req.on('error', (e) => {
  log(`\n❌ Fehler beim Senden des Webhooks: ${e.message}`);
});

// Sende den Request-Body
req.write(orderJSON);
req.end();

log('\n⏳ Debug-Webhook-Request gesendet. Warte auf Antwort...');