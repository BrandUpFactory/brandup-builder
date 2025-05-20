/**
 * Dieses Skript simuliert einen Shopify-Webhook, um die Integration zu testen.
 * 
 * Verwendung:
 * 1. Füge deine tatsächliche Produkt-ID in die orderPayload ein
 * 2. Stelle sicher, dass deine Anwendung lokal oder auf einem Server läuft
 * 3. Führe das Skript aus mit: node test-shopify-webhook.js
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');

// Konfiguration - passe diese Werte an
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '6e4331044b9af29e8abf549c227b385bdaeadc8cfaddc2d5981151a26f4eeeb7';
const WEBHOOK_URL = 'http://localhost:3000/api/shopify-webhook'; // Anpassen an deine URL

// Beispiel-Bestellung (anpassen an deine Produkt-IDs)
const orderPayload = {
  id: 12345678901234,
  name: "#1001",
  email: "customer@example.com",
  created_at: new Date().toISOString(),
  line_items: [
    {
      id: 987654321,
      product_id: 1234567890, // WICHTIG: Hier deine tatsächliche Produkt-ID eintragen
      variant_id: 98765432109876,
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

// Bereite den Webhook-Request vor
const orderJSON = JSON.stringify(orderPayload);

// Erstelle die HMAC-Signatur
const hmac = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(orderJSON)
  .digest('base64');

console.log('Generierte HMAC-Signatur:', hmac);

// Parse die URL
const urlObj = new URL(WEBHOOK_URL);
const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
  path: urlObj.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': orderJSON.length,
    'X-Shopify-Hmac-SHA256': hmac
  }
};

console.log('Sende Webhook-Request an:', WEBHOOK_URL);
console.log('Mit Payload:', orderJSON);

// Sende den Request
const requestLib = urlObj.protocol === 'https:' ? https : http;
const req = requestLib.request(options, (res) => {
  console.log('Statuscode:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    try {
      const jsonResponse = JSON.parse(data);
      console.log('Verarbeitete Lizenzen:', JSON.stringify(jsonResponse, null, 2));
    } catch (e) {
      console.error('Fehler beim Parsen der Antwort:', e);
    }
  });
});

req.on('error', (e) => {
  console.error('Fehler beim Senden des Webhooks:', e);
});

// Sende den Anfrage-Body
req.write(orderJSON);
req.end();

console.log('Webhook-Request gesendet. Warte auf Antwort...');