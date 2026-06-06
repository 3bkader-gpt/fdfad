import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/supabase';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isMenuOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  addItem: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (
    productId: string,
    delta: number,
    selectedSize?: string,
    selectedColor?: string,
  ) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isMenuOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      setIsMenuOpen: (open) => set({ isMenuOpen: open }),
      addItem: (product, selectedSize, selectedColor) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor,
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({
            items: [...currentItems, { product, quantity: 1, selectedSize, selectedColor }],
          });
        }
      },
      removeItem: (productId, selectedSize, selectedColor) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
              ),
          ),
        });
      },
      updateQuantity: (productId, delta, selectedSize, selectedColor) => {
        const currentItems = get().items;
        set({
          items: currentItems.map((item) =>
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'fdfad-cart-storage',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
