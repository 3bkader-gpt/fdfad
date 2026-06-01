'use client';

import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrustBar() {
  const t = useTranslations('Trust');

  return (
    <div className="border-border-color bg-bg-elevated border-y px-6 py-4">
      <div className="no-scrollbar mx-auto flex max-w-2xl items-center justify-between gap-4 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-2">
          <ShieldCheck className="text-brand-primary h-4 w-4 opacity-80" />
          <span className="text-text-primary text-[9px] font-bold tracking-widest uppercase opacity-70">
            {t('cod')}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Truck className="text-brand-accent h-4 w-4" />
          <span className="text-text-primary text-[9px] font-bold tracking-widest uppercase opacity-70">
            {t('fastDelivery')}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <RotateCcw className="text-text-primary h-4 w-4 opacity-60" />
          <span className="text-text-primary text-[9px] font-bold tracking-widest uppercase opacity-70">
            {t('returns')}
          </span>
        </div>
      </div>
    </div>
  );
}
