'use client';

import { useCart } from '@/lib/store';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

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
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end rtl:justify-start"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="animate-slide-in-right bg-bg-main relative flex h-full w-full max-w-md flex-col shadow-2xl"
        data-testid="cart-drawer"
      >
        {/* Header */}
        <header className="border-border-color flex items-center justify-between border-b px-6 py-6">
          <div className="text-text-primary flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <h2 id="cart-title" className="font-serif text-xl font-bold tracking-tight">
              {t('title')}
            </h2>
            <span className="bg-brand-primary rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label={tc('close')}
            className="hover:bg-bg-elevated focus-visible:ring-brand-accent rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            autoFocus
          >
            <X className="text-text-primary h-5 w-5" />
          </button>
        </header>

        {/* Items List */}
        <div className="no-scrollbar text-text-primary flex-1 overflow-y-auto px-6 py-4 text-start">
          {items.length > 0 ? (
            <div className="flex flex-col gap-6" role="list">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                  className="group flex gap-4"
                  role="listitem"
                >
                  <div className="bg-bg-elevated border-border-color relative aspect-[3/4] h-24 w-18 shrink-0 overflow-hidden rounded border">
                    {item.product.product_images?.[0] && (
                      <Image
                        src={item.product.product_images[0].url}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div>
                      <div className="text-text-primary flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-xs font-medium tracking-tight uppercase">
                          {item.product.title}
                        </h3>
                        <p className="text-left text-sm font-semibold whitespace-nowrap">
                          {item.product.price} {tc('egp')}
                        </p>
                      </div>
                      <p className="text-text-primary mt-0.5 text-[10px] italic opacity-40">
                        {item.product.fabric_type}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="bg-bg-elevated ring-border-color flex items-center gap-4 rounded-full px-2 py-1 ring-1">
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
                          className="hover:text-brand-accent text-text-primary focus-visible:ring-brand-accent flex h-8 w-8 items-center justify-center transition-colors focus-visible:rounded-full focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-text-primary w-4 text-center text-xs font-bold">
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
                          className="hover:text-brand-accent text-text-primary focus-visible:ring-brand-accent flex h-8 w-8 items-center justify-center transition-colors focus-visible:rounded-full focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.selectedSize, item.selectedColor)
                        }
                        aria-label={`${t('remove')} ${item.product.title}`}
                        className="text-[10px] font-bold tracking-widest text-red-500/60 uppercase transition-colors hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-text-primary flex h-full flex-col items-center justify-center text-center opacity-30">
              <ShoppingBag className="mb-4 h-12 w-12 stroke-1" aria-hidden="true" />
              <p className="font-serif text-lg italic">{t('empty')}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="focus-visible:ring-brand-accent mt-6 text-xs font-bold tracking-widest uppercase underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
              >
                {t('continueBrowsing')}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-border-color bg-bg-elevated border-t px-6 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
            <div className="text-text-primary mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                {t('subtotal')}
              </span>
              <span className="text-xl font-bold tracking-tight">
                {total()} {tc('egp')}
              </span>
            </div>

            <p className="text-text-primary mb-6 text-center text-[10px] italic opacity-50">
              {t('shippingNote')}
            </p>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="bg-brand-primary shadow-brand-primary/20 hover:bg-brand-primary/90 focus-visible:ring-brand-accent flex w-full items-center justify-center gap-3 rounded-full py-5 text-[10px] font-bold tracking-[0.3em] text-white uppercase shadow-xl transition-all focus-visible:ring-2 focus-visible:outline-none active:scale-95"
            >
              {t('checkout')}
              <ArrowRight className="h-3 w-3 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}
