import { createClient } from '@/lib/supabase/server';
import { StatusPill } from './StatusPill';
import { notFound } from 'next/navigation';
import { User, MapPin, Notebook, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch order with its items
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#2C3E35]/40 uppercase transition-colors hover:text-[#C89B7E]"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-[#2C3E35]">
              {order.order_no}
            </h2>
            <StatusPill orderId={order.id} currentStatus={order.status} />
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Customer & Shipping */}
        <div className="flex flex-col gap-8 md:col-span-2">
          {/* Section: Customer */}
          <div className="rounded-2xl border border-[#2C3E35]/5 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3 border-b border-[#2C3E35]/5 pb-4">
              <User className="h-4 w-4 opacity-30" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                Customer Credentials
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Full Name
                </p>
                <p className="text-sm font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Mobile Number
                </p>
                <a
                  href={`tel:${order.phone_number}`}
                  className="text-sm font-bold text-[#C89B7E] underline underline-offset-4"
                >
                  {order.phone_number}
                </a>
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div className="rounded-2xl border border-[#2C3E35]/5 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3 border-b border-[#2C3E35]/5 pb-4">
              <MapPin className="h-4 w-4 opacity-30" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                Fulfillment Location
              </h3>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Governorate
                </p>
                <p className="text-sm font-medium">{order.governorate}</p>
              </div>
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-widest uppercase opacity-30">
                  Street Address
                </p>
                <p className="max-w-lg text-sm leading-relaxed font-medium">{order.address}</p>
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          {order.notes && (
            <div className="rounded-2xl border border-[#C89B7E]/10 bg-[#E5D9D0]/20 p-8">
              <div className="mb-4 flex items-center gap-3">
                <Notebook className="h-4 w-4 text-[#C89B7E]" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#C89B7E] uppercase">
                  Owner&apos;s Directive (Notes)
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[#2C3E35]/70 italic">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Payment */}
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl bg-[#2C3E35] p-8 text-white shadow-xl shadow-[#2C3E35]/10">
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <ShoppingBag className="h-4 w-4 opacity-40" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                Curation Manifest
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs leading-tight font-medium">
                      {item.products?.title || 'Unknown Product'}
                    </p>
                    <p className="text-[9px] tracking-widest uppercase opacity-40">
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

          {/* Quick Actions (Future) */}
          <div className="rounded-2xl border border-[#2C3E35]/5 bg-white p-6 text-center">
            <p className="mb-4 text-[9px] font-bold tracking-widest uppercase opacity-40">
              Internal Workflow
            </p>
            <button className="w-full rounded-lg border border-[#2C3E35]/10 py-3 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-colors hover:bg-[#FAFAFA]">
              Print Waybill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
