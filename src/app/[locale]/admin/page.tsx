import { createClient } from '@/lib/supabase/server';
import { StatusPill } from './orders/[id]/StatusPill';
import { ShoppingBag, Clock, Package, Truck, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Order } from '@/types/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Admin');
  const tc = await getTranslations('Common');

  const supabase = await createClient();

  // Fetch metrics and recent orders
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-text-primary">Error loading orders: {error.message}</div>;
  }

  const typedOrders = (data as Order[]) || [];

  const metrics = {
    total: typedOrders.length,
    new: typedOrders.filter((o) => o.status === 'NEW').length,
    preparing: typedOrders.filter((o) => o.status === 'PREPARING').length,
    shipped: typedOrders.filter((o) => o.status === 'SHIPPED').length,
    delivered: typedOrders.filter((o) => o.status === 'DELIVERED').length,
  };

  // Revenue this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const revenueThisWeek = typedOrders
    .filter((o) => o.status === 'DELIVERED' && new Date(o.created_at) >= oneWeekAgo)
    .reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="text-text-primary flex flex-col gap-10 text-start">
      <header>
        <h2 className="font-serif text-4xl font-bold tracking-tight">{t('overview')}</h2>
        <p className="mt-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
          {t('overviewSub')}
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <MetricCard
            label={t('metricTotal')}
            value={metrics.total}
            icon={<ShoppingBag className="h-4 w-4" />}
            color="bg-bg-elevated border border-border-color"
          />
        </div>
        <MetricCard
          label={t('metricNew')}
          value={metrics.new}
          icon={<Clock className="h-4 w-4" />}
          color="bg-status-new-bg text-status-new-text"
        />
        <MetricCard
          label={t('metricPreparing')}
          value={metrics.preparing}
          icon={<Package className="h-4 w-4" />}
          color="bg-status-preparing-bg text-status-preparing-text"
        />
        <MetricCard
          label={t('metricShipped')}
          value={metrics.shipped}
          icon={<Truck className="h-4 w-4" />}
          color="bg-status-shipped-bg text-status-shipped-text"
        />
        <MetricCard
          label={t('metricDelivered')}
          value={metrics.delivered}
          icon={<CheckCircle2 className="h-4 w-4" />}
          color="bg-status-delivered-bg text-status-delivered-text"
        />
        {/* Revenue KPI */}
        <div className="col-span-2 md:col-span-5">
          <div className="border-brand-accent/20 bg-brand-accent/5 flex items-center justify-between rounded-2xl border p-5">
            <div className="flex items-center gap-3">
              <div className="bg-brand-accent/10 text-brand-accent rounded-lg p-2">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">{t('revenueWeek')}</p>
                <p className="text-brand-accent text-2xl font-bold tabular-nums">{revenueThisWeek.toLocaleString()} {tc('egp')}</p>
              </div>
            </div>
            <p className="text-[9px] font-bold tracking-widest uppercase opacity-30">{t('deliveredOnly')}</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase opacity-40">
            {t('recentOrders')}
          </h3>
          <Link
            href="/admin/orders"
            className="text-brand-accent text-[10px] font-bold tracking-widest uppercase underline underline-offset-4"
          >
            {t('viewAll')}
          </Link>
        </div>

        <div className="border-border-color bg-bg-elevated overflow-x-auto rounded-2xl border shadow-sm">
          <table className="w-full min-w-[600px] text-start">
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
              {typedOrders.slice(0, 10).map((order) => (
                <tr key={order.id} className="group hover:bg-bg-main transition-colors cursor-pointer">
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand-accent font-mono text-xs font-bold hover:underline"
                    >
                      {order.order_no}
                    </Link>
                    <p className="mt-1 text-[9px] opacity-40">
                      {new Date(order.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium">{order.customer_name}</p>
                    <p className="text-[10px] opacity-40">{order.phone_number}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs">{order.governorate}</p>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold">
                    {order.total_amount} {tc('egp')}
                  </td>
                  <td className="px-6 py-5">
                    <StatusPill orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {typedOrders.length === 0 && (
            <div className="py-20 text-center text-sm italic opacity-30">
              {t('noOrders')}
            </div>
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
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ${color.includes('border') ? color : ''} ${!color.includes('border') ? color : ''} bg-bg-elevated border-border-color border`}
    >
      <div className={`mb-3 inline-flex rounded-lg p-2 ${color}`}>{icon}</div>
      <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
