'use client';

import { useCart } from '@/lib/store';
import { Menu, ShoppingBag, Globe } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { CartDrawer } from './CartDrawer';
import { MobileMenu } from './MobileMenu';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export function GlobalHeader() {
  const { setIsOpen, setIsMenuOpen, items } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const itemCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#2C3E35]/5 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAFAFA] transition-colors hover:bg-zinc-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={toggleLanguage}
            className="flex h-11 items-center gap-1.5 rounded-full bg-[#FAFAFA] px-4 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-zinc-100"
          >
            <Globe className="h-3.5 w-3.5 opacity-40" />
            <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-serif text-xl font-bold tracking-tight">{t('title')}</h1>
        </Link>

        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#FAFAFA] transition-colors hover:bg-zinc-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="animate-in zoom-in absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C89B7E] text-[8px] font-bold text-white duration-300">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer />
      <MobileMenu />
    </>
  );
}
