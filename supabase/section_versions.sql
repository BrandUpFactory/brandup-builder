-- Schema für die Versionsverwaltung der Sections

-- Tabelle für Section Versions
CREATE TABLE IF NOT EXISTS section_versions (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_section_versions_section_id ON section_versions(section_id);

-- RLS-Policies für sicheren Zugriff auf Versionen
ALTER TABLE section_versions ENABLE ROW LEVEL SECURITY;

-- Section Versions können nur vom Besitzer der zugehörigen Section gelesen werden
CREATE POLICY "Section Versions nur vom Besitzer lesbar" ON section_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sections 
      WHERE sections.id = section_versions.section_id 
      AND sections.user_id = auth.uid()
    )
  );

-- Section Versions können nur vom Besitzer der zugehörigen Section erstellt werden
CREATE POLICY "Section Versions nur vom Besitzer erstellbar" ON section_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sections 
      WHERE sections.id = section_versions.section_id 
      AND sections.user_id = auth.uid()
    )
  );

-- Section Versions können nur vom Besitzer der zugehörigen Section gelöscht werden
CREATE POLICY "Section Versions nur vom Besitzer löschbar" ON section_versions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sections 
      WHERE sections.id = section_versions.section_id 
      AND sections.user_id = auth.uid()
    )
  );

-- Section Versions können nur vom Besitzer der zugehörigen Section aktualisiert werden
CREATE POLICY "Section Versions nur vom Besitzer aktualisierbar" ON section_versions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sections 
      WHERE sections.id = section_versions.section_id 
      AND sections.user_id = auth.uid()
    )
  );

-- Trigger, um bei Löschung einer Section alle zugehörigen Versionen zu löschen
CREATE OR REPLACE FUNCTION delete_section_versions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM section_versions WHERE section_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_section_versions
BEFORE DELETE ON sections
FOR EACH ROW
EXECUTE FUNCTION delete_section_versions();

-- Erstelle eine Tabelle für Bilder/Uploads
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);

-- RLS für Bilder
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Bilder können nur vom Besitzer gelesen werden
CREATE POLICY "Bilder nur vom Besitzer lesbar" ON images
  FOR SELECT USING (auth.uid() = user_id);

-- Bilder können nur vom Besitzer erstellt werden
CREATE POLICY "Bilder nur vom Besitzer erstellbar" ON images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bilder können nur vom Besitzer gelöscht werden
CREATE POLICY "Bilder nur vom Besitzer löschbar" ON images
  FOR DELETE USING (auth.uid() = user_id);

-- Bilder können nur vom Besitzer aktualisiert werden
CREATE POLICY "Bilder nur vom Besitzer aktualisierbar" ON images
  FOR UPDATE USING (auth.uid() = user_id);

-- Tabelle für Templates erweitern (falls gewünscht)
ALTER TABLE templates ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS category TEXT;