'use client';

import { useCart } from '@/lib/store';
import { Product } from '@/types/supabase';
import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const t = useTranslations('Products');

  return (
    <button
      onClick={() => addItem(product)}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2C3E35] py-5 text-[10px] font-bold tracking-[0.3em] text-white uppercase shadow-2xl shadow-[#2C3E35]/30 transition-all hover:bg-[#1E2B25] active:scale-95"
    >
      <ShoppingBag className="mb-0.5 h-4 w-4" />
      {t('addToCart')}
    </button>
  );
}
