'use client';

import { logout } from './login/actions';
import { LogOut, Package, ShoppingBag, Tag } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Admin');

  return (
    <div className="bg-bg-main text-text-primary flex min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <aside className="border-border-color bg-bg-elevated fixed bottom-0 left-0 z-50 flex w-full border-t px-6 py-4 md:static md:h-screen md:w-64 md:flex-col md:border-t-0 md:border-r">
        <div className="hidden md:mb-12 md:block md:px-2">
          <h1 className="font-serif text-2xl font-bold tracking-tight">فضفاض</h1>
          <p className="text-[10px] tracking-widest uppercase opacity-40">{t('dashboard')}</p>
        </div>

        <nav className="flex w-full items-center justify-between md:flex-col md:items-start md:gap-4">
          <Link
            href="/admin"
            className="hover:bg-bg-main flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden md:inline">{t('orders')}</span>
          </Link>

          <Link
            href="/admin/products"
            className="hover:bg-bg-main flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <Package className="h-5 w-5" />
            <span className="hidden md:inline">{t('products')}</span>
          </Link>

          <Link
            href="/admin/categories"
            className="hover:bg-bg-main flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <Tag className="h-5 w-5" />
            <span className="hidden md:inline">{t('categories')}</span>
          </Link>

          <div className="md:mt-auto">
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden md:inline">{t('logout')}</span>
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 pb-24 md:pb-6">{children}</main>
    </div>
  );
}
