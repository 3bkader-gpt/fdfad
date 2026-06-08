'use client';

import { useCart } from '@/lib/store';
import { X, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCart();
  const t = useTranslations('Cart');
  const tc = useTranslations('Common');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end rtl:justify-start"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 cursor-pointer bg-black/20 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-bg-main relative flex h-full w-full max-w-md flex-col shadow-2xl"
            data-testid="cart-drawer"
          >
            <div className="flex h-full w-full flex-col">
              {/* Header */}
              <header className="border-border-color flex items-center justify-between border-b px-6 py-6">
                <div className="text-text-primary flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 opacity-80" aria-hidden="true" />
                  <h2 id="cart-title" className="font-serif text-xl font-bold tracking-tight">
                    {t('title')}
                  </h2>
                  <span className="bg-brand-primary rounded-full px-2.5 py-0.5 text-[9px] font-bold text-white">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label={tc('close')}
                  className="hover:bg-bg-elevated focus-visible:ring-brand-accent rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  autoFocus
                >
                  <X className="text-text-primary h-5 w-5 opacity-60" />
                </button>
              </header>

              {/* Items List */}
              <div className="no-scrollbar text-text-primary flex-1 overflow-y-auto px-6 py-4 text-start">
                {items.length > 0 ? (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-6"
                    role="list"
                  >
                    {items.map((item) => (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { ease: 'easeOut', duration: 0.4 },
                          },
                        }}
                        key={`${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                        className="group flex gap-4"
                        role="listitem"
                      >
                        <div className="bg-bg-elevated border-border-color relative aspect-[3/4] h-28 w-20 shrink-0 overflow-hidden rounded-md border shadow-sm">
                          {item.product.product_images?.[0] && (
                            <Image
                              src={item.product.product_images[0].url}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <div className="text-text-primary flex items-start justify-between gap-2">
                              <h3 className="line-clamp-1 text-[11px] font-bold tracking-tight uppercase">
                                {item.product.title}
                              </h3>
                              <p className="text-left text-xs font-bold whitespace-nowrap">
                                {item.product.price}{' '}
                                <span className="text-[8px] opacity-60">{tc('egp')}</span>
                              </p>
                            </div>
                            <p className="text-text-secondary mt-1 text-[10px] italic opacity-60">
                              {item.product.fabric_type}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="bg-bg-elevated ring-border-color flex items-center gap-3 rounded-full px-1.5 py-1 shadow-sm ring-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    -1,
                                    item.selectedSize,
                                    item.selectedColor,
                                  )
                                }
                                aria-label={t('decreaseQuantity')}
                                className="hover:text-brand-accent text-text-primary focus-visible:ring-brand-accent flex h-7 w-7 items-center justify-center transition-colors focus-visible:rounded-full focus-visible:ring-2 focus-visible:outline-none"
                              >
                                <Minus className="h-3 w-3 opacity-60" />
                              </button>
                              <span className="text-text-primary w-4 text-center text-[10px] font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    1,
                                    item.selectedSize,
                                    item.selectedColor,
                                  )
                                }
                                aria-label={t('increaseQuantity')}
                                className="hover:text-brand-accent text-text-primary focus-visible:ring-brand-accent flex h-7 w-7 items-center justify-center transition-colors focus-visible:rounded-full focus-visible:ring-2 focus-visible:outline-none"
                              >
                                <Plus className="h-3 w-3 opacity-60" />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.product.id, item.selectedSize, item.selectedColor)
                              }
                              aria-label={`${t('remove')} ${item.product.title}`}
                              className="text-text-primary text-[9px] font-bold tracking-widest uppercase opacity-40 transition-colors hover:text-red-500 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                            >
                              {t('remove')}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-text-primary flex h-full flex-col items-center justify-center text-center opacity-40"
                  >
                    <div className="bg-brand-primary/5 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
                      <ShoppingCart
                        className="text-brand-primary h-10 w-10 opacity-30"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="font-serif text-2xl font-medium tracking-tight">{t('empty')}</p>
                    <p className="mt-2 max-w-[200px] text-xs leading-relaxed opacity-60">
                      Your curated selection will appear here.
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-brand-primary text-bg-main mt-8 rounded-full px-8 py-3 text-[9px] font-bold tracking-widest uppercase shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      {t('continueBrowsing')}
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <footer className="border-border-color bg-bg-elevated border-t px-6 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                  <div className="text-text-primary mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                      {t('subtotal')}
                    </span>
                    <span className="text-2xl font-bold tracking-tight">
                      {total()} <span className="text-xs font-normal opacity-60">{tc('egp')}</span>
                    </span>
                  </div>

                  <p className="text-text-primary mb-6 text-center text-[9px] font-medium tracking-widest uppercase opacity-40">
                    {t('shippingNote')}
                  </p>

                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="bg-brand-primary shadow-brand-primary/20 hover:bg-brand-primary/90 focus-visible:ring-brand-accent flex w-full items-center justify-center gap-3 rounded-full py-5 text-[10px] font-bold tracking-[0.3em] text-white uppercase shadow-xl transition-all focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
                  >
                    {t('checkout')}
                    <ArrowRight className="h-4 w-4 opacity-80 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </footer>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
