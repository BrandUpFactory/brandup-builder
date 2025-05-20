/**
 * Einfaches Test-Skript für den Debug-Webhook
 */

const https = require('https');
const http = require('http');

// Konfiguration
const DEBUG_URL = 'http://localhost:3000/api/debug-webhook';

// Beispiel-Bestellung mit Produkt-ID
const orderPayload = {
  id: 12345678901234,
  name: "#1001",
  email: "customer@example.com",
  line_items: [
    {
      id: 987654321,
      product_id: 9568022962438, // Diese Produkt-ID sollte mit einem Eintrag in product_template_mapping übereinstimmen
      variant_id: 47260059009286,
      quantity: 1,
      title: "Test Template"
    }
  ]
};

console.log('\n🌐 Sende Debug-Request an:', DEBUG_URL);

const orderJSON = JSON.stringify(orderPayload);
const urlObj = new URL(DEBUG_URL);

const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
  path: urlObj.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': orderJSON.length
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
    console.log(responseData);
    
    try {
      if (responseData.trim()) {
        const jsonResponse = JSON.parse(responseData);
        console.log('\n✅ JSON Antwort:', JSON.stringify(jsonResponse, null, 2));
      } else {
        console.log('\n⚠️ Leere Antwort erhalten');
      }
    } catch (e) {
      console.log('\n❌ Fehler beim Parsen der Antwort:', e.message);
      console.log('❌ Rohdaten:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.log(`\n❌ Fehler beim Senden des Requests: ${e.message}`);
});

req.write(orderJSON);
req.end();

console.log('\n⏳ Debug-Request gesendet. Warte auf Antwort...');