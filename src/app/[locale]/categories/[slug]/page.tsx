import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { Link } from '@/i18n/routing';
import { ChevronLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Product } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Categories');
  const tc = await getTranslations('Common');

  // 1. Fetch category metadata
  const { data: categoryData, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (catError || !categoryData) {
    notFound();
  }

  // Double assertion to explicitly define the schema type
  const category = categoryData as unknown as {
    id: string;
    name: string;
    description: string | null;
  };

  // 2. Fetch active products for this category using an inner join
  const { data: productsData, error: prodError } = await (
    supabase.from('products') as unknown as {
      select: (query: string) => {
        eq: (
          k: string,
          v: string | boolean,
        ) => {
          eq: (
            k: string,
            v: string | boolean,
          ) => {
            order: (
              k: string,
              opts: { ascending: boolean },
            ) => Promise<{ data: unknown; error: unknown }>;
          };
        };
      };
    }
  )
    .select('*, product_images(*), product_categories!inner(category_id)')
    .eq('is_active', true)
    .eq('product_categories.category_id', category.id)
    .order('created_at', { ascending: false });

  if (prodError) {
    return (
      <div className="bg-bg-main text-text-primary flex min-h-[70vh] flex-col items-center justify-center p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-pretty">{tc('error')}</h1>
      </div>
    );
  }

  const typedProducts = (productsData as Product[]) || [];

  return (
    <main className="bg-bg-main text-text-primary min-h-screen pb-32 transition-colors duration-300">
      <header className="border-border-color bg-bg-elevated relative overflow-hidden border-b px-6 py-16 text-center">
        <Link
          href="/categories"
          className="bg-bg-main hover:bg-brand-accent/5 border-border-color absolute top-8 left-6 z-10 rounded-full border p-2 shadow-sm transition-colors"
          aria-label={tc('back')}
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <div className="relative z-10">
          <h1 className="text-text-primary mb-4 font-serif text-4xl font-bold tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-text-secondary mx-auto max-w-md text-sm leading-relaxed opacity-60">
              {category.description}
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
