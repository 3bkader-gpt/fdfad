'use client';

import { useCart } from '@/lib/store';
import { Product } from '@/types/supabase';
import { useTranslations } from 'next-intl';
import { AnimatedOrderButton } from './AnimatedOrderButton';
import { useState, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}

export function AddToCartButton({ product, selectedSize, selectedColor }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const t = useTranslations('Products');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [qty, setQty] = useState(1);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const handleAdd = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMsg(t('sizeRequired'));
      triggerShake();
      throw new Error('Size required');
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setErrorMsg(t('colorRequired'));
      triggerShake();
      throw new Error('Color required');
    }
    setErrorMsg(null);
    // Add item qty times
    for (let i = 0; i < qty; i++) {
      addItem(product, selectedSize, selectedColor);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Error message with shake */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className={`border-brand-accent/20 bg-brand-accent/5 flex items-center justify-center rounded-xl border py-2.5 transition-all ${isShaking ? 'animate-shake' : ''}`}
        >
          <span className="text-brand-primary text-[10px] font-bold tracking-[0.1em] uppercase">
            {errorMsg}
          </span>
        </div>
      )}

      {/* Quantity stepper + Add button row */}
      <div className="flex items-center gap-3">
        {/* Stepper */}
        <div className="border-border-color bg-bg-elevated flex h-14 items-center overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md">
          <button
            type="button"
            aria-label={t('decreaseQuantity')}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="hover:bg-bg-main active:bg-bg-main/80 flex h-full w-12 items-center justify-center transition-all focus:outline-none"
          >
            <Minus className="h-4 w-4 opacity-40 transition-opacity hover:opacity-100" />
          </button>
          <div className="border-border-color/50 flex w-10 flex-col items-center justify-center border-x">
            <span className="text-text-primary text-base font-bold tabular-nums" aria-live="polite">
              {qty}
            </span>
          </div>
          <button
            type="button"
            aria-label={t('increaseQuantity')}
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="hover:bg-bg-main active:bg-bg-main/80 flex h-full w-12 items-center justify-center transition-all focus:outline-none"
          >
            <Plus className="h-4 w-4 opacity-40 transition-opacity hover:opacity-100" />
          </button>
        </div>

        {/* Add to cart button */}
        <div className="h-14 flex-1">
          <AnimatedOrderButton
            onClick={handleAdd}
            idleLabel={t('addToCart')}
            successLabel={t('addedToBag')}
            className="h-full rounded-2xl shadow-xl transition-transform active:scale-[0.98]"
            data-testid="add-to-cart-button"
          />
        </div>
      </div>
    </div>
  );
}
