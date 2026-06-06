'use client';

import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProductInfoProps {
  title: string;
  price: number;
  fabricType?: string | null;
}

export function ProductInfo({ title, price, fabricType }: ProductInfoProps) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 opacity-40">
        <span className="text-[9px] font-bold tracking-widest uppercase">{fabricType}</span>
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="text-[9px] font-bold tracking-widest uppercase">{tc('handmade')}</span>
      </div>

      <h2 className="font-serif text-3xl leading-tight font-medium tracking-tight md:text-4xl">
        {title}
      </h2>

      <div className="border-border-color flex items-center justify-between border-b pb-5">
        <p className="text-brand-primary text-2xl font-semibold tracking-tight">
          {price} <span className="text-sm font-normal opacity-60">{tc('egp')}</span>
        </p>

        <div className="bg-bg-elevated ring-border-color flex items-center gap-1.5 rounded-full px-3 py-1 ring-1">
          <Star className="fill-brand-accent text-brand-accent h-3 w-3" />
          <span className="text-[9px] font-bold tracking-wider uppercase opacity-60">
            {t('premium')}
          </span>
        </div>
      </div>
    </div>
  );
}
