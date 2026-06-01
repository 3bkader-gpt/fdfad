import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ShieldCheck, Truck, Star } from 'lucide-react';
import { Product } from '@/types/supabase';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Products');
  const tc = await getTranslations('Common');

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;

  return (
    <main className="min-h-screen bg-white pb-32 text-[#2C3E35]">
      {/* 1. Mobile Navigation Header */}
      <nav className="fixed top-0 left-0 z-[60] flex w-full items-center justify-between border-b border-[#2C3E35]/5 bg-white/80 px-6 py-4 backdrop-blur-md">
        <Link
          href="/"
          className="rounded-full bg-[#FAFAFA] p-2 transition-colors hover:bg-zinc-100"
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h1 className="font-serif text-lg font-bold tracking-tight">{tc('title')}</h1>
        <div className="w-9" />
      </nav>

      {/* 2. Image Gallery */}
      <section className="pt-[73px]">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F5]">
          {product.product_images?.[0] ? (
            <Image
              src={product.product_images[0].url}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-xs tracking-widest uppercase italic opacity-20">
              {t('awaitingVisuals')}
            </div>
          )}
          {product.made_in_egypt && (
            <span className="absolute bottom-6 left-6 rounded bg-[#4A7C59] px-4 py-1.5 text-[9px] font-bold tracking-[0.2em] text-white uppercase shadow-lg backdrop-blur-sm">
              {tc('madeInCairo')}
            </span>
          )}
        </div>
      </section>

      {/* 3. Product Info */}
      <section className="px-6 pt-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 opacity-40">
            <span className="text-[9px] font-bold tracking-widest uppercase">
              {product.fabric_type}
            </span>
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="text-[9px] font-bold tracking-widest uppercase">{tc('handmade')}</span>
          </div>
          <h2 className="font-serif text-4xl leading-tight font-medium tracking-tight">
            {product.title}
          </h2>
          <div className="flex items-center justify-between border-b border-[#2C3E35]/5 pb-6">
            <p className="text-2xl font-semibold tracking-tight">
              {product.price} <span className="text-sm font-normal opacity-60">{tc('egp')}</span>
            </p>
            <div className="flex items-center gap-1.5 rounded-full bg-[#FAFAFA] px-3 py-1">
              <Star className="h-3 w-3 fill-[#C89B7E] text-[#C89B7E]" />
              <span className="text-[9px] font-bold tracking-wider uppercase opacity-60">
                {t('premium')}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Fabric & Modesty Meters */}
        <div className="mt-10 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                {t('opacity')}
              </span>
              <span className="text-[10px] font-medium italic opacity-60">
                {product.opacity_scale === 5 ? t('opaque') : t('highlyModest')}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                    level <= product.opacity_scale ? 'bg-[#C89B7E]' : 'bg-[#E5D9D0]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#2C3E35]/5 bg-[#FAFAFA] p-4">
              <span className="mb-1 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                {t('fabric')}
              </span>
              <span className="text-xs font-medium">{product.fabric_type}</span>
            </div>
            <div className="rounded-xl border border-[#2C3E35]/5 bg-[#FAFAFA] p-4">
              <span className="mb-1 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                {t('origin')}
              </span>
              <span className="text-xs font-medium">{tc('madeInEgypt')}</span>
            </div>
          </div>
        </div>

        {/* 5. Description */}
        <div className="mt-10 border-t border-[#2C3E35]/5 pt-8">
          <h4 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
            {t('details')}
          </h4>
          <p className="text-sm leading-relaxed text-pretty opacity-70">{product.description}</p>
        </div>

        {/* 6. Local Trust Badges */}
        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-[#2C3E35]/5 bg-[#FAFAFA] p-6">
          <div className="flex items-center gap-5">
            <div className="rounded-full bg-white p-2.5 shadow-sm ring-1 ring-black/5">
              <ShieldCheck className="h-5 w-5 text-[#4A7C59]" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight uppercase">{tc('confirm')}</p>
              <p className="mt-0.5 text-[10px] opacity-60">Pay securely upon doorstep arrival.</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="rounded-full bg-white p-2.5 shadow-sm ring-1 ring-black/5">
              <Truck className="h-5 w-5 text-[#C89B7E]" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight uppercase">Nationwide Express</p>
              <p className="text-[10px] text-pretty opacity-60">
                Hand-packed and delivered in 2-3 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-[#2C3E35]/5 bg-white/90 px-6 pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] backdrop-blur-lg">
        <AddToCartButton product={product} />
      </div>
    </main>
  );
}
