'use client';

import { useCart } from '@/lib/store';
import { X, ChevronRight, Heart, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { WHATSAPP_URL, CONTACT_EMAIL, INSTAGRAM_URL } from '@/data/site';
import { WhatsAppIcon } from './Icons';

export function MobileMenu() {
  const { isMenuOpen, setIsMenuOpen } = useCart();
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');

  const navLinks = [
    { key: 'home', href: '/' },
    { key: 'categories', href: '/categories' },
    { key: 'newArrivals', href: '/#collection' },
    { key: 'bestSellers', href: '/#collection' },
  ] as const;

  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer */}
      <div className="animate-slide-in-left bg-bg-main relative flex h-full w-[85%] max-w-sm flex-col shadow-2xl">
        {/* Header */}
        <header className="border-border-color flex items-center justify-between border-b px-6 py-6">
          <h2 className="text-text-primary font-serif text-xl font-bold tracking-tight">
            {t('explore')}
          </h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="hover:bg-bg-elevated rounded-full p-2 transition-colors"
          >
            <X className="text-text-primary h-5 w-5" />
          </button>
        </header>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-6 py-8">
          <ul className="flex flex-col gap-8 text-left">
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between"
                >
                  <span className="text-text-primary text-left text-sm font-bold tracking-[0.2em] uppercase opacity-80 transition-opacity group-hover:opacity-100">
                    {t(link.key)}
                  </span>
                  <ChevronRight className="text-text-primary h-4 w-4 opacity-20 rtl:rotate-180" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-primary flex w-full items-center justify-center gap-3 rounded-full py-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all active:scale-95"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t('contact')}
            </a>
          </div>

          <div className="border-border-color mt-16 border-t pt-8 text-left">
            <h3 className="text-text-primary mb-6 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
              Follow our Journey
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary flex items-center gap-3 text-xs opacity-60 transition-opacity hover:opacity-100"
              >
                <Heart className="h-4 w-4" />
                @fadfaad.cairo
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-text-primary flex items-center gap-3 text-xs opacity-60 transition-opacity hover:opacity-100"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <footer className="bg-bg-elevated/50 px-6 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-left">
          <p className="text-text-primary text-[9px] font-bold tracking-widest uppercase opacity-30">
            © 2026 {tc('title').toUpperCase()} CAIRO
          </p>
        </footer>
      </div>
    </div>
  );
}
