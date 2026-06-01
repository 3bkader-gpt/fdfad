import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ui/ProductCard';
import { TrustBar } from '@/components/ui/TrustBar';
import { Product } from '@/types/supabase';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Hero');
  const tp = await getTranslations('Products');
  const tc = await getTranslations('Common');

  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAFAFA] p-8 text-[#2C3E35]">
        <h1 className="text-center font-serif text-2xl font-bold text-pretty">{tc('error')}</h1>
      </div>
    );
  }

  const typedProducts = (products as Product[]) || [];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C3E35]">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[65vh] flex-col items-center justify-center overflow-hidden bg-[#E5D9D0] px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="mb-4 text-center text-[9px] font-bold tracking-[0.4em] uppercase opacity-40">
            {t('est')}
          </span>
          <h1 className="animate-fade-in font-serif text-6xl font-bold tracking-tighter sm:text-7xl">
            {tc('title')}
          </h1>
          <p className="mx-auto mt-6 max-w-xs text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
            {tc('subtitle')}
          </p>
          <div className="mt-12">
            <Link
              href="#collection"
              className="rounded-full bg-[#2C3E35] px-10 py-4 text-[10px] font-bold tracking-widest text-white uppercase shadow-2xl shadow-[#2C3E35]/20 transition-all hover:bg-[#1E2B25] active:scale-95"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />

      <section id="collection" className="mx-auto max-w-2xl px-6 py-24 text-start">
        <header className="mb-16 text-center">
          <h2 className="text-center font-serif text-3xl font-medium tracking-tight italic">
            {tp('latest')}
          </h2>
          <div className="mx-auto mt-3 h-[1px] w-12 bg-[#C89B7E]" />
        </header>

        {typedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-16 text-start">
            {typedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center opacity-40">
            <p className="text-center font-serif text-lg italic">{tp('empty')}</p>
          </div>
        )}
      </section>

      <footer className="border-t border-[#2C3E35]/5 bg-white px-6 py-16 text-center">
        <p className="text-center text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">
          © 2026 {tc('title').toUpperCase()} CAIRO
        </p>
      </footer>
    </main>
  );
}
