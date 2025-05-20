-- Create a table to map Shopify products to templates
CREATE TABLE IF NOT EXISTS product_template_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shopify_product_id, shopify_variant_id)
);
CREATE INDEX IF NOT EXISTS idx_product_mapping_product ON product_template_mapping(shopify_product_id);
CREATE INDEX IF NOT EXISTS idx_product_mapping_variant ON product_template_mapping(shopify_variant_id);
CREATE INDEX IF NOT EXISTS idx_product_mapping_template ON product_template_mapping(template_id);

-- Sample data (commented out)
/*
INSERT INTO product_template_mapping (shopify_product_id, template_id) 
VALUES 
  ('12345678901234', '550e8400-e29b-41d4-a716-446655440000');
*/

-- Add RLS policies
ALTER TABLE product_template_mapping ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the product mapping data
CREATE POLICY "Product mapping visible to all" ON product_template_mapping
  FOR SELECT USING (true);

-- Only allow admins to modify the product mapping
-- Note: In a real implementation, you would need to define an is_admin() function or similar
CREATE POLICY "Product mapping modifiable by admins" ON product_template_mapping
  FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));
  
-- Alternative if you don't have an is_admin field:
-- CREATE POLICY "Product mapping modifiable by specific users" ON product_template_mapping
--   FOR ALL USING (auth.uid() IN ('specific-admin-user-id-here'));