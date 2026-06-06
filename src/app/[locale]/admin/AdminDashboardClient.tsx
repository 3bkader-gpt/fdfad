'use client';

import { useMemo } from 'react';
import { StatusPill } from './orders/[id]/StatusPill';
import {
  ShoppingBag,
  Clock,
  CheckCheck,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Order } from '@/types/supabase';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

interface AdminDashboardClientProps {
  initialOrders: Order[];
  locale: string;
  translations: {
    overview: string;
    overviewSub: string;
    metricTotal: string;
    metricNew: string;
    metricConfirmed: string;
    metricPreparing: string;
    metricShipped: string;
    metricDelivered: string;
    metricCancelled: string;
    revenueWeek: string;
    deliveredOnly: string;
    recentOrders: string;
    viewAll: string;
    colOrder: string;
    colCustomer: string;
    colLocation: string;
    colTotal: string;
    colStatus: string;
    noOrders: string;
    egp: string;
  };
}

export function AdminDashboardClient({
  initialOrders,
  locale,
  translations: t,
}: AdminDashboardClientProps) {
  const { orders } = useRealtimeOrders(initialOrders);

  const metrics = useMemo(() => {
    return {
      total: orders.length,
      new: orders.filter((o) => o.status === 'NEW').length,
      confirmed: orders.filter((o) => o.status === 'CONFIRMED').length,
      preparing: orders.filter((o) => o.status === 'PREPARING').length,
      shipped: orders.filter((o) => o.status === 'SHIPPED').length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    };
  }, [orders]);

  const revenueThisWeek = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return orders
      .filter((o) => o.status === 'DELIVERED' && new Date(o.created_at) >= oneWeekAgo)
      .reduce((sum, o) => sum + o.total_amount, 0);
  }, [orders]);

  return (
    <div className="text-text-primary flex flex-col gap-10 text-start">
      <header>
        <h2 className="font-serif text-4xl font-bold tracking-tight">{t.overview}</h2>
        <p className="mt-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
          {t.overviewSub}
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <div className="col-span-2 md:col-span-1">
          <MetricCard
            label={t.metricTotal}
            value={metrics.total}
            icon={<ShoppingBag className="h-4 w-4" />}
            color="bg-bg-elevated border border-border-color"
          />
        </div>
        <MetricCard
          label={t.metricNew}
          value={metrics.new}
          icon={<Clock className="h-4 w-4" />}
          color="bg-status-new-bg text-status-new-text"
        />
        <MetricCard
          label={t.metricConfirmed}
          value={metrics.confirmed}
          icon={<CheckCheck className="h-4 w-4" />}
          color="bg-status-confirmed-bg text-status-confirmed-text"
        />
        <MetricCard
          label={t.metricPreparing}
          value={metrics.preparing}
          icon={<Package className="h-4 w-4" />}
          color="bg-status-preparing-bg text-status-preparing-text"
        />
        <MetricCard
          label={t.metricShipped}
          value={metrics.shipped}
          icon={<Truck className="h-4 w-4" />}
          color="bg-status-shipped-bg text-status-shipped-text"
        />
        <MetricCard
          label={t.metricDelivered}
          value={metrics.delivered}
          icon={<CheckCircle2 className="h-4 w-4" />}
          color="bg-status-delivered-bg text-status-delivered-text"
        />
        <MetricCard
          label={t.metricCancelled}
          value={metrics.cancelled}
          icon={<XCircle className="h-4 w-4" />}
          color="bg-status-cancelled-bg text-status-cancelled-text"
        />
        {/* Revenue KPI */}
        <div className="col-span-2 md:col-span-4 lg:col-span-7">
          <div className="border-brand-accent/20 bg-brand-accent/5 flex items-center justify-between rounded-2xl border p-5">
            <div className="flex items-center gap-3">
              <div className="bg-brand-accent/10 text-brand-accent rounded-lg p-2">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                  {t.revenueWeek}
                </p>
                <p className="text-brand-accent text-2xl font-bold tabular-nums">
                  {revenueThisWeek.toLocaleString()} {t.egp}
                </p>
              </div>
            </div>
            <p className="text-[9px] font-bold tracking-widest uppercase opacity-30">
              {t.deliveredOnly}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase opacity-40">
            {t.recentOrders}
          </h3>
          <Link
            href="/admin/orders"
            className="text-brand-accent text-[10px] font-bold tracking-widest uppercase underline underline-offset-4"
          >
            {t.viewAll}
          </Link>
        </div>

        <div className="border-border-color bg-bg-elevated overflow-x-auto rounded-2xl border shadow-sm">
          <table className="w-full min-w-[600px] text-start">
            <thead className="bg-bg-main border-border-color border-b whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  {t.colOrder}
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  {t.colCustomer}
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  {t.colLocation}
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  {t.colTotal}
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  {t.colStatus}
                </th>
              </tr>
            </thead>
            <tbody className="divide-border-color divide-y whitespace-nowrap">
              {orders.slice(0, 10).map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-bg-main cursor-pointer transition-colors"
                >
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand-accent font-mono text-xs font-bold hover:underline"
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
                    {order.total_amount} {t.egp}
                  </td>
                  <td className="px-6 py-5">
                    <StatusPill orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-20 text-center text-sm italic opacity-30">{t.noOrders}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const isColored = !color.includes('bg-bg-elevated');

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm transition-all duration-300 ${
        isColored
          ? `${color} border border-white/10 dark:border-white/5`
          : 'bg-bg-elevated border-border-color text-text-primary border'
      }`}
    >
      <div
        className={`mb-3 inline-flex rounded-lg p-2 ${
          isColored
            ? 'bg-white/10 text-current dark:bg-white/5'
            : 'bg-brand-primary/10 text-brand-primary'
        }`}
      >
        {icon}
      </div>
      <p
        className={`text-[10px] font-bold tracking-widest uppercase ${isColored ? 'text-current/80' : 'text-text-secondary'}`}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
