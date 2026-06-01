-- Update existing category translations to use proper translations instead of transliterated names
UPDATE public.categories
SET name_ar = 'عبايات', name_en = 'Abayas', name = 'عبايات'
WHERE slug = 'abayas';

UPDATE public.categories
SET name_ar = 'خمارات', name_en = 'Khimars', name = 'خمارات'
WHERE slug = 'khimars';

UPDATE public.categories
SET name_ar = 'إسدالات', name_en = 'Jilbabs', name = 'إسدالات'
WHERE slug = 'jilbabs';

UPDATE public.categories
SET name_ar = 'إسدالات صلاة', name_en = 'Prayer Wear', name = 'إسدالات صلاة'
WHERE slug = 'prayer-wear';
