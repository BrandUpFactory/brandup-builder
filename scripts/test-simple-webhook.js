/**
 * Einfaches Test-Skript für den Simple-Test-Webhook
 */

const https = require('https');
const http = require('http');

// Konfiguration
const TEST_URL = 'http://localhost:3000/api/shopify-simple-test';

// Beispiel-Bestellung
const testPayload = {
  id: 12345678901234,
  name: "#1001",
  test: true,
  product_id: 15067425112408 // Korrekte Shopify Produkt-ID aus: https://admin.shopify.com/store/1aa0nn-wh/products/15067425112408
};

console.log('\n🌐 Sende Test-Request an:', TEST_URL);

const payloadString = JSON.stringify(testPayload);
const urlObj = new URL(TEST_URL);

const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
  path: urlObj.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payloadString.length,
    'X-Test-Header': 'test-value'
  }
};

const requestLib = urlObj.protocol === 'https:' ? https : http;
const req = requestLib.request(options, (res) => {
  console.log(`\n📢 Statuscode: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📄 Response Body:');
    
    try {
      if (responseData.trim()) {
        const jsonResponse = JSON.parse(responseData);
        console.log(JSON.stringify(jsonResponse, null, 2));
      } else {
        console.log('(Leere Antwort)');
      }
    } catch (e) {
      console.log('Fehler beim Parsen der Antwort:', e.message);
      console.log('Rohdaten:', responseData);
    }
    
    console.log('\n✅ Test abgeschlossen');
  });
});

req.on('error', (e) => {
  console.log(`\n❌ Fehler beim Senden der Anfrage: ${e.message}`);
});

req.write(payloadString);
req.end();

console.log('\n⏳ Anfrage gesendet. Warte auf Antwort...');