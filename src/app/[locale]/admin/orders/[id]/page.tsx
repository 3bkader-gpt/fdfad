import { createClient } from '@/lib/supabase/server';
import { StatusPill } from './StatusPill';
import { notFound } from 'next/navigation';
import { User, MapPin, Notebook, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { OrderWithItems } from '@/types/supabase';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // Fetch order with its items
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const order = data as OrderWithItems;

  return (
    <div className="text-text-primary flex flex-col gap-10 pb-20 transition-colors duration-300">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="hover:text-brand-accent flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-40 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-4 text-start">
            <h2 className="font-serif text-4xl font-bold tracking-tight">{order.order_no}</h2>
            <StatusPill orderId={order.id} currentStatus={order.status} />
          </div>
          <p className="text-start text-[10px] font-bold tracking-widest uppercase opacity-40">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Customer & Shipping */}
        <div className="flex flex-col gap-8 md:col-span-2">
          {/* Section: Customer */}
          <div className="border-border-color bg-bg-elevated rounded-2xl border p-8 shadow-sm">
            <div className="border-border-color mb-8 flex items-center gap-3 border-b pb-4">
              <User className="h-4 w-4 opacity-30" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                Customer Credentials
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-8 text-start sm:grid-cols-2">
              <div>
                <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Full Name
                </p>
                <p className="text-start text-sm font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Mobile Number
                </p>
                <a
                  href={`tel:${order.phone_number}`}
                  className="text-brand-accent text-start text-sm font-bold underline underline-offset-4"
                >
                  {order.phone_number}
                </a>
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div className="border-border-color bg-bg-elevated rounded-2xl border p-8 text-start shadow-sm">
            <div className="border-border-color mb-8 flex items-center gap-3 border-b pb-4">
              <MapPin className="h-4 w-4 opacity-30" />
              <h3 className="text-start text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                Fulfillment Location
              </h3>
            </div>
            <div className="flex flex-col gap-6 text-start">
              <div>
                <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Governorate
                </p>
                <p className="text-start text-sm font-medium">{order.governorate}</p>
              </div>
              <div>
                <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Street Address
                </p>
                <p className="max-w-lg text-start text-sm leading-relaxed font-medium">
                  {order.address}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          {order.notes && (
            <div className="border-brand-accent/10 bg-brand-accent/5 rounded-2xl border p-8 text-start">
              <div className="mb-4 flex items-center gap-3 text-start">
                <Notebook className="text-brand-accent h-4 w-4" />
                <h3 className="text-brand-accent text-start text-[10px] font-bold tracking-[0.2em] uppercase">
                  Owner&apos;s Directive (Notes)
                </h3>
              </div>
              <p className="text-start text-sm leading-relaxed italic opacity-70">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Payment */}
        <div className="flex flex-col gap-8 text-start">
          <div className="bg-brand-primary shadow-brand-primary/10 rounded-2xl p-8 text-start text-white shadow-xl">
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4 text-start">
              <ShoppingBag className="h-4 w-4 opacity-40" />
              <h3 className="text-start text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                Curation Manifest
              </h3>
            </div>

            <div className="flex flex-col gap-6 text-start">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 text-start">
                  <div className="flex flex-col gap-1 text-start">
                    <p className="text-start text-xs leading-tight font-medium">
                      {item.products?.title || 'Unknown Product'}
                    </p>
                    <p className="text-start text-[9px] tracking-widest uppercase opacity-40">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-bold whitespace-nowrap">
                    {item.price_at_purchase * item.quantity} EGP
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                Collection Total
              </span>
              <span className="text-2xl font-bold tracking-tight">{order.total_amount} EGP</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-[9px] font-bold tracking-widest uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4A7C59]" />
              Cash on Delivery
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-border-color bg-bg-elevated rounded-2xl border p-6 text-center">
            <p className="mb-4 text-center text-[9px] font-bold tracking-widest uppercase opacity-40">
              Internal Workflow
            </p>
            <button className="border-border-color hover:bg-bg-main w-full rounded-lg border py-3 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-colors">
              Print Waybill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
