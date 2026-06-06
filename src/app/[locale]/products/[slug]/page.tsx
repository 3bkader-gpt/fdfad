import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Product } from '@/types/supabase';
import { setRequestLocale } from 'next-intl/server';
import { ProductDetailsClient } from './ProductDetailsClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

/**
 * Product Details Page (Server Component)
 * Fetches product data on the server using the URL slug.
 * Handles Unicode/Arabic slug decoding and normalization for reliable DB lookup.
 */

async function getProduct(slug: string) {
  const supabase = await createClient();
  return await supabase
    .schema('public')
    .from('products')
    .select('*, product_images(*), product_categories(*)')
    .eq('slug', slug)
    .single();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  // Ensure Unicode characters (Arabic) are decoded and normalized for lookup
  const slug = decodeURIComponent(rawSlug).normalize('NFC');
  const { data: product } = await getProduct(slug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | Fadfaad`,
    description: product.description || 'Fadfaad Modest Fashion',
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug: rawSlug, locale } = await params;
  setRequestLocale(locale);

  // Decode the slug to handle Arabic characters correctly and normalize Unicode
  const slug = decodeURIComponent(rawSlug).normalize('NFC');

  // 1. Fetch product with images and categories
  const { data: productData, error } = await getProduct(slug);

  if (error || !productData) {
    // If not found, it might be an older unnormalized slug, try raw as fallback
    const { data: fallbackData } = await getProduct(rawSlug);
    if (fallbackData) {
      return <ProductPageContent product={fallbackData as Product} locale={locale} />;
    }
    notFound();
  }

  return <ProductPageContent product={productData as Product} locale={locale} />;
}

async function ProductPageContent({ product, locale }: { product: Product; locale: string }) {
  const supabase = await createClient();

  // 2. Fetch category name for breadcrumb
  const categoryId = product.product_categories?.[0]?.category_id;
  let categoryName: string | null = null;
  let categorySlug: string | null = null;

  if (categoryId) {
    const { data: catData } = await supabase
      .schema('public')
      .from('categories')
      .select('name_ar, name_en, slug')
      .eq('id', categoryId)
      .single();

    if (catData) {
      const cat = catData as { name_ar: string; name_en: string; slug: string };
      categoryName = locale === 'ar' ? cat.name_ar : cat.name_en;
      categorySlug = cat.slug;
    }
  }

  // 3. Fetch up to 4 related products from the same category
  let relatedProducts: Product[] = [];

  if (categoryId) {
    const { data: relatedData } = await supabase
      .schema('public')
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

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
      categoryName={categoryName}
      categorySlug={categorySlug}
    />
  );
}
