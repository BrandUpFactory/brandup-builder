-- Schema für das Access-Code-System

-- Tabelle für Templates (falls noch nicht vorhanden)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  edit_url TEXT,
  buy_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelle für Lizenz-Codes
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_code TEXT NOT NULL UNIQUE,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  shopify_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT false,
  activation_date TIMESTAMP WITH TIME ZONE,
  activation_ip TEXT,
  activation_device TEXT
);
CREATE INDEX IF NOT EXISTS idx_licenses_code ON licenses(license_code);
CREATE INDEX IF NOT EXISTS idx_licenses_template ON licenses(template_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);

-- Tabelle für Sections (falls noch nicht vorhanden)
CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  license_id UUID REFERENCES licenses(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_sections_user ON sections(user_id);
CREATE INDEX IF NOT EXISTS idx_sections_template ON sections(template_id);

-- RLS-Policies für sicheren Zugriff

-- Templates können von jedem gelesen werden
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates sind für alle lesbar" ON templates
  FOR SELECT USING (true);

-- Lizenzen können nur vom eigenen Benutzer gelesen werden
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lizenzen nur vom Besitzer lesbar" ON licenses
  FOR SELECT USING (auth.uid() = user_id);

-- Sections können nur vom eigenen Benutzer gelesen/bearbeitet werden
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sections nur vom Besitzer lesbar" ON sections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Sections nur vom Besitzer bearbeitbar" ON sections
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Sections nur vom Besitzer erstellbar" ON sections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sections nur vom Besitzer löschbar" ON sections
  FOR DELETE USING (auth.uid() = user_id);

-- Funktion zum Generieren von Lizenz-Codes
CREATE OR REPLACE FUNCTION generate_license_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- ohne I, O, 0, 1 zur Vermeidung von Verwechslungen
  result TEXT := '';
  i INTEGER;
BEGIN
  -- Format: XXX-XXXX-XXXX
  -- Erster Block
  FOR i IN 1..3 LOOP
    result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
  END LOOP;
  
  result := result || '-';
  
  -- Zweiter Block
  FOR i IN 1..4 LOOP
    result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
  END LOOP;
  
  result := result || '-';
  
  -- Dritter Block
  FOR i IN 1..4 LOOP
    result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Beispiel für die Erstellung eines Lizenz-Codes
-- INSERT INTO licenses (license_code, template_id)
-- VALUES (generate_license_code(), 'template-uuid-hier');