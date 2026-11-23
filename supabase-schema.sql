-- ==============================================================================
-- DANFIT INDUSTRY - COMPLETE SUPABASE DATABASE SETUP
-- Run this entire script once in: Supabase Dashboard > SQL Editor
-- Safe to run again (uses CREATE TABLE IF NOT EXISTS and IF NOT EXISTS).
-- ==============================================================================

-- 1. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.categories
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    moq VARCHAR(100),
    lead_time VARCHAR(100),
    sample_available BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(100),
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
    ADD COLUMN IF NOT EXISTS moq VARCHAR(100),
    ADD COLUMN IF NOT EXISTS lead_time VARCHAR(100),
    ADD COLUMN IF NOT EXISTS sample_available BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1) DEFAULT 5.0,
    ADD COLUMN IF NOT EXISTS reviews_count INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
    ADD COLUMN IF NOT EXISTS sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS features JSONB NOT NULL DEFAULT '[]'::jsonb,
    ALTER COLUMN price SET DEFAULT 0,
    ALTER COLUMN stock SET DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique
    ON public.products(slug)
    WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS products_created_idx ON public.products(created_at DESC);

-- 3. WEBSITE INQUIRIES
CREATE TABLE IF NOT EXISTS public.inquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    product_name VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    source VARCHAR(50) NOT NULL DEFAULT 'contact',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.inquiries
    ADD COLUMN IF NOT EXISTS product_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'new',
    ADD COLUMN IF NOT EXISTS source VARCHAR(50) NOT NULL DEFAULT 'contact';

ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;
ALTER TABLE public.inquiries
    ADD CONSTRAINT inquiries_status_check
    CHECK (status IN ('new', 'read', 'resolved'));

ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_source_check;
ALTER TABLE public.inquiries
    ADD CONSTRAINT inquiries_source_check
    CHECK (source IN ('contact', 'custom_manufacturing', 'cart'));

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS inquiries_created_idx ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON public.inquiries(email);

-- 4. PRODUCT IMAGE STORAGE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
CREATE POLICY "Admin update product images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'product-images');

-- 4. ROW LEVEL SECURITY
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inquiries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO anon, authenticated;

GRANT USAGE, SELECT ON SEQUENCE public.categories_id_seq TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.products_id_seq TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.inquiries_id_seq TO anon, authenticated;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories"
ON public.categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read products" ON public.products;
CREATE POLICY "Allow public read products"
ON public.products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public submit inquiries" ON public.inquiries;
CREATE POLICY "Allow public submit inquiries"
ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- The current application admin panel uses the anon key.
-- These policies allow the existing admin UI to manage catalog data.
-- For production, replace them with authenticated/admin-only policies.
DROP POLICY IF EXISTS "Allow admin all categories" ON public.categories;
CREATE POLICY "Allow admin all categories"
ON public.categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin all products" ON public.products;
CREATE POLICY "Allow admin all products"
ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read inquiries" ON public.inquiries;
CREATE POLICY "Allow admin read inquiries"
ON public.inquiries FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow admin update inquiries" ON public.inquiries;
CREATE POLICY "Allow admin update inquiries"
ON public.inquiries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete inquiries" ON public.inquiries;
CREATE POLICY "Allow admin delete inquiries"
ON public.inquiries FOR DELETE TO anon, authenticated USING (true);

