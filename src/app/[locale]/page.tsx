'use client';

import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ui/ProductCard';
import { TrustBar } from '@/components/ui/TrustBar';
import { Product } from '@/types/supabase';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, use } from 'react';
import gsap from 'gsap';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = use(params);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const t = useTranslations('Hero');
  const tp = useTranslations('Products');
  const tc = useTranslations('Common');

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        setError(true);
      } else {
        setProducts((data as Product[]) || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && titleRef.current) {
      const tl = gsap.timeline();
      tl.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      })
        .from(
          subtitleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.8',
        )
        .from(
          collectionRef.current,
          {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.4',
        );
    }
  }, [loading]);

  if (error) {
    return (
      <div className="bg-bg-main text-text-primary flex min-h-[70vh] flex-col items-center justify-center p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-pretty">{tc('error')}</h1>
      </div>
    );
  }

  return (
    <main className="bg-bg-main text-text-primary min-h-screen transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[#E5D9D0] px-6 py-24 text-center dark:bg-[#1A1A1A]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-text-primary mb-4 text-center text-[9px] font-bold tracking-[0.4em] uppercase opacity-40">
            {t('est')}
          </span>
          <h1
            ref={titleRef}
            className="text-text-primary font-serif text-6xl font-bold tracking-tighter sm:text-7xl"
          >
            {tc('title')}
          </h1>
          <p
            ref={subtitleRef}
            className="text-text-primary mx-auto mt-6 max-w-xs text-[10px] font-bold tracking-[0.3em] uppercase opacity-60"
          >
            {tc('subtitle')}
          </p>
          <div className="mt-12">
            <Link
              href="#collection"
              className="bg-brand-primary shadow-brand-primary/20 rounded-full px-10 py-4 text-[10px] font-bold tracking-widest text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />

      <section
        id="collection"
        ref={collectionRef}
        className="mx-auto max-w-2xl px-6 py-24 text-start"
      >
        <header className="mb-16 text-center">
          <h2 className="text-text-primary text-center font-serif text-3xl font-medium tracking-tight italic">
            {tp('latest')}
          </h2>
          <div className="bg-brand-accent mx-auto mt-3 h-[1px] w-12" />
        </header>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse flex-col gap-4">
                <div className="bg-bg-elevated aspect-[3/4] w-full rounded-lg" />
                <div className="bg-bg-elevated h-4 w-3/4 rounded" />
                <div className="bg-bg-elevated h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-16 text-start">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center opacity-40">
            <p className="text-text-primary text-center font-serif text-lg italic">{tp('empty')}</p>
          </div>
        )}
      </section>

      <footer className="border-border-color bg-bg-elevated border-t px-6 py-16 text-center">
        <p className="text-text-primary text-center text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">
          © 2026 {tc('title').toUpperCase()} CAIRO
        </p>
      </footer>
    </main>
  );
}
