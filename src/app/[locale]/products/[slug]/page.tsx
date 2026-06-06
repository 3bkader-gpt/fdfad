import { createClient } from '@/lib/supabase/server';
import { notFound, permanentRedirect } from 'next/navigation';
import { Product } from '@/types/supabase';
import { setRequestLocale } from 'next-intl/server';
import { ProductDetailsClient } from './ProductDetailsClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

/**
 * Product Details Page (Server Component)
 * Migrated to ID-based resolution for stability.
 * Supports /products/[id]-[optional-slug]
 */

async function getProductById(id: number) {
  const supabase = await createClient();
  return await supabase
    .schema('public')
    .from('products')
    .select('*, product_images(*), product_categories(*)')
    .eq('product_no', id)
    .single();
}

async function getProductBySlug(slug: string) {
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
  const { slug: identifier } = await params;

  // Extract numeric ID from "123-slug" or just "123"
  const match = identifier.match(/^(\d+)/);
  const id = match ? parseInt(match[1]) : null;

  if (!id) {
    // If no numeric ID, it might be a legacy slug
    const decodedSlug = decodeURIComponent(identifier).normalize('NFC');
    const { data: product } = await getProductBySlug(decodedSlug);
    if (!product) return { title: 'Product Not Found' };
    return { title: `${product.title} | Fadfaad` };
  }

  const { data: product } = await getProductById(id);
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
  const { slug: identifier, locale } = await params;
  setRequestLocale(locale);

  console.log(`[ProductPage] START - identifier: "${identifier}"`);

  // 1. Try to extract numeric ID
  const match = identifier.match(/^(\d+)/);
  const productNo = match ? parseInt(match[1]) : null;

  if (productNo) {
    // ID-based lookup
    const { data: product, error } = await getProductById(productNo);

    if (error || !product) {
      console.error(`[ProductPage] ID FETCH FAIL for ${productNo}:`, error?.message);
      notFound();
    }

    // Canonical URL Check: /products/123-correct-slug
    const expectedSlug = `${product.product_no}-${product.slug}`.normalize('NFC');
    const currentSlug = decodeURIComponent(identifier).normalize('NFC');

    console.log(`[ProductPage] ID lookup success. Expected: "${expectedSlug}", Current: "${currentSlug}"`);

    if (currentSlug !== expectedSlug) {
      console.log(`[ProductPage] REDIRECT to canonical: ${expectedSlug}`);
      permanentRedirect(`/products/${expectedSlug}`);
    }

    return <ProductPageContent product={product as Product} locale={locale} />;
  } else {
    // 2. Legacy Slug-only lookup
    const slug = decodeURIComponent(identifier).normalize('NFC');
    console.log(`[ProductPage] LEGACY LOOKUP for slug: "${slug}"`);

    const { data: product, error } = await getProductBySlug(slug);

    if (!error && product) {
      const target = `${product.product_no}-${product.slug}`;
      console.log(`[ProductPage] LEGACY REDIRECT (301) to: ${target}`);
      // Permanent redirect to the new ID-based structure
      permanentRedirect(`/products/${target}`);
    }

    console.error(`[ProductPage] TOTAL FAIL for identifier: "${identifier}"`);
    notFound();
  }
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
