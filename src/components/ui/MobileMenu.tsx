'use client';

import { useCart } from '@/lib/store';
import { X, ChevronRight, Heart, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { WHATSAPP_URL, CONTACT_EMAIL, INSTAGRAM_URL } from '@/data/site';
import { WhatsAppIcon } from './Icons';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[100] flex"
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-bg-main relative flex h-full w-[85%] max-w-sm flex-col shadow-2xl rtl:mr-0 rtl:ml-auto rtl:translate-x-full"
          >
            {/* Header */}
            <header className="border-border-color flex items-center justify-between border-b px-6 py-6">
              <h2
                id="menu-title"
                className="text-text-primary font-serif text-xl font-bold tracking-tight"
              >
                {t('explore')}
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label={tc('close')}
                className="hover:bg-bg-elevated focus-visible:ring-brand-accent rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                autoFocus
              >
                <X className="text-text-primary h-5 w-5" />
              </button>
            </header>

            {/* Navigation */}
            <nav className="no-scrollbar flex-1 overflow-y-auto px-6 py-8">
              <ul className="flex flex-col gap-8 text-left">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group focus-visible:ring-brand-accent flex items-center justify-between focus-visible:ring-2 focus-visible:outline-none"
                      aria-label={t(link.key)}
                    >
                      <span className="text-text-primary text-left text-sm font-bold tracking-[0.2em] uppercase opacity-80 transition-opacity group-hover:opacity-100">
                        {t(link.key)}
                      </span>
                      <ChevronRight className="text-text-primary h-4 w-4 opacity-20 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-primary focus-visible:ring-brand-accent flex w-full items-center justify-center gap-3 rounded-full py-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all focus-visible:ring-2 focus-visible:outline-offset-2 active:scale-95"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {t('contact')}
                </a>
              </motion.div>

              <motion.div
                className="border-border-color mt-16 border-t pt-8 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-text-primary mb-6 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Follow our Journey
                </h3>
                <div className="flex flex-col gap-4">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary focus-visible:ring-brand-accent flex items-center gap-3 text-xs opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Heart className="h-4 w-4" />
                    @fadfaad.cairo
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-text-primary focus-visible:ring-brand-accent flex items-center gap-3 text-xs opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Mail className="h-4 w-4" />
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </motion.div>
            </nav>

            {/* Footer */}
            <footer className="bg-bg-elevated/50 px-6 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-left">
              <p className="text-text-primary text-[9px] font-bold tracking-widest uppercase opacity-30">
                © 2026 {tc('title').toUpperCase()} CAIRO
              </p>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
