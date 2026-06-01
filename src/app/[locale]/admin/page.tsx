import { createClient } from '@/lib/supabase/server';
import { StatusPill } from './orders/[id]/StatusPill';
import { ShoppingBag, Clock, Package, Truck, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="text-text-primary flex flex-col gap-10 text-start">
      <header>
        <h2 className="font-serif text-4xl font-bold tracking-tight">{t('overview')}</h2>
        <p className="mt-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
          Your business at a glance
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <MetricCard
            label="Total"
            value={metrics.total}
            icon={<ShoppingBag className="h-4 w-4" />}
            color="bg-bg-elevated border border-border-color"
          />
        </div>
        <MetricCard
          label="New"
          value={metrics.new}
          icon={<Clock className="h-4 w-4" />}
          color="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
        />
        <MetricCard
          label="Preparing"
          value={metrics.preparing}
          icon={<Package className="h-4 w-4" />}
          color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
        />
        <MetricCard
          label="Shipped"
          value={metrics.shipped}
          icon={<Truck className="h-4 w-4" />}
          color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
        />
        <MetricCard
          label="Delivered"
          value={metrics.delivered}
          icon={<CheckCircle2 className="h-4 w-4" />}
          color="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
        />
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
                  Order
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Customer
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Location
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Total
                </th>
                <th className="px-6 py-4 text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-border-color divide-y whitespace-nowrap">
              {typedOrders.slice(0, 10).map((order) => (
                <tr key={order.id} className="group hover:bg-bg-main transition-colors">
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand-accent font-mono text-xs font-bold hover:underline"
                    >
                      {order.order_no}
                    </Link>
                    <p className="mt-1 text-[9px] opacity-40">
                      {new Date(order.created_at).toLocaleDateString()}
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
              Awaiting first curation.
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
      <p className="text-[9px] font-bold tracking-widest uppercase opacity-40">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
