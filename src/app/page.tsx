import { supabase } from '@/lib/supabase';
import { Product } from '@/types/supabase';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-8 text-[#2C3E35]">
        <h1 className="text-center text-2xl font-semibold">Unable to load products</h1>
        <p className="mt-2 text-center text-sm opacity-70">
          Please check your Supabase connection strings in .env.local
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C3E35]">
      {/* Brand Header */}
      <header className="flex flex-col items-center px-6 py-12">
        <h1 className="font-serif text-5xl font-bold tracking-tight">فضفاض</h1>
        <p className="mt-4 text-center text-xs tracking-widest uppercase italic opacity-80">
          Modesty without compromise.
        </p>
      </header>

      {/* Product Grid */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {products?.map((product: Product) => (
            <div key={product.id} className="group relative flex flex-col">
              {/* Image Container (3:4 ratio per ADR) */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                {product.product_images?.[0] ? (
                  <Image
                    src={product.product_images[0].url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center italic opacity-30">
                    No Image
                  </div>
                )}
                {product.made_in_egypt && (
                  <span className="absolute top-2 left-2 rounded bg-[#4A7C59] px-2 py-1 text-[8px] font-bold text-white uppercase">
                    Made in Egypt
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4 flex flex-col">
                <h2 className="text-xs font-medium tracking-tight uppercase">{product.title}</h2>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm font-semibold">{product.price} EGP</p>
                  <span className="font-mono text-[9px] opacity-40">
                    OPAC {product.opacity_scale}/5
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products?.length === 0 && (
          <div className="py-20 text-center opacity-40">
            <p className="font-serif italic">Your curated catalog is arriving soon.</p>
          </div>
        )}
      </section>
    </main>
  );
}
