-- SEED DATA FOR FADFAAD
INSERT INTO public.products (title, slug, description, price, opacity_scale, fabric_type, made_in_egypt, is_active)
VALUES (
    'Classic Linen Abaya',
    'classic-linen-abaya',
    'A timeless, breathable linen abaya perfect for the Egyptian summer. Elegant drape and high opacity.',
    1250.00,
    5,
    'Linen',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt_text, display_order)
SELECT id, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000', 'Classic Linen Abaya', 0
FROM public.products WHERE slug = 'classic-linen-abaya'
ON CONFLICT DO NOTHING;
