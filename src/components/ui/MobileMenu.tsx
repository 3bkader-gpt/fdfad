'use client';

import { useCart } from '@/lib/store';
import { X, ChevronRight, Heart, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function MobileMenu() {
  const { isMenuOpen, setIsMenuOpen } = useCart();
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');

  const CATEGORIES = [
    { name: t('home'), href: '/' },
    { name: 'Abayas', href: '/#collection' },
    { name: 'Khimars', href: '/#collection' },
    { name: 'Jilbabs', href: '/#collection' },
    { name: 'Prayer Wear', href: '/#collection' },
  ];

  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer */}
      <div className="animate-slide-in-left relative flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#2C3E35]/5 px-6 py-6">
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#2C3E35]">
            {t('explore')}
          </h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-full p-2 transition-colors hover:bg-[#FAFAFA]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-6 py-8">
          <ul className="flex flex-col gap-8 text-left">
            {CATEGORIES.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={cat.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between"
                >
                  <span className="text-left text-sm font-bold tracking-[0.2em] text-[#2C3E35] uppercase opacity-80 transition-opacity group-hover:opacity-100">
                    {cat.name}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-20 rtl:rotate-180" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 border-t border-[#2C3E35]/5 pt-8 text-left">
            <h3 className="mb-6 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
              {t('contact')}
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="https://instagram.com"
                className="flex items-center gap-3 text-xs opacity-60"
              >
                <Heart className="h-4 w-4" />
                @fadfaad.cairo
              </a>
              <a
                href="mailto:hello@fadfaad.com"
                className="flex items-center gap-3 text-xs opacity-60"
              >
                <Mail className="h-4 w-4" />
                hello@fadfaad.com
              </a>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <footer className="bg-[#FAFAFA] px-6 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-left">
          <p className="text-[9px] font-bold tracking-widest uppercase opacity-30">
            © 2026 {tc('title').toUpperCase()} CAIRO
          </p>
        </footer>
      </div>
    </div>
  );
}
