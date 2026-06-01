'use client';

import { useCart } from '@/lib/store';
import { Product } from '@/types/supabase';
import { useTranslations } from 'next-intl';
import { AnimatedOrderButton } from './AnimatedOrderButton';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const t = useTranslations('Products');

  const handleAdd = () => {
    addItem(product);
  };

  return (
    <AnimatedOrderButton
      onClick={handleAdd}
      idleLabel={t('addToCart')}
      successLabel="Added to Bag"
      className="shadow-brand-primary/30 shadow-2xl"
    />
  );
}
