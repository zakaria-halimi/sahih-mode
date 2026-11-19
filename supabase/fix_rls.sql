-- ==============================================================================
-- FIX RLS POLICIES FOR SAHIH MODE (ADMIN OPERATIONS)
-- Exécutez ce script dans Supabase SQL Editor pour autoriser l'écriture
-- depuis l'espace Admin (Ajouter produit, modifier paramètres, supprimer)
-- ==============================================================================

-- 1. SETTINGS TABLE
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view settings" ON settings;
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Enable insert for settings" ON settings;
CREATE POLICY "Enable insert for settings"
  ON settings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update settings" ON settings;
DROP POLICY IF EXISTS "Enable update for settings" ON settings;
CREATE POLICY "Enable update for settings"
  ON settings FOR UPDATE
  USING (true);

-- 2. PRODUCTS TABLE
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible products" ON products;
CREATE POLICY "Public can view visible products"
  ON products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Enable insert for products" ON products;
CREATE POLICY "Enable insert for products"
  ON products FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Enable update for products" ON products;
CREATE POLICY "Enable update for products"
  ON products FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Enable delete for products" ON products;
CREATE POLICY "Enable delete for products"
  ON products FOR DELETE
  USING (true);

-- 3. CATEGORIES TABLE
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Enable insert for categories" ON categories;
CREATE POLICY "Enable insert for categories"
  ON categories FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Enable update for categories" ON categories;
CREATE POLICY "Enable update for categories"
  ON categories FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
DROP POLICY IF EXISTS "Enable delete for categories" ON categories;
CREATE POLICY "Enable delete for categories"
  ON categories FOR DELETE
  USING (true);
