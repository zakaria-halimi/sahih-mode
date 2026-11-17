-- ==============================================================================
-- SAHIH MODE - Schéma de Base de Données Supabase (PostgreSQL)
-- ==============================================================================

-- 1. Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- TABLE: CATEGORIES
-- =====================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABLE: PRODUCTS
-- =====================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABLE: SETTINGS
-- =====================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TRIGGERS: UPDATED_AT
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS settings_updated_at ON settings;
CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ---------------------
-- POLICIES: CATEGORIES
-- ---------------------
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- ---------------------
-- POLICIES: PRODUCTS
-- ---------------------
DROP POLICY IF EXISTS "Public can view visible products" ON products;
CREATE POLICY "Public can view visible products"
  ON products FOR SELECT
  USING (status = 'visible' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- ---------------------
-- POLICIES: SETTINGS
-- ---------------------
DROP POLICY IF EXISTS "Public can view settings" ON settings;
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert settings" ON settings;
CREATE POLICY "Admins can insert settings"
  ON settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update settings" ON settings;
CREATE POLICY "Admins can update settings"
  ON settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ==============================================================================
-- INDEXES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ==============================================================================
-- STORAGE (À exécuter dans l'interface Supabase Storage)
-- ==============================================================================
-- 1. Créer un bucket nommé 'product-images'
-- 2. Activer l'accès public ('Public bucket')
