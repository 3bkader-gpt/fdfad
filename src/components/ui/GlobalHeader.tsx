'use client';

import { useCart } from '@/lib/store';
import { Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { CartDrawer } from './CartDrawer';
import { MobileMenu } from './MobileMenu';
import { useEffect, useState } from 'react';

export function GlobalHeader() {
  const { setIsOpen, setIsMenuOpen, items } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Standard Next.js hydration pattern
    setIsMounted(true);
  }, []);

  const itemCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#2C3E35]/5 bg-white/80 px-6 py-4 backdrop-blur-md text-left">
        <div className="flex items-center gap-4 text-left">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="rounded-full bg-[#FAFAFA] p-2 transition-colors hover:bg-zinc-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-serif text-xl font-bold tracking-tight">فضفاض</h1>
        </Link>

        <div className="flex items-center text-left">
          <button
            onClick={() => setIsOpen(true)}
            className="relative rounded-full bg-[#FAFAFA] p-2 transition-colors hover:bg-zinc-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="animate-in zoom-in absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C89B7E] text-[8px] font-bold text-white duration-300">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer />
      <MobileMenu />
    </>
  );
}
/* eslint-disable react-hooks/set-state-in-effect */
