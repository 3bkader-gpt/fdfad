'use client';

import { useCart } from '@/lib/store';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { CartDrawer } from './CartDrawer';
import { MobileMenu } from './MobileMenu';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { WHATSAPP_URL } from '@/data/site';
import gsap from 'gsap';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'categories', href: '/categories' },
  { key: 'newArrivals', href: '/#collection' },
  { key: 'bestSellers', href: '/#collection' },
  { key: 'contact', href: 'mailto:hello@fadfaad.com' },
] as const;

export function GlobalHeader() {
  const pathname = usePathname();
  const { setIsOpen, setIsMenuOpen, isMenuOpen, items } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  const t = useTranslations('Common');
  const tn = useTranslations('Nav');
  const locale = useLocale();
  const lastScrollY = useRef(0);

  const dockInnerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Scroll visibility logic: show only near top, hide once scrolled past threshold
  useEffect(() => {
    const SHOW_THRESHOLD = 80;
    const onScroll = () => {
      const currentY = window.scrollY;
      setDockVisible(currentY <= SHOW_THRESHOLD);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP Sliding Pill Animation
  const slidePillTo = useCallback((link: HTMLAnchorElement | null) => {
    if (!highlightRef.current || !dockInnerRef.current || !link) return;
    const navRect = dockInnerRef.current.getBoundingClientRect();
    const itemRect = link.getBoundingClientRect();

    gsap.to(highlightRef.current, {
      x: itemRect.left - navRect.left,
      width: itemRect.width,
      autoAlpha: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, []);

  const hidePill = useCallback(() => {
    if (!highlightRef.current) return;
    gsap.to(highlightRef.current, {
      autoAlpha: 0,
      duration: 0.3,
    });
  }, []);

  const itemCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Don't show header on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* 1. Mobile Header (Floating Pill at Top) */}
      <header
        className={`fadfaad-dock-shell fixed inset-x-4 top-4 z-50 flex items-center justify-between rounded-full px-4 py-2 transition-all duration-500 ease-in-out md:hidden ${
          dockVisible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-24 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
            className="bg-bg-elevated hover:bg-brand-accent/5 border-border-color focus-visible:ring-brand-accent flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {isMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
          <LanguageToggle />
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label={t('title')}>
          <h1 className="text-text-primary font-serif text-lg font-bold tracking-tight">
            {t('title')}
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(true)}
            aria-label={t('openCart')}
            className="bg-bg-elevated hover:bg-brand-accent/5 border-border-color focus-visible:ring-brand-accent relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ShoppingBag className="text-text-primary h-4.5 w-4.5" />
            {itemCount > 0 && (
              <span className="animate-in zoom-in bg-brand-accent absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white shadow-lg">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Desktop Floating Dock (Fixed Bottom) */}
      <div
        className={`fixed inset-x-0 bottom-8 z-[60] hidden justify-center transition-all duration-500 ease-in-out md:flex ${
          dockVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div
          ref={dockInnerRef}
          className="fadfaad-dock-shell relative flex items-center gap-1 rounded-full px-3 py-2 shadow-2xl"
          onMouseLeave={hidePill}
        >
          {/* Animated Highlight Pill */}
          <div
            ref={highlightRef}
            className="fadfaad-dock-highlight pointer-events-none invisible absolute top-1 left-0"
            style={{ width: 0 }}
          />

          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onMouseEnter={(e) => slidePillTo(e.currentTarget as HTMLAnchorElement)}
              className="text-text-secondary hover:text-text-primary relative z-10 px-5 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
            >
              {tn(link.key)}
            </Link>
          ))}

          {/* Divider */}
          <div className="bg-border-color mx-2 h-6 w-[1px]" />

          {/* Actions */}
          <div className="flex items-center gap-2 px-2">
            <ThemeToggle />
            <LanguageToggle />

            <button
              onClick={() => setIsOpen(true)}
              aria-label={t('openCart')}
              className="bg-bg-elevated hover:bg-brand-accent/10 border-border-color focus-visible:ring-brand-accent relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ShoppingBag className="text-text-primary h-4.5 w-4.5" />
              {itemCount > 0 && (
                <span className="bg-brand-accent absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={locale === 'ar' ? 'اطلبي الآن عبر واتساب' : 'Order now on WhatsApp'}
              className="bg-brand-primary focus-visible:ring-brand-accent ml-2 flex items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:scale-105 focus-visible:ring-2 focus-visible:outline-offset-2 active:scale-95"
            >
              <span>{locale === 'ar' ? 'اطلبي الآن' : 'Order Now'}</span>
            </a>
          </div>
        </div>
      </div>

      <CartDrawer />
      <MobileMenu />
    </>
  );
}
