-- ==============================================================================
-- SAHIH MODE - Données Initiales de Démonstration (Seed Data)
-- ==============================================================================

-- 1. Nettoyage initial (optionnel en dev)
-- TRUNCATE TABLE products, categories, settings CASCADE;

-- =====================
-- CATEGORIES
-- =====================
INSERT INTO categories (id, name, slug, description) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Hauts & T-shirts', 'hauts-t-shirts', 'T-shirts boxy, chemises épurées et polos en coton lourd.'),
  ('c2222222-2222-2222-2222-222222222222', 'Pantalons & Bas', 'pantalons-bas', 'Pantalons amples à pinces, jeans bruts et cargos minimalistes.'),
  ('c3333333-3333-3333-3333-333333333333', 'Vestes & Manteaux', 'vestes-manteaux', 'Blazers structurés, vestes bombers et pardessus intemporels.'),
  ('c4444444-4444-4444-4444-444444444444', 'Robes & Ensembles', 'robes-ensembles', 'Silhouettes fluides, robes épurées et ensembles monochromes.'),
  ('c5555555-5555-5555-5555-555555555555', 'Accessoires', 'accessoires', 'Sacs en cuir, casquettes sobres et détails de caractère.')
ON CONFLICT (slug) DO NOTHING;

-- =====================
-- PRODUITS (10 Vêtements de Luxe)
-- =====================
INSERT INTO products (name, slug, description, price, original_price, category_id, sizes, colors, stock, images, status, featured) VALUES
  (
    'T-shirt Boxy Essentiel Noir',
    't-shirt-boxy-essentiel-noir',
    'Coupe boxy contemporaine en jersey lourd 280g/m² 100% coton peigné bio. Col rond renforcé, épaules tombantes et finitions à point invisible.',
    290,
    350,
    'c1111111-1111-1111-1111-111111111111',
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Noir', 'Blanc', 'Gris Anthracite'],
    25,
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85'],
    'visible',
    true
  ),
  (
    'Chemise Blanche Popeline Structurée',
    'chemise-blanche-popeline-structuree',
    'Chemise épurée en popeline de coton égyptien au tissage serré. Col classique affûté, gorge boutonnée cachée et poignets ajustables.',
    450,
    NULL,
    'c1111111-1111-1111-1111-111111111111',
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['Blanc', 'Écru', 'Noir'],
    18,
    ARRAY['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000&q=85', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=85'],
    'visible',
    true
  ),
  (
    'Pantalon Tailleur Ample à Double Pince',
    'pantalon-tailleur-ample-double-pince',
    'Pantalon habillé à taille mi-haute avec double pli d''aisance sur le devant. Tomber fluide et élégant, confectionné dans un mélange laine froide et viscose.',
    520,
    590,
    'c2222222-2222-2222-2222-222222222222',
    ARRAY['38', '40', '42', '44'],
    ARRAY['Noir', 'Gris Souris', 'Beige'],
    14,
    ARRAY['https://images.unsplash.com/photo-1594938298603-4c2f28a3e6d8?w=1000&q=85', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=85'],
    'visible',
    true
  ),
  (
    'Jean Brut Coupe Droite Minimaliste',
    'jean-brut-coupe-droite-minimaliste',
    'Denim japonais selvedge rigide 13.5 oz, non délavé. Surpiqûres ton sur ton noir et rivets discrets en métal mat.',
    480,
    NULL,
    'c2222222-2222-2222-2222-222222222222',
    ARRAY['30', '32', '34', '36'],
    ARRAY['Noir Profond', 'Indigo Brut'],
    20,
    ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=85'],
    'visible',
    false
  ),
  (
    'Blazer Droit Noir Oversize',
    'blazer-droit-noir-oversize',
    'Veste de costume moderne aux épaules affirmées et proportions généreuses. Boutonnage simple en corne véritable et doublure intégrale en satin noir.',
    790,
    950,
    'c3333333-3333-3333-3333-333333333333',
    ARRAY['S', 'M', 'L'],
    ARRAY['Noir Intense'],
    10,
    ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1000&q=85', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&q=85'],
    'visible',
    true
  ),
  (
    'Hoodie Lourd Minimaliste Sans Cordon',
    'hoodie-lourd-minimaliste-sans-cordon',
    'Molleton French Terry ultra-lourd 450g/m². Capuche doublée sans cordons pour une esthétique architecturale épurée. Coupe ample et confortable.',
    420,
    NULL,
    'c1111111-1111-1111-1111-111111111111',
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Noir', 'Blanc Cassé', 'Gris'],
    30,
    ARRAY['https://images.unsplash.com/photo-1556821840-3a63f8550d1b?w=1000&q=85', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&q=85'],
    'visible',
    false
  ),
  (
    'Robe Midi Minimaliste Noire',
    'robe-midi-minimaliste-noire',
    'Robe sculpturale en crêpe fluide à encolure droite. Fente latérale discrète et silhouette longiligne qui traverse les saisons avec distinction.',
    650,
    750,
    'c4444444-4444-4444-4444-444444444444',
    ARRAY['XS', 'S', 'M', 'L'],
    ARRAY['Noir', 'Crème'],
    12,
    ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=85', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&q=85'],
    'visible',
    true
  ),
  (
    'Blouson Court Zippé Laine Froide',
    'blouson-court-zippe-laine-froide',
    'Veste mi-saison coupe boxy avec zip double curseur en métal argent vieilli. Col chemise rigide et poignets élastiqués.',
    690,
    NULL,
    'c3333333-3333-3333-3333-333333333333',
    ARRAY['M', 'L', 'XL'],
    ARRAY['Noir', 'Gris Chiné'],
    8,
    ARRAY['https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1000&q=85'],
    'visible',
    false
  ),
  (
    'Tote Bag en Toile Épaisse Noire',
    'tote-bag-toile-epaisse-noire',
    'Cabas géant en toile de coton canvas 16 oz avec anses renforcées pour le porté épaule. Poche intérieure zippée et logo brodé ton sur ton.',
    220,
    NULL,
    'c5555555-5555-5555-5555-555555555555',
    ARRAY['Unique'],
    ARRAY['Noir', 'Écru'],
    40,
    ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&q=85'],
    'visible',
    false
  ),
  (
    'Trench-Coat Long Monolithique',
    'trench-coat-long-monolithique',
    'Pardessus ceinturé d''inspiration militaire épuré de tout superflu. Gabardine imperméable haute densité et boutons façon corne.',
    890,
    1100,
    'c3333333-3333-3333-3333-333333333333',
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Noir', 'Beige Sable'],
    6,
    ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae846?w=1000&q=85'],
    'visible',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================
-- SETTINGS
-- =====================
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '212600000000'),
  ('store_name', 'SAHIH MODE'),
  ('hero_title', 'L’ÉLÉGANCE REDÉFINIE'),
  ('hero_subtitle', 'Découvrez notre collection monochrome de vêtements contemporains.'),
  ('about_text', 'SAHIH MODE est une marque marocaine fondée sur les principes d’élégance, de pureté des lignes et d’excellence des matières.')
ON CONFLICT (key) DO NOTHING;
