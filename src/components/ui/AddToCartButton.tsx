'use client';

import { useCart } from '@/lib/store';
import { Product } from '@/types/supabase';
import { useTranslations } from 'next-intl';
import { AnimatedOrderButton } from './AnimatedOrderButton';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}

export function AddToCartButton({ product, selectedSize, selectedColor }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const t = useTranslations('Products');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = () => {
    // 1. Validate size selection if sizes are available
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMsg(t('sizeRequired'));
      return;
    }

    // 2. Validate color selection if colors are available
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setErrorMsg(t('colorRequired'));
      return;
    }

    setErrorMsg(null);
    addItem(product, selectedSize, selectedColor);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {errorMsg && (
        <span className="rounded-lg border border-red-100 bg-red-50/50 py-1.5 text-center text-[10px] font-bold tracking-wider text-red-500 uppercase">
          {errorMsg}
        </span>
      )}
      <AnimatedOrderButton
        onClick={handleAdd}
        idleLabel={t('addToCart')}
        successLabel="Added to Bag"
        className="shadow-brand-primary/30 w-full shadow-2xl"
      />
    </div>
  );
}
