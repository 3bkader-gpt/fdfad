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
    <div className="flex w-full flex-col gap-3">
      {/* Error message with shake */}
      {errorMsg && (
        <span
          role="alert"
          aria-live="polite"
          className={`rounded-lg border border-red-100 bg-red-50/50 py-1.5 text-center text-[10px] font-bold tracking-wider text-red-500 uppercase ${isShaking ? 'animate-shake' : ''}`}
        >
          {errorMsg}
        </span>
      )}

      {/* Quantity stepper + Add button row */}
      <div className="flex items-center gap-3">
        {/* Stepper */}
        <div className="border-border-color bg-bg-elevated flex items-center gap-0 rounded-xl border shadow-sm">
          <button
            type="button"
            aria-label={t('decreaseQuantity')}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="hover:bg-bg-main focus-visible:ring-brand-accent flex h-11 w-10 items-center justify-center rounded-l-xl transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none rtl:rounded-l-none rtl:rounded-r-xl"
          >
            <Minus className="h-3.5 w-3.5 opacity-60" />
          </button>
          <span className="w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label={t('increaseQuantity')}
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="hover:bg-bg-main focus-visible:ring-brand-accent flex h-11 w-10 items-center justify-center rounded-r-xl transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none rtl:rounded-l-xl rtl:rounded-r-none"
          >
            <Plus className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>

        {/* Add to cart button */}
        <div className="flex-1">
          <AnimatedOrderButton
            onClick={handleAdd}
            idleLabel={t('addToCart')}
            successLabel={t('addedToBag')}
            className="shadow-brand-primary/30 focus-visible:ring-brand-accent w-full shadow-2xl focus-visible:ring-2 focus-visible:outline-offset-2 focus-visible:outline-none"
            data-testid="add-to-cart-button"
          />
        </div>
      </div>
    </div>
  );
}
