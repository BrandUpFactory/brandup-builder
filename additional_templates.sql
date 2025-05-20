-- Einfügen von 5 neuen Templates
INSERT INTO templates (name, description, image_url, edit_url, buy_url, active)
VALUES 
(
  'Product Card', 
  'Responsive Produkt-Karte mit Bild, Titel, Preis und Kaufbutton. Ideal für Produktkataloge oder Featured Products Sektionen.',
  '/templates/product-card.jpg',
  '/editor/product-card',
  'https://brandupelements.com/products/product-card',
  true
),
(
  'Newsletter', 
  'Newsletter Anmeldung mit Formular, Hintergrundbild und CTA-Text. Perfekt für Email-Marketing und Lead-Generierung.',
  '/templates/newsletter.jpg',
  '/editor/newsletter',
  'https://brandupelements.com/products/newsletter',
  true
),
(
  'Video Banner', 
  'Fullscreen Video-Banner mit Überschrift und Call-to-Action Button. Ideal für Landingpages und Produktpräsentationen.',
  '/templates/video-banner.jpg',
  '/editor/video-banner',
  'https://brandupelements.com/products/video-banner',
  true
),
(
  'FAQ Accordion', 
  'Akkordeon-Style FAQ Sektion mit klappbaren Antworten. Optimiert für Kundenservice und Informationsseiten.',
  '/templates/faq-accordion.jpg',
  '/editor/faq-accordion',
  'https://brandupelements.com/products/faq-accordion',
  true
),
(
  'Image Gallery', 
  'Responsive Bilder-Galerie mit Lightbox-Funktion und Thumbnails. Perfekt für Produktfotos und Portfolios.',
  '/templates/image-gallery.jpg',
  '/editor/image-gallery',
  'https://brandupelements.com/products/image-gallery',
  true
);