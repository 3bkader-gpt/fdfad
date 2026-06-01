'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Product } from '@/types/supabase';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');
  const mainImage = product.product_images?.[0]?.url;

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      {/* 3:4 Image Container */}
      <div className="bg-bg-elevated border-border-color relative aspect-[3/4] overflow-hidden rounded-lg border shadow-sm">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="text-text-primary flex h-full items-center justify-center text-[10px] tracking-widest uppercase italic opacity-20">
            {t('awaitingVisuals')}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.made_in_egypt && (
            <span className="bg-brand-primary rounded-sm px-2 py-0.5 text-[7px] font-bold tracking-tighter text-white uppercase shadow-sm">
              {tc('madeInEgypt')}
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-text-primary group-hover:text-brand-accent line-clamp-1 text-[11px] font-medium tracking-tight uppercase transition-colors">
            {product.title}
          </h3>
          <span className="text-text-primary shrink-0 text-left font-mono text-[9px] opacity-40">
            OPAC {product.opacity_scale}/5
          </span>
        </div>

        <p className="text-text-secondary mb-1 text-[10px] italic">{product.fabric_type}</p>

        <p className="text-text-primary text-sm font-semibold">
          {product.price} {tc('egp')}
        </p>
      </div>
    </Link>
  );
}
