import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/supabase';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isMenuOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
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
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...currentItems, { product, quantity: 1 }], isOpen: true });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },
      updateQuantity: (productId, delta) => {
        const currentItems = get().items;
        set({
          items: currentItems.map((item) =>
            item.product.id === productId
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
