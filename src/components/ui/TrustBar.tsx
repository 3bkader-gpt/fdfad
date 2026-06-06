'use client';

import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrustBar() {
  const t = useTranslations('Trust');

  return (
    <div className="border-border-color bg-bg-elevated relative overflow-hidden border-y py-6 shadow-xs transition-colors duration-300">
      {/* Subtle Texture Layer */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.03] dark:invert" />

      <div className="no-scrollbar relative z-10 mx-auto flex max-w-2xl items-center justify-between gap-6 overflow-x-auto px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="bg-brand-primary/5 group-hover:bg-brand-primary/10 flex h-8 w-8 items-center justify-center rounded-full transition-colors">
            <ShieldCheck className="text-brand-primary h-4 w-4 opacity-80" />
          </div>
          <span className="text-text-primary text-[9px] font-bold tracking-[0.15em] uppercase opacity-70">
            {t('cod')}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="bg-brand-accent/5 flex h-8 w-8 items-center justify-center rounded-full">
            <Truck className="text-brand-accent h-4 w-4" />
          </div>
          <span className="text-text-primary text-[9px] font-bold tracking-[0.15em] uppercase opacity-70">
            {t('fastDelivery')}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="bg-text-primary/5 flex h-8 w-8 items-center justify-center rounded-full">
            <RotateCcw className="text-text-primary h-4 w-4 opacity-60" />
          </div>
          <span className="text-text-primary text-[9px] font-bold tracking-[0.15em] uppercase opacity-70">
            {t('returns')}
          </span>
        </div>
      </div>
    </div>
  );
}
