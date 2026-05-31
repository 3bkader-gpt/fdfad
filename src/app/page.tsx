import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ui/ProductCard';
import { TrustBar } from '@/components/ui/TrustBar';
import { Product } from '@/types/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAFAFA] p-8 text-[#2C3E35]">
        <h1 className="text-center font-serif text-2xl font-bold text-pretty">
          Unexpected Encounter
        </h1>
        <p className="mt-2 text-center text-sm opacity-60">
          We could not retrieve our curated collection at this moment.
        </p>
      </div>
    );
  }

  const typedProducts = (products as unknown as Product[]) || [];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C3E35]">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[65vh] flex-col items-center justify-center overflow-hidden bg-[#E5D9D0] px-6 py-24 text-center">
        {/* Subtle decorative background element */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="mb-4 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40">
            Est. 2026
          </span>
          <h1 className="animate-fade-in font-serif text-6xl font-bold tracking-tighter sm:text-7xl">
            فضفاض
          </h1>
          <p className="mx-auto mt-6 max-w-xs text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
            The Art of Modest Drapery
          </p>
          <div className="mt-12">
            <Link
              href="#collection"
              className="rounded-full bg-[#2C3E35] px-10 py-4 text-[10px] font-bold tracking-widest text-white uppercase shadow-2xl shadow-[#2C3E35]/20 transition-all hover:bg-[#1E2B25] active:scale-95"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Product Collection */}
      <section id="collection" className="mx-auto max-w-2xl px-6 py-24">
        <header className="mb-16 text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight italic">Latest Arrivals</h2>
          <div className="mx-auto mt-3 h-[1px] w-12 bg-[#C89B7E]" />
        </header>

        {typedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-16">
            {typedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center opacity-40">
            <p className="font-serif text-lg italic">Our next curation is arriving soon.</p>
          </div>
        )}
      </section>

      {/* 4. Footer Placeholder */}
      <footer className="border-t border-[#2C3E35]/5 bg-white px-6 py-16 text-center">
        <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">
          © 2026 FADFAAD CAIRO
        </p>
      </footer>
    </main>
  );
}
