'use client';

import { ShieldCheck, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ShippingInfo() {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');
  const tco = useTranslations('Checkout');

  return (
    <div className="border-border-color bg-bg-elevated flex flex-col gap-4 rounded-2xl border p-6">
      <h4 className="border-border-color border-b pb-2 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
        {t('shippingTitle')}
      </h4>
      <div className="flex items-center gap-4">
        <div className="bg-bg-main ring-border-color rounded-full p-2 shadow-sm ring-1">
          <ShieldCheck className="text-brand-primary h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-tight uppercase">{tc('exchangePolicy')}</p>
          <p className="mt-0.5 text-[10px] opacity-60">{tc('easyExchange')}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-bg-main ring-border-color rounded-full p-2 shadow-sm ring-1">
          <Truck className="text-brand-accent h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-tight uppercase">{tco('cashOnDelivery')}</p>
          <p className="text-[10px] text-pretty opacity-60">{tc('easyExchange')}</p>
        </div>
      </div>
    </div>
  );
}
