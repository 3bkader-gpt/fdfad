-- FADFAAD Database Triggers Export
-- Generated on: Sat, 06 Jun 2026

-- 1. update_products_updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON public.products 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. update_orders_updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON public.orders 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. update_categories_updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at 
BEFORE UPDATE ON public.categories 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
