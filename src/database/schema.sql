-- ============================================================
-- Casa DXN Chile - Esquema de Base de Datos (Supabase)
-- ============================================================

-- 1. TABLA: products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INT NOT NULL,
  pv NUMERIC NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 10,
  out_of_stock_threshold INT NOT NULL DEFAULT 0,
  image_url TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL,
  rut TEXT NOT NULL UNIQUE,
  codigo_distribuidor TEXT DEFAULT NULL,
  direccion TEXT NOT NULL,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLA: orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total_clp INT NOT NULL,
  total_pv NUMERIC NOT NULL,
  status TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SEED: Productos DXN Chile
-- ============================================================
INSERT INTO products (name, price, pv, stock, low_stock_threshold, out_of_stock_threshold, image_url) VALUES
  ('DXN Spirudle',              6672,  2.1, 50, 10, 0, NULL),
  ('DXN Apple Juice Drink',     39145, 14,  30, 10, 0, NULL),
  ('DXN Spirulina Coffee',      19251, 8.3, 40, 10, 0, NULL),
  ('DXN Apple Jam',             13837, 4.6, 25, 10, 0, NULL),
  ('DXN Spirulina Tablet 500''s', 77567, 18.7, 20, 10, 0, NULL),
  ('DXN Spirulina Tablet 120''s', 21448, 5.2, 60, 10, 0, NULL);

-- ============================================================
-- STORAGE: Bucket para imágenes de productos
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir acceso público de lectura a las imágenes
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Permitir acceso de inserción/actualización autenticado (anon key puede insertar)
CREATE POLICY "Authenticated insert access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
