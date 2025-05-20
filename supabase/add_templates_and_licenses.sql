-- SQL script to add 5 new templates and licenses to the BrandUp Builder

-- Add 5 new templates
INSERT INTO templates (name, description, image_url, edit_url, buy_url, active, created_at)
VALUES 
  (
    'Modern Hero Section', 
    'Ein modernes Hero-Banner mit einem klaren Call-to-Action für Ihre Shopify-Seite', 
    '/BG_Card_55.jpg', 
    '/editor/hero', 
    '/templates', 
    true, 
    NOW()
  ),
  (
    'Premium Hero Banner', 
    'Ein Premium-Banner mit flexiblen Anpassungsoptionen für Ihr Shopify-Theme', 
    '/BG_Card_55.jpg', 
    '/editor/hero', 
    '/templates', 
    true, 
    NOW()
  ),
  (
    'Product Features Section', 
    'Zeigen Sie die wichtigsten Funktionen und Vorteile Ihrer Produkte an', 
    '/BG_Card_55.jpg', 
    '/editor/hero', 
    '/templates', 
    true, 
    NOW()
  ),
  (
    'Newsletter Sign-up', 
    'Ein ansprechendes Newsletter-Anmeldeformular mit flexiblen Gestaltungsmöglichkeiten', 
    '/BG_Card_55.jpg', 
    '/editor/hero', 
    '/templates', 
    true, 
    NOW()
  ),
  (
    'Testimonial Slider', 
    'Zeigen Sie Kundenbewertungen in einem interaktiven Slider an', 
    '/BG_Card_55.jpg', 
    '/editor/hero', 
    '/templates', 
    true, 
    NOW()
  );

-- Make sure the licenses table exists (if not already created)
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  license_key TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activation_date TIMESTAMP WITH TIME ZONE,
  expiration_date TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create a function to generate a random license key
CREATE OR REPLACE FUNCTION generate_license_key() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Removed confusing characters
  result TEXT := '';
  i INTEGER;
  sections INTEGER := 4;
  section_length INTEGER := 5;
BEGIN
  FOR s IN 1..sections LOOP
    FOR i IN 1..section_length LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    IF s < sections THEN
      result := result || '-';
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a function to generate license keys if user already exists
CREATE OR REPLACE FUNCTION create_license_for_user(user_uuid UUID) RETURNS UUID AS $$
DECLARE
  license_uuid UUID;
  new_license_key TEXT;
BEGIN
  -- Generate a unique license key
  LOOP
    new_license_key := generate_license_key();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM licenses WHERE license_key = new_license_key);
  END LOOP;
  
  -- Insert the new license
  INSERT INTO licenses (user_id, license_key, active, created_at, activation_date, expiration_date)
  VALUES (
    user_uuid, 
    new_license_key, 
    true, 
    NOW(), 
    NOW(), 
    (NOW() + INTERVAL '1 year')
  )
  RETURNING id INTO license_uuid;
  
  RETURN license_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create a table to track which templates a user has access to (if not exists)
CREATE TABLE IF NOT EXISTS user_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES templates (id) ON DELETE CASCADE,
  CONSTRAINT unique_user_template UNIQUE (user_id, template_id)
);

-- This function can be used to give a specific user access to all templates
CREATE OR REPLACE FUNCTION grant_all_templates_to_user(user_uuid UUID) RETURNS VOID AS $$
DECLARE
  template_record RECORD;
BEGIN
  FOR template_record IN SELECT id FROM templates WHERE active = true LOOP
    INSERT INTO user_templates (user_id, template_id)
    VALUES (user_uuid, template_record.id)
    ON CONFLICT (user_id, template_id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- To use these functions, you can run the following commands in the SQL editor:

-- Create a license for an existing user (replace with the actual user UUID):
-- SELECT create_license_for_user('replace-with-user-uuid-here');

-- Grant access to all templates for a user (replace with the actual user UUID):
-- SELECT grant_all_templates_to_user('replace-with-user-uuid-here');

-- Example: If you want to create 5 licenses and grant template access automatically
-- You would first need to identify or create 5 users, then run the above functions for each.