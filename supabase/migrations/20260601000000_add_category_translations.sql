-- Add translation columns to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS name_ar TEXT,
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Migrate existing data
UPDATE public.categories
SET name_ar = name,
    name_en = name
WHERE name_ar IS NULL;

-- Set NOT NULL constraint on name_ar and name_en
ALTER TABLE public.categories
ALTER COLUMN name_ar SET NOT NULL,
ALTER COLUMN name_en SET NOT NULL;
