import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductForm } from '../ProductForm';
import { Product } from '@/types/supabase';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // Fetch product with images and current category associations
  const { data: productData, error: productError } = await supabase
    .schema('public')
    .from('products')
    .select('*, product_images(*), product_categories(category_id)')
    .eq('id', id)
    .single();

  if (productError || !productData) {
    notFound();
  }

  // Fetch all active categories for the dropdown
  const { data: categories } = await supabase
    .schema('public')
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  const product = productData as Product;

  return (
    <div className="text-text-primary flex flex-col gap-10">
      <ProductForm initialData={product} categories={categories || []} />
    </div>
  );
}
