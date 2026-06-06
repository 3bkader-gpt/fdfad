'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Product } from '@/types/supabase';
import { useTranslations } from 'next-intl';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');

  if (products.length === 0) return null;

  return (
    <section className="border-border-color mx-auto mt-20 max-w-6xl border-t px-6 pt-12">
      <h3 className="text-brand-primary mb-8 text-center font-serif text-2xl font-bold tracking-tight md:text-start">
        {t('relatedTitle')}
      </h3>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((rel) => {
          const coverImg =
            rel.product_images?.find((img) => img.is_cover) || rel.product_images?.[0];
          return (
            <Link
              key={rel.id}
              href={`/products/${rel.product_no}-${rel.slug}`}
              className="group flex flex-col gap-3 text-start"
            >
              <div className="border-border-color relative aspect-[3/4] w-full overflow-hidden rounded-2xl border bg-[#F5F5F5]">
                {coverImg ? (
                  <Image
                    src={coverImg.url}
                    alt={rel.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs italic opacity-20">
                    {t('awaitingVisuals')}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
                  {rel.fabric_type}
                </span>
                <h4 className="group-hover:text-brand-accent text-text-primary truncate text-sm font-medium tracking-tight transition-colors">
                  {rel.title}
                </h4>
                <p className="text-brand-primary text-xs font-bold">
                  {rel.price}{' '}
                  <span className="text-[10px] font-normal opacity-60">{tc('egp')}</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
