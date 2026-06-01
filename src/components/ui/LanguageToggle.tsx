'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-bg-elevated hover:bg-brand-accent/10 border-border-color text-text-primary flex h-11 items-center gap-1.5 rounded-full border px-4 text-[10px] font-bold tracking-widest uppercase shadow-sm transition-colors"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التغيير إلى العربية'}
    >
      <Globe className="h-3.5 w-3.5 opacity-40" />
      <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
}
