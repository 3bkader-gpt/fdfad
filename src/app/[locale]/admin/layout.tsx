'use client';

import { logout } from './login/actions';
import { LogOut, Package, ShoppingBag, Tag } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

import { NotificationProvider } from '@/providers/NotificationProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Admin');
  const tc = useTranslations('Common');
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin' || pathname.startsWith('/admin/orders');
    }
    return pathname.startsWith(href);
  };

  const isLoginPage = pathname.endsWith('/admin/login');

  if (isLoginPage) {
    return <NotificationProvider>{children}</NotificationProvider>;
  }

  return (
    <NotificationProvider>
      <div className="bg-bg-main text-text-primary flex min-h-screen transition-colors duration-300">
        {/* Sidebar / Bottom Bar */}
        <aside className="border-border-color bg-bg-elevated fixed bottom-0 left-0 z-50 flex w-full border-t px-6 py-4 md:static md:h-screen md:w-64 md:flex-col md:border-t-0 md:border-r">
          <div className="hidden md:mb-12 md:block md:px-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight">فضفاض</h1>
            <p className="text-[10px] tracking-widest uppercase opacity-40">{t('dashboard')}</p>
          </div>

          <nav className="flex w-full items-center justify-between md:flex-col md:items-start md:gap-4">
            <Link
              href="/admin"
              className={`flex w-auto items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:w-full ${
                isActive('/admin')
                  ? 'bg-brand-primary/10 text-brand-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-main'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden md:inline">{t('orders')}</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex w-auto items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:w-full ${
                isActive('/admin/products')
                  ? 'bg-brand-primary/10 text-brand-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-main'
              }`}
            >
              <Package className="h-5 w-5" />
              <span className="hidden md:inline">{t('products')}</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex w-auto items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:w-full ${
                isActive('/admin/categories')
                  ? 'bg-brand-primary/10 text-brand-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-main'
              }`}
            >
              <Tag className="h-5 w-5" />
              <span className="hidden md:inline">{t('categories')}</span>
            </Link>

            <div className="md:mt-auto md:w-full">
              {/* Desktop Theme/Language Toggles */}
              <div className="md:border-border-color hidden md:mb-4 md:flex md:items-center md:gap-3 md:border-t md:px-2 md:pt-4">
                <ThemeToggle />
                <LanguageToggle />
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline">{t('logout')}</span>
                </button>
              </form>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile Admin Header */}
          <header className="border-border-color bg-bg-elevated flex items-center justify-between border-b px-6 py-3 md:hidden">
            <div className="flex flex-col">
              <h1 className="font-serif text-lg font-bold">{tc('title')}</h1>
              <p className="text-[8px] tracking-widest uppercase opacity-40">{t('dashboard')}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </header>

          <main className="min-w-0 flex-1 p-6 pb-24 md:pb-6">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}
