import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ui/ProductCard';
import { TrustBar } from '@/components/ui/TrustBar';
import { Product } from '@/types/supabase';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomeAnimations } from './HomeAnimations';

export const dynamic = 'force-dynamic';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Hero');
  const tp = await getTranslations('Products');
  const tc = await getTranslations('Common');

  const supabase = await createClient();

  const { data: products, error } = await supabase
    .schema('public')
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="bg-bg-main text-text-primary flex min-h-[70vh] flex-col items-center justify-center p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-pretty">{tc('error')}</h1>
      </div>
    );
  }

  return (
    <HomeAnimations>
      <main className="bg-bg-main text-text-primary min-h-screen transition-colors duration-300">
        {/* 1. Hero Section */}
        <section className="relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden bg-[#E5D9D0] px-6 py-16 text-center dark:bg-[#1A1A1A]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10" />

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-text-primary mb-4 text-center text-[9px] font-bold tracking-[0.4em] uppercase opacity-60">
              {t('est')}
            </span>
            <Link href="/">
              <h1 className="text-text-primary font-serif text-6xl font-bold tracking-tighter sm:text-7xl">
                {tc('title')}
              </h1>
            </Link>
            <p className="text-text-primary mx-auto mt-6 max-w-xs text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">
              {tc('subtitle')}
            </p>
            <div className="mt-12">
              <Link
                href="#collection"
                className="bg-brand-primary shadow-brand-primary/20 dark:text-bg-main rounded-full px-10 py-4 text-[10px] font-bold tracking-widest text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        </section>

        <TrustBar />

        <section id="collection" className="mx-auto max-w-2xl px-6 py-24 text-start">
          <header className="mb-16 text-center">
            <h2 className="text-text-primary text-center font-serif text-3xl font-medium tracking-tight italic">
              {tp('latest')}
            </h2>
            <div className="bg-brand-accent mx-auto mt-3 h-[1px] w-12" />
          </header>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-16 text-start">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center opacity-40">
              <p className="text-text-primary text-center font-serif text-lg italic">
                {tp('empty')}
              </p>
            </div>
          )}
        </section>
      </main>
    </HomeAnimations>
  );
}
