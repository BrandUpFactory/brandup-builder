-- Fix RLS Policies für Admin-Zugriff

-- 1. Admin-Funktion erstellen
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Prüfe ob User Email in Admin-Liste ist
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND email = 'meyer@brandupfactory.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Licenses Policies korrigieren
DROP POLICY IF EXISTS "Lizenzen nur vom Besitzer lesbar" ON licenses;

-- Benutzer können eigene Lizenzen lesen ODER Admins können alle lesen
CREATE POLICY "Lizenzen lesbar" ON licenses
  FOR SELECT USING (
    auth.uid() = user_id OR is_admin_user()
  );

-- Admin kann Lizenzen erstellen
CREATE POLICY "Lizenzen admin insert" ON licenses
  FOR INSERT WITH CHECK (is_admin_user());

-- Admin kann Lizenzen aktualisieren
CREATE POLICY "Lizenzen admin update" ON licenses
  FOR UPDATE USING (is_admin_user());

-- Admin kann Lizenzen löschen
CREATE POLICY "Lizenzen admin delete" ON licenses
  FOR DELETE USING (is_admin_user());

-- 3. Templates Policies erweitern
-- Admin kann Templates erstellen
CREATE POLICY "Templates admin insert" ON templates
  FOR INSERT WITH CHECK (is_admin_user());

-- Admin kann Templates aktualisieren
CREATE POLICY "Templates admin update" ON templates
  FOR UPDATE USING (is_admin_user());

-- Admin kann Templates löschen
CREATE POLICY "Templates admin delete" ON templates
  FOR DELETE USING (is_admin_user());

-- 4. Product Template Mapping Policy korrigieren (falls vorhanden)
DROP POLICY IF EXISTS "Product mapping modifiable by admins" ON product_template_mapping;

-- Erstelle korrekte Admin Policy für Product Template Mapping
CREATE POLICY "Product mapping admin access" ON product_template_mapping
  FOR ALL USING (is_admin_user());