-- FADFAAD Database RLS Policies Export
-- Generated on: Sat, 06 Jun 2026

-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. PRODUCTS
DROP POLICY IF EXISTS products_public_select_active ON public.products;
CREATE POLICY products_public_select_active ON public.products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS products_admin_all ON public.products;
CREATE POLICY products_admin_all ON public.products FOR ALL USING (public.is_admin());

-- 2. PRODUCT IMAGES
DROP POLICY IF EXISTS product_images_public_select ON public.product_images;
CREATE POLICY product_images_public_select ON public.product_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_images.product_id AND p.is_active = true)
);

DROP POLICY IF EXISTS product_images_admin_all ON public.product_images;
CREATE POLICY product_images_admin_all ON public.product_images FOR ALL USING (public.is_admin());

-- 3. CATEGORIES
DROP POLICY IF EXISTS categories_public_select ON public.categories;
CREATE POLICY categories_public_select ON public.categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS categories_admin_all ON public.categories;
CREATE POLICY categories_admin_all ON public.categories FOR ALL USING (public.is_admin());

-- 4. PRODUCT_CATEGORIES
DROP POLICY IF EXISTS product_categories_public_select ON public.product_categories;
CREATE POLICY product_categories_public_select ON public.product_categories FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.products p 
        JOIN public.categories c ON c.id = product_categories.category_id 
        WHERE p.id = product_categories.product_id AND p.is_active = true AND c.is_active = true
    )
);

DROP POLICY IF EXISTS product_categories_admin_all ON public.product_categories;
CREATE POLICY product_categories_admin_all ON public.product_categories FOR ALL USING (public.is_admin());

-- 5. ORDERS
DROP POLICY IF EXISTS orders_public_insert ON public.orders;
CREATE POLICY orders_public_insert ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS orders_admin_all ON public.orders;
CREATE POLICY orders_admin_all ON public.orders FOR ALL USING (public.is_admin());

-- 6. ORDER ITEMS
DROP POLICY IF EXISTS order_items_public_insert ON public.order_items;
CREATE POLICY order_items_public_insert ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS order_items_admin_all ON public.order_items;
CREATE POLICY order_items_admin_all ON public.order_items FOR ALL USING (public.is_admin());

-- 7. STORAGE POLICIES
-- Assuming 'product-images' bucket
CREATE POLICY product_images_public_read ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY product_images_admin_all ON storage.objects FOR ALL USING (bucket_id = 'product-images' AND public.is_admin());
