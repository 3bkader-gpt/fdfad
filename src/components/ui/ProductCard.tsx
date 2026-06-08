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
    <Link
      href={`/products/${product.product_no}-${product.slug}`}
      className="group focus-visible:ring-brand-accent flex flex-col focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`${tc('view')} ${product.title}`}
    >
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
          <div className="text-text-primary flex h-full items-center justify-center text-[10px] tracking-widest uppercase italic opacity-60">
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
      <div className="mt-3.5 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-text-primary group-hover:text-brand-accent line-clamp-1 flex-1 text-[11px] font-bold tracking-tight uppercase transition-colors">
            {product.title}
          </h3>
          <div className="bg-text-primary/5 text-text-primary group-hover:bg-brand-accent/10 group-hover:text-brand-accent flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[8px] font-medium tracking-tighter transition-colors">
            <span className="h-1 w-1 rounded-full bg-current opacity-40" />
            <span>OPAC {product.opacity_scale}</span>
          </div>
        </div>

        <p className="text-text-secondary line-clamp-1 text-[9px] leading-tight font-medium opacity-60">
          {product.fabric_type}
        </p>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-text-primary text-sm font-bold tracking-tight">
            {product.price}
          </span>
          <span className="text-text-secondary text-[8px] font-bold tracking-widest uppercase opacity-40">
            {tc('egp')}
          </span>
        </div>
      </div>
    </Link>
  );
}
