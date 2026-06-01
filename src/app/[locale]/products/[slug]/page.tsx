import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Product } from '@/types/supabase';
import { setRequestLocale } from 'next-intl/server';
import { ProductDetailsClient } from './ProductDetailsClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  // 1. Fetch product with images and categories
  const { data: productData, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_categories(*)')
    .eq('slug', slug)
    .single();

  if (error || !productData) {
    notFound();
  }

  const product = productData as Product;

  // 2. Fetch up to 4 related products from the same category
  const categoryId = product.product_categories?.[0]?.category_id;
  let relatedProducts: Product[] = [];

  if (categoryId) {
    const { data: relatedData } = await supabase
      .from('products')
      .select('*, product_images(*), product_categories!inner(*)')
      .eq('product_categories.category_id', categoryId)
      .eq('is_active', true)
      .neq('id', product.id)
      .limit(4);

    if (relatedData) {
      relatedProducts = relatedData as Product[];
    }
  }

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