-- 5. CATEGORY SEED DATA
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
(1, 'AeroTech Performance', 'aerotech-performance', 'Ultralight aerodynamic activewear engineered for high-performance training.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop'),
(2, 'Pro Compression Wear', 'pro-compression-wear', 'Graduated compression gear for performance and recovery.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop'),
(3, 'Elite Combat & Boxing', 'elite-combat-boxing', 'Competition-grade combat apparel and boxing equipment.', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000&auto=format&fit=crop'),
(4, 'Luxury Streetwear & Hoodies', 'luxury-streetwear-hoodies', 'Heavyweight streetwear hoodies and contemporary sports fashion.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop'),
(5, 'Seamless Activewear', 'seamless-activewear', 'Circular-knit seamless apparel with ergonomic body mapping.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop'),
(6, 'Custom Teamwear & Club Uniforms', 'custom-teamwear', 'Fully customised teamwear, club uniforms and sports kits.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 6. PRODUCT SEED DATA
INSERT INTO public.products (
    id, title, slug, description, price, category_id, image_url, stock,
    moq, lead_time, sample_available, is_featured, rating, reviews_count,
    sku, sizes, colors, features
) VALUES
(1, 'DanFit CyberMatrix Thermal Compression Top', 'danfit-cybermatrix-compression-top',
'Engineered with proprietary 4-way AeroFlex poly-elastane composite.', 89, 2,
'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
42, '20 Pcs (Low MOQ)', '7-10 Business Days', true, true, 4.9, 88, 'DF-CMP-001',
'["S","M","L","XL","XXL"]'::jsonb,
'[{"name":"Obsidian Black","hex":"#0c0c0e"},{"name":"Titanium Grey","hex":"#4b5563"}]'::jsonb,
'["Moisture-wicking","UPF 50+","Custom logo placement"]'::jsonb),
(2, 'Apex Stealth Carbon Tracksuit Jacket', 'apex-stealth-carbon-jacket',
'Tailored with water-repellent matte softshell and moisture-evacuation zips.', 145, 1,
'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
28, '25 Pcs / Style', '10-14 Business Days', true, true, 5.0, 64, 'DF-APX-002',
'["S","M","L","XL"]'::jsonb,
'[{"name":"Obsidian Black","hex":"#0c0c0e"},{"name":"Racing Red","hex":"#ff0000"}]'::jsonb,
'["Water-repellent","Custom hardware","OEM branding"]'::jsonb),
(3, 'HyperDry 480GSM Heavyweight Luxury Hoodie', 'hyperdry-heavyweight-hoodie',
'Heavyweight combed-cotton luxury hoodie designed for structure and comfort.', 110, 4,
'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop',
35, '20 Pcs / Style', '7-12 Business Days', true, true, 4.8, 112, 'DF-HDY-003',
'["S","M","L","XL","XXL"]'::jsonb,
'[{"name":"Obsidian Black","hex":"#0c0c0e"},{"name":"Crimson","hex":"#990000"}]'::jsonb,
'["480 GSM","Double-layered hood","Custom embroidery"]'::jsonb),
(4, 'Pro Gladius Combat Rashguard', 'pro-gladius-combat-rashguard',
'Sublimated MMA and BJJ rashguard manufactured in Sialkot.', 65, 3,
'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=1000&auto=format&fit=crop',
50, '20 Pcs / Style', '10-14 Business Days', true, false, 4.9, 53, 'DF-CMB-004',
'["S","M","L","XL"]'::jsonb,
'[{"name":"Obsidian Black","hex":"#0c0c0e"},{"name":"Racing Red","hex":"#ff0000"}]'::jsonb,
'["Sublimation","Four-way stretch","Flatlock seams"]'::jsonb),
(5, 'Aura Sculpt Seamless Ribbed Set', 'aura-sculpt-seamless-set',
'3D circular-knit seamless activewear with contouring compression.', 95, 5,
'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1000&auto=format&fit=crop',
24, '25 Pcs / Style', '12-15 Business Days', true, true, 5.0, 94, 'DF-SML-005',
'["XS","S","M","L"]'::jsonb,
'[{"name":"Obsidian Black","hex":"#0c0c0e"},{"name":"Stone","hex":"#a8a29e"}]'::jsonb,
'["Seamless knit","Buttery soft","Compression fit"]'::jsonb),
(6, 'Federation Pro Bespoke Football Kit', 'federation-pro-bespoke-kit',
'Fully customised football kit with sublimated club identity.', 48, 6,
'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop',
120, '15 Pcs / Kit', '12-18 Business Days', true, false, 4.9, 41, 'DF-TM-006',
'["Y-L","S","M","L","XL","XXL"]'::jsonb,
'[{"name":"Pure White","hex":"#ffffff"},{"name":"Racing Red","hex":"#ff0000"}]'::jsonb,
'["Full sublimation","Custom crest","Moisture evasion"]'::jsonb),
(7, 'Kevlar-Reinforced Sparring Boxing Gloves 16oz', 'sparring-boxing-gloves-16oz',
'Handcrafted cowhide boxing gloves with multi-layered EVA foam.', 120, 3,
'https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=1000&auto=format&fit=crop',
18, '12 Pcs', '10-14 Business Days', true, true, 5.0, 76, 'DF-GLV-007',
'["12oz","14oz","16oz"]'::jsonb,
'[{"name":"Racing Red","hex":"#ff0000"},{"name":"Obsidian Black","hex":"#0c0c0e"}]'::jsonb,
'["Cowhide leather","EVA foam","Wrist support"]'::jsonb),
(8, 'Vanguard Ripstop Cargo Jogger', 'vanguard-ripstop-cargo-jogger',
'Tactical ripstop jogger with cargo pockets and adjustable cuffs.', 98, 4,
'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
31, '20 Pcs / Style', '10-14 Business Days', true, false, 4.7, 39, 'DF-JOG-008',
'["S","M","L","XL"]'::jsonb,
'[{"name":"Carbon","hex":"#18181d"},{"name":"Racing Red","hex":"#ff0000"}]'::jsonb,
'["Ripstop fabric","Cargo pockets","Adjustable cuffs"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    stock = EXCLUDED.stock,
    moq = EXCLUDED.moq,
    lead_time = EXCLUDED.lead_time,
    sample_available = EXCLUDED.sample_available,
    is_featured = EXCLUDED.is_featured,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count,
    sku = EXCLUDED.sku,
    sizes = EXCLUDED.sizes,
    colors = EXCLUDED.colors,
    features = EXCLUDED.features;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories), true);
SELECT setval(pg_get_serial_sequence('public.products', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.products), true);
SELECT setval(pg_get_serial_sequence('public.inquiries', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.inquiries), true);

-- OPTIONAL: Confirm the website admin account created through Sign Up.
-- Run once after creating the account in Authentication.
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, timezone('utc', now())),
    confirmed_at = COALESCE(confirmed_at, timezone('utc', now())),
    updated_at = timezone('utc', now())
WHERE email = 'saifqi090@gmail.com';
