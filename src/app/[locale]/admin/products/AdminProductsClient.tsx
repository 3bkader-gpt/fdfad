'use client';

import { useState } from 'react';
import { Plus, Edit2, Search, Eye } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Product } from '@/types/supabase';
import { DeleteProductButton } from './DeleteProductButton';
import { useTranslations } from 'next-intl';

interface AdminProductsClientProps {
  products: Product[];
  locale: string;
}

export function AdminProductsClient({ products, locale }: AdminProductsClientProps) {
  const t = useTranslations('Admin');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');

  const filtered = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ? true : filter === 'active' ? p.is_active : !p.is_active;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="text-text-primary flex flex-col gap-8 text-start">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-4xl font-bold tracking-tight">{t('products')}</h2>
          <p className="mt-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('manageCollection')}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-brand-primary flex items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {t('newProduct')}
        </Link>
      </header>

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'ابحثي عن منتج...' : 'Search products...'}
            className="bg-bg-elevated ring-border-color focus:ring-brand-accent/30 w-full rounded-xl py-2.5 pr-4 pl-9 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'archived'] as const).map((f) => {
            const labels = {
              ar: { all: 'الكل', active: 'متاح', archived: 'مخفي' },
              en: { all: 'All', active: 'Active', archived: 'Archived' },
            };
            const label = labels[locale as 'ar' | 'en']?.[f] ?? f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                  filter === f
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-bg-elevated ring-border-color opacity-60 ring-1 hover:opacity-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="group border-border-color bg-bg-elevated relative flex flex-col rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="bg-bg-main relative aspect-[3/4] overflow-hidden rounded-xl">
              {product.product_images?.[0] ? (
                <Image
                  src={product.product_images[0].url}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-[10px] tracking-widest uppercase italic opacity-20">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 text-start">
                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-bold tracking-tighter uppercase ${product.is_active ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400'}`}
                >
                  {product.is_active ? t('active') : t('archived')}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-start">
              <h3 className="line-clamp-1 text-sm font-medium tracking-tight uppercase">
                {product.title}
              </h3>
              <p className="text-brand-accent text-lg font-bold">{product.price} EGP</p>
              <div className="mt-2 flex items-center gap-2 text-start">
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-30">
                  {product.fabric_type}
                </span>
              </div>
            </div>

            <div className="border-border-color mt-6 flex items-center gap-2 border-t pt-4 text-start">
              <Link
                href={`/admin/products/${product.id}`}
                className="bg-bg-main hover:bg-bg-elevated flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-colors hover:opacity-100"
              >
                <Edit2 className="h-3 w-3" />
                {t('edit')}
              </Link>
              <Link
                href={`/products/${product.product_no}-${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-bg-main hover:bg-bg-elevated flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-colors hover:opacity-100"
                title="Preview on storefront"
              >
                <Eye className="h-3 w-3" />
              </Link>
              <DeleteProductButton id={product.id} />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-24 text-center italic opacity-30">
            {search
              ? locale === 'ar'
                ? 'مفيش نتائج للبحث ده.'
                : 'No products match your search.'
              : locale === 'ar'
                ? 'مفيش منتجات متاحة دلوقتي.'
                : 'The collection is currently empty.'}
          </div>
        )}
      </div>
    </div>
  );
}
