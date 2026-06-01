'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get('orderNo');
  const t = useTranslations('Checkout');
  const tc = useTranslations('Common');
  const tn = useTranslations('Nav');

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-12 text-center">
      <div className="animate-in zoom-in mb-8 rounded-full bg-green-50 p-6 duration-500">
        <CheckCircle2 className="h-16 w-12 text-[#4A7C59]" />
      </div>

      <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-[#2C3E35]">
        {t('success')}
      </h1>
      <p className="mb-10 text-sm text-pretty opacity-60">{t('successNote')}</p>

      {/* Order Info */}
      <div className="mb-10 w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#2C3E35]/5 pb-4 text-left">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              {t('orderNo')}
            </span>
            <span className="font-mono text-sm font-bold text-[#C89B7E]">
              {orderNo || 'FDF-XXXX'}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#2C3E35]/5 pb-4 text-left">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Status
            </span>
            <span className="rounded bg-[#FAFAFA] px-2 py-1 text-[10px] font-bold uppercase">
              {t('processing')}
            </span>
          </div>
          <div className="flex items-center justify-between text-left">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Fulfillment
            </span>
            <span className="text-xs font-medium">2-3 Business Days</span>
          </div>
        </div>
      </div>

      {/* Social / Next Steps */}
      <div className="flex w-full flex-col gap-4">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#2C3E35] py-5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all active:scale-95"
        >
          {tc('back')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>

        <a
          href="https://instagram.com"
          target="_blank"
          className="flex w-full items-center justify-center gap-3 rounded-full border border-[#2C3E35]/10 py-5 text-[11px] font-bold tracking-[0.2em] text-[#2C3E35] uppercase transition-all hover:bg-[#FAFAFA]"
        >
          <Star className="h-4 w-4" />
          {tn('about')}
        </a>
      </div>

      <footer className="mt-16 opacity-30">
        <p className="text-[9px] font-bold tracking-widest uppercase">
          © 2026 {tc('title').toUpperCase()} CAIRO
        </p>
      </footer>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C3E35]">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-xs tracking-widest uppercase italic opacity-40">
            Awaiting Verification...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
