'use client';

import { useCart } from '@/lib/store';
import { Menu, ShoppingCart, X } from 'lucide-react';
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

  // Scroll visibility: hide on scroll-down, show on scroll-up, optimized with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollY.current;
          if (delta > 8) {
            setDockVisible(false);
            lastScrollY.current = currentY;
          } else if (delta < -8) {
            setDockVisible(true);
            lastScrollY.current = currentY;
          }
          ticking = false;
        });
        ticking = true;
      }
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
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
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
            <ShoppingCart className="text-text-primary h-4.5 w-4.5" />
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
        className={`fixed inset-x-0 bottom-10 z-[60] hidden justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] md:flex ${
          dockVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div
          ref={dockInnerRef}
          className="fadfaad-dock-shell border-border-color bg-bg-elevated/80 relative flex items-center gap-1 rounded-full border px-3 py-2 shadow-2xl backdrop-blur-xl"
          onMouseLeave={hidePill}
        >
          {/* Animated Highlight Pill */}
          <div
            ref={highlightRef}
            className="fadfaad-dock-highlight bg-brand-accent/10 pointer-events-none invisible absolute top-1.5 left-0 rounded-full dark:bg-white/10"
            style={{ width: 0, height: 'calc(100% - 12px)' }}
          />

          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onMouseEnter={(e) => slidePillTo(e.currentTarget as HTMLAnchorElement)}
              className="text-text-primary hover:text-brand-accent relative z-10 px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300"
            >
              {tn(link.key)}
            </Link>
          ))}

          {/* Vertical Divider */}
          <div className="mx-3 h-5 w-[1px] bg-current opacity-25" />

          {/* Actions Cluster */}
          <div className="flex items-center gap-1.5 px-1">
            <ThemeToggle />
            <LanguageToggle />

            <button
              onClick={() => setIsOpen(true)}
              aria-label={t('openCart')}
              className="bg-bg-elevated hover:bg-brand-accent/10 border-border-color focus-visible:ring-brand-accent relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
            >
              <ShoppingCart className="text-text-primary h-4 w-4" />
              {itemCount > 0 && (
                <span className="bg-brand-accent absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black text-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-primary focus-visible:ring-brand-accent shadow-brand-primary/20 ml-3 flex items-center gap-2 rounded-full px-7 py-3 text-[9px] font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:scale-105 focus-visible:ring-2 focus-visible:outline-offset-2 active:scale-95"
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
