/**
 * Verbessertes Test-Skript mit ausführlichen Logs für Webhook-Debugging
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');
const fs = require('fs');

// Konfiguration
const API_SECRET = process.env.SHOPIFY_API_SECRET || '01fb4b03c54c798dbde3466ac838913a';
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '6e4331044b9af29e8abf549c227b385bdaeadc8cfaddc2d5981151a26f4eeeb7';
const WEBHOOK_URL = 'http://localhost:3000/api/shopify-webhook';

// Secret auswählen
const secretToUse = WEBHOOK_SECRET || API_SECRET;
console.log('\n🔐 Verwende folgendes Secret für HMAC:', secretToUse);

// Log-Datei initialisieren
const logFilePath = './webhook-test.log';
fs.writeFileSync(logFilePath, `=== Webhook-Test ${new Date().toISOString()} ===\n\n`);

function log(message) {
  console.log(message);
  fs.appendFileSync(logFilePath, message + '\n');
}

// Logge Umgebungsvariablen (ohne sensible Werte)
log('\n📋 Umgebungsvariablen:');
log(`SHOPIFY_API_KEY: ${process.env.SHOPIFY_API_KEY ? '✓ (gesetzt)' : '✗ (nicht gesetzt)'}`);
log(`SHOPIFY_API_SECRET: ${process.env.SHOPIFY_API_SECRET ? '✓ (gesetzt)' : '✗ (nicht gesetzt)'}`);
log(`SHOPIFY_SHOP_NAME: ${process.env.SHOPIFY_SHOP_NAME ? '✓ (gesetzt)' : '✗ (nicht gesetzt)'}`);
log(`SHOPIFY_WEBHOOK_SECRET: ${process.env.SHOPIFY_WEBHOOK_SECRET ? '✓ (gesetzt)' : '✗ (nicht gesetzt)'}`);

// Beispiel-Bestellung mit Produkt-ID
const orderPayload = {
  id: 12345678901234,
  name: "#1001",
  email: "customer@example.com",
  created_at: new Date().toISOString(),
  line_items: [
    {
      id: 987654321,
      product_id: 9568022962438, // Diese Produkt-ID muss mit einem Eintrag in product_template_mapping übereinstimmen
      variant_id: 47260059009286,
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
const urlObj = new URL(WEBHOOK_URL);
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

log('\n🌐 Sende Webhook-Request an:', WEBHOOK_URL);
log('🧪 Webhook Payload:', orderJSON);
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
    log('\n📄 Response Body:', responseData);
    
    try {
      if (responseData.trim()) {
        const jsonResponse = JSON.parse(responseData);
        log('\n✅ Verarbeitetes Ergebnis:', JSON.stringify(jsonResponse, null, 2));
      } else {
        log('\n⚠️ Leere Antwort vom Server');
      }
    } catch (e) {
      log('\n❌ Fehler beim Parsen der Antwort:', e.message);
      log('❌ Rohe Antwortdaten:', responseData);
    }
    
    log('\n📝 Test abgeschlossen. Ergebnisse wurden in webhook-test.log gespeichert.');
  });
});

req.on('error', (e) => {
  log(`\n❌ Fehler beim Senden des Webhooks: ${e.message}`);
});

// Sende den Request-Body
req.write(orderJSON);
req.end();

log('\n⏳ Webhook-Request gesendet. Warte auf Antwort...');