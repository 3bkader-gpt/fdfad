'use client';

import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { Order } from '@/types/supabase';
import { StatusPill } from './[id]/StatusPill';
import { useTranslations } from 'next-intl';

interface AdminOrdersClientProps {
  orders: Order[];
  locale: string;
}

type FilterStatus =
  | 'ALL'
  | 'NEW'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export function AdminOrdersClient({ orders, locale }: AdminOrdersClientProps) {
  const router = useRouter();
  const t = useTranslations('Admin');
  const tcom = useTranslations('Common');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('ALL');

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.order_no.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone_number.includes(search);
    const matchesFilter = filter === 'ALL' ? true : o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statuses: FilterStatus[] = [
    'ALL',
    'NEW',
    'CONFIRMED',
    'PREPARING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="text-text-primary flex flex-col gap-8 text-start transition-colors duration-300">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="hover:text-brand-accent flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-40 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
            {t('backToOrders')}
          </Link>
          <h2 className="font-serif text-4xl font-bold tracking-tight">{t('orders')}</h2>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('overviewSub')}
          </p>
        </div>
      </header>

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="bg-bg-elevated ring-border-color focus:ring-brand-accent/30 w-full rounded-xl py-2.5 pr-4 pl-9 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {statuses.map((s) => {
            const label = s === 'ALL' ? t('filterAll') : t(`status.${s}`);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-bold tracking-wider whitespace-nowrap uppercase transition-all ${
                  filter === s
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

      {/* Orders Table */}
      <div className="border-border-color bg-bg-elevated overflow-x-auto rounded-2xl border shadow-sm">
        <table className="w-full min-w-[700px] text-start">
          <thead className="bg-bg-main border-border-color border-b whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                {t('colOrder')}
              </th>
              <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                {t('colCustomer')}
              </th>
              <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                {t('colLocation')}
              </th>
              <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                {t('colTotal')}
              </th>
              <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                {t('colStatus')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-border-color divide-y whitespace-nowrap">
            {filtered.map((order) => (
              <tr
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="group hover:bg-bg-main cursor-pointer transition-colors"
              >
                <td className="px-6 py-5">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-brand-accent font-mono text-xs font-bold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.order_no}
                  </Link>
                  <p className="mt-1 text-[9px] opacity-40">
                    {new Date(order.created_at).toLocaleDateString(
                      locale === 'ar' ? 'ar-EG' : 'en-US',
                    )}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs font-medium">{order.customer_name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-[10px] opacity-40">{order.phone_number}</p>
                    <a
                      href={`https://wa.me/2${order.phone_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:opacity-80"
                      onClick={(e) => e.stopPropagation()} // Prevent row click navigation
                    >
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs">{order.governorate}</p>
                </td>
                <td className="px-6 py-5 text-xs font-bold">
                  {order.total_amount} {tcom('egp')}
                </td>
                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                  <StatusPill orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-sm italic opacity-30">{t('noOrders')}</div>
        )}
      </div>
    </div>
  );
}
