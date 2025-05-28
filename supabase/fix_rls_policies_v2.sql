-- Fix RLS Policies für Admin-Zugriff - Version 2

-- 1. Admin-Funktionen erstellen
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

CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Alle existierenden Policies löschen und neu erstellen

-- Licenses Policies
DROP POLICY IF EXISTS "Lizenzen lesbar" ON licenses;
DROP POLICY IF EXISTS "Lizenzen admin insert" ON licenses;
DROP POLICY IF EXISTS "Lizenzen admin update" ON licenses;
DROP POLICY IF EXISTS "Lizenzen admin delete" ON licenses;

CREATE POLICY "Lizenzen lesbar" ON licenses
  FOR SELECT USING (
    auth.uid() = user_id OR is_admin_user()
  );

CREATE POLICY "Lizenzen admin insert" ON licenses
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Lizenzen admin update" ON licenses
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "Lizenzen admin delete" ON licenses
  FOR DELETE USING (is_admin_user());

-- Templates Policies (Templates sollten für alle lesbar bleiben)
DROP POLICY IF EXISTS "Templates admin insert" ON templates;
DROP POLICY IF EXISTS "Templates admin update" ON templates;
DROP POLICY IF EXISTS "Templates admin delete" ON templates;

CREATE POLICY "Templates admin insert" ON templates
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Templates admin update" ON templates
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "Templates admin delete" ON templates
  FOR DELETE USING (is_admin_user());

-- Sections Policies
DROP POLICY IF EXISTS "Sections lesbar" ON sections;
DROP POLICY IF EXISTS "Sections bearbeitbar" ON sections;
DROP POLICY IF EXISTS "Sections erstellbar" ON sections;
DROP POLICY IF EXISTS "Sections löschbar" ON sections;

CREATE POLICY "Sections lesbar" ON sections
  FOR SELECT USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "Sections bearbeitbar" ON sections
  FOR UPDATE USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "Sections erstellbar" ON sections
  FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "Sections löschbar" ON sections
  FOR DELETE USING (auth.uid() = user_id OR is_admin_user());

-- Product Template Mapping Policies
DROP POLICY IF EXISTS "Product mapping admin access" ON product_template_mapping;

CREATE POLICY "Product mapping admin access" ON product_template_mapping
  FOR ALL USING (is_admin_user());