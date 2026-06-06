import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { Link } from '@/i18n/routing';
import { ChevronLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Product, Database } from '@/types/supabase';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

/**
 * Category Detail Page (Server Component)
 * Fetches products for a specific category using the URL slug.
 * Handles Unicode/Arabic slug decoding and normalization.
 */

async function getCategory(slug: string) {
  const supabase = await createClient();
  return await supabase
    .schema('public')
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug, locale } = await params;
  const slug = decodeURIComponent(rawSlug).normalize('NFC');
  const { data: category } = await getCategory(slug);

  if (!category) return { title: 'Category Not Found' };

  const name = (locale === 'ar' ? category.name_ar : category.name_en) || category.name;
  return {
    title: `${name} | Fadfaad`,
    description:
      (locale === 'ar' ? category.description_ar : category.description_en) ||
      'Explore our collection',
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug: rawSlug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Categories');
  const tc = await getTranslations('Common');

  // Decode and normalize slug
  const slug = decodeURIComponent(rawSlug).normalize('NFC');

  const supabase = await createClient();

  // 1. Fetch category metadata
  let { data: category, error: catError } = await getCategory(slug);

  // Fallback to raw slug if decoded fails
  if ((catError || !category) && slug !== rawSlug) {
    const fallback = await getCategory(rawSlug);
    if (fallback.data) {
      category = fallback.data;
      catError = null;
    }
  }

  if (catError || !category) {
    notFound();
  }

  // 2. Fetch active products for this category using an inner join
  const { data: productsData, error: prodError } = await supabase
    .schema('public')
    .from('products')
    .select('*, product_images(*), product_categories!inner(category_id)')
    .eq('is_active', true)
    .eq(
      'product_categories.category_id',
      (category as Database['public']['Tables']['categories']['Row']).id,
    )
    .order('created_at', { ascending: false });

  if (prodError) {
    return (
      <div className="bg-bg-main text-text-primary flex min-h-[70vh] flex-col items-center justify-center p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-pretty">{tc('error')}</h1>
      </div>
    );
  }

  const typedProducts = (productsData as Product[]) || [];
  const categoryName = (locale === 'ar' ? category.name_ar : category.name_en) || category.name;
  const categoryDescription = locale === 'ar' ? category.description_ar : category.description_en;

  return (
    <main className="bg-bg-main text-text-primary min-h-screen pb-32 transition-colors duration-300">
      <header className="border-border-color bg-bg-elevated relative overflow-hidden border-b px-6 pt-24 pb-12 text-center md:py-16">
        <Link
          href="/categories"
          className="bg-bg-main hover:bg-brand-accent/5 border-border-color absolute top-8 left-6 z-10 rounded-full border p-2 shadow-sm transition-colors"
          aria-label={tc('back')}
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <div className="relative z-10">
          <h1 className="text-text-primary mb-4 font-serif text-4xl font-bold tracking-tight">
            {categoryName}
          </h1>
          {categoryDescription && (
            <p className="text-text-secondary mx-auto max-w-md text-sm leading-relaxed opacity-60">
              {categoryDescription}
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-16 text-start">
        {typedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-16 text-start">
            {typedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center opacity-40">
            <p className="text-text-primary text-center font-serif text-lg italic">
              {t('emptyProducts')}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
