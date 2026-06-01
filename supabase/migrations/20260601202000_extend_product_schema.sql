-- Extend products table with new size, color, specifications, and model/fit columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}'::text[] NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT '{}'::text[] NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS garment_length_cm INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS season TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care_instructions TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_height_cm INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_weight_kg INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_size_worn TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_recommendations JSONB DEFAULT '[]'::jsonb NOT NULL;

-- Extend product_images table to support cover image marking
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS is_cover BOOLEAN DEFAULT false NOT NULL;

-- Extend order_items table to record client variant selection
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS selected_size TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS selected_color TEXT;
