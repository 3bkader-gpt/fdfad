import { createClient } from '@/lib/supabase/server';
import { StatusPill } from './orders/[id]/StatusPill';
import { ShoppingBag, Clock, Package, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch metrics and recent orders
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  const typedOrders = (data as unknown as Order[]) || [];

  const metrics = {
    total: typedOrders.length,
    new: typedOrders.filter((o) => o.status === 'NEW').length,
    preparing: typedOrders.filter((o) => o.status === 'PREPARING').length,
    shipped: typedOrders.filter((o) => o.status === 'SHIPPED').length,
    delivered: typedOrders.filter((o) => o.status === 'DELIVERED').length,
  };

  return (
    <div className="flex flex-col gap-10 text-left">
      <header>
        <h2 className="font-serif text-4xl font-bold tracking-tight text-[#2C3E35]">Overview</h2>
        <p className="mt-2 text-[10px] font-bold tracking-widest text-[#2C3E35]/60 uppercase">
          Your business at a glance
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <MetricCard
          label="Total"
          value={metrics.total}
          icon={<ShoppingBag className="h-4 w-4" />}
          color="bg-gray-100"
        />
        <MetricCard
          label="New"
          value={metrics.new}
          icon={<Clock className="h-4 w-4" />}
          color="bg-blue-100 text-blue-700"
        />
        <MetricCard
          label="Preparing"
          value={metrics.preparing}
          icon={<Package className="h-4 w-4" />}
          color="bg-yellow-100 text-yellow-700"
        />
        <MetricCard
          label="Shipped"
          value={metrics.shipped}
          icon={<Truck className="h-4 w-4" />}
          color="bg-indigo-100 text-indigo-700"
        />
        <MetricCard
          label="Delivered"
          value={metrics.delivered}
          icon={<CheckCircle2 className="h-4 w-4" />}
          color="bg-green-100 text-green-700"
        />
      </div>

      {/* Orders Table */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase opacity-40">
            Recent Curations
          </h3>
          <Link
            href="/admin/orders"
            className="text-[10px] font-bold tracking-widest text-[#C89B7E] uppercase underline underline-offset-4"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#2C3E35]/5 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b border-[#2C3E35]/5 bg-[#FAFAFA]">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C3E35]/5">
              {typedOrders.slice(0, 10).map((order) => (
                <tr key={order.id} className="group transition-colors hover:bg-[#FAFAFA]">
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs font-bold text-[#C89B7E] hover:underline"
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
                  <td className="px-6 py-5 text-xs font-bold">{order.total_amount} EGP</td>
                  <td className="px-6 py-5 text-left">
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
    <div className="rounded-2xl border border-[#2C3E35]/5 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex rounded-lg p-2 ${color.split(' ')[0]}`}>{icon}</div>
      <p className="text-[9px] font-bold tracking-widest uppercase opacity-40">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#2C3E35]">{value}</p>
    </div>
  );
}
