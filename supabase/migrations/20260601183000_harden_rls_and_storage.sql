-- Security hardening migration
-- Goal:
-- 1) Public users can only read active catalog data
-- 2) Only admin users can mutate catalog/category/image data
-- 3) Orders can remain publicly creatable for checkout

-- Helper: admin check by authenticated user's email against public.admins
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.email = (auth.jwt() ->> 'email')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Ensure RLS is enabled on scoped tables
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for target tables to avoid legacy permissive rules
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('products','product_images','product_categories','categories','orders','order_items')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

-- PRODUCTS
CREATE POLICY products_public_select_active
  ON public.products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY products_admin_select_all
  ON public.products
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY products_admin_insert
  ON public.products
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY products_admin_update
  ON public.products
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY products_admin_delete
  ON public.products
  FOR DELETE
  USING (public.is_admin());

-- PRODUCT IMAGES
CREATE POLICY product_images_public_select_active_products
  ON public.product_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      WHERE p.id = product_images.product_id
        AND p.is_active = true
    )
  );

CREATE POLICY product_images_admin_select_all
  ON public.product_images
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY product_images_admin_insert
  ON public.product_images
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY product_images_admin_update
  ON public.product_images
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY product_images_admin_delete
  ON public.product_images
  FOR DELETE
  USING (public.is_admin());

-- PRODUCT CATEGORIES
CREATE POLICY product_categories_public_select_active_mappings
  ON public.product_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.categories c ON c.id = product_categories.category_id
      WHERE p.id = product_categories.product_id
        AND p.is_active = true
        AND c.is_active = true
    )
  );

CREATE POLICY product_categories_admin_select_all
  ON public.product_categories
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY product_categories_admin_insert
  ON public.product_categories
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY product_categories_admin_update
  ON public.product_categories
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY product_categories_admin_delete
  ON public.product_categories
  FOR DELETE
  USING (public.is_admin());

-- CATEGORIES
CREATE POLICY categories_public_select_active
  ON public.categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY categories_admin_select_all
  ON public.categories
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY categories_admin_insert
  ON public.categories
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY categories_admin_update
  ON public.categories
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY categories_admin_delete
  ON public.categories
  FOR DELETE
  USING (public.is_admin());

-- ORDERS (public create kept intentionally)
CREATE POLICY orders_public_insert
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY orders_admin_select_all
  ON public.orders
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY orders_admin_update
  ON public.orders
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY orders_admin_delete
  ON public.orders
  FOR DELETE
  USING (public.is_admin());

-- ORDER ITEMS (public create kept intentionally)
CREATE POLICY order_items_public_insert
  ON public.order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY order_items_admin_select_all
  ON public.order_items
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY order_items_admin_update
  ON public.order_items
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY order_items_admin_delete
  ON public.order_items
  FOR DELETE
  USING (public.is_admin());

-- STORAGE.OBJECTS policies for product image management
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname IN (
        'product_images_public_read',
        'product_images_admin_insert',
        'product_images_admin_update',
        'product_images_admin_delete'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

CREATE POLICY product_images_public_read
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY product_images_admin_insert
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY product_images_admin_update
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY product_images_admin_delete
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
