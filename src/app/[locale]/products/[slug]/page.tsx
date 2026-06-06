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

  // 1. Try numeric ID
  const match = identifier.match(/^(\d+)/);
  if (match) {
    const id = parseInt(match[1]);
    const { data: product } = await getProductById(id);
    if (product) return { title: `${product.title} | Fadfaad` };
  }

  // 2. Try legacy slug
  try {
    const decoded = decodeURIComponent(identifier).normalize('NFC');
    const { data: product } = await getProductBySlug(decoded);
    if (product) return { title: `${product.title} | Fadfaad` };
  } catch {
    // Ignore decode errors
  }

  return { title: 'Product Not Found' };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug: identifier, locale } = await params;
  setRequestLocale(locale);

  // 1. Check if identifier starts with a numeric ID (The new standard)
  const match = identifier.match(/^(\d+)/);

  if (match) {
    const productNo = parseInt(match[1]);
    const { data: product, error } = await getProductById(productNo);

    if (error || !product) {
      console.error(`[ProductPage] ID lookup failed for ${productNo}`);
      notFound();
    }

    // Canonical check (ensure slug matches current title slug)
    const canonicalIdentifier = `${product.product_no}-${product.slug}`;
    const currentIdentifier = decodeURIComponent(identifier).normalize('NFC');

    if (currentIdentifier !== canonicalIdentifier) {
      permanentRedirect(`/products/${canonicalIdentifier}`);
    }

    return <ProductPageContent product={product as Product} locale={locale} />;
  }

  // 2. Legacy fallback: lookup by slug only
  // Try decoded and normalized variants
  const slugsToTry: string[] = [identifier];
  try {
    slugsToTry.push(decodeURIComponent(identifier));
    slugsToTry.push(decodeURIComponent(identifier).normalize('NFC'));
  } catch {
    // Ignore decode errors
  }

  for (const s of Array.from(new Set(slugsToTry))) {
    const { data: product } = await getProductBySlug(s);
    if (product) {
      const target = `${product.product_no}-${product.slug}`;
      permanentRedirect(`/products/${target}`);
    }
  }

  notFound();
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
