'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Star, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get('orderNo');
  const t = useTranslations('Checkout');
  const tc = useTranslations('Common');
  const tn = useTranslations('Nav');
  
  const [lastOrder, setLastOrder] = useState<{orderNo: string, message: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastOrder');
    if (saved) {
      setLastOrder(JSON.parse(saved));
    }
  }, []);

  const openWhatsApp = () => {
    if (lastOrder) {
      window.open(`https://wa.me/201023100767?text=${encodeURIComponent(lastOrder.message)}`, '_blank');
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-12 text-center">
      <div className="animate-in zoom-in mb-8 rounded-full bg-green-50 p-6 duration-500">
        <CheckCircle2 className="h-16 w-12 text-[#4A7C59]" />
      </div>

      <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-[#2C3E35]">
        {t('success')}
      </h1>
      <p className="mb-10 text-sm text-pretty opacity-60">
        رقم الطلب: {orderNo || 'FDF-XXXX'}
        <br />
        تم فتح واتساب لإرسال الطلب مباشرة إلى فريق فضفاض.
      </p>

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
        {lastOrder && (
          <button
            onClick={openWhatsApp}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            فتح واتساب مرة أخرى
          </button>
        )}
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#2C3E35] py-5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all active:scale-95"
        >
          {tc('back')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
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
