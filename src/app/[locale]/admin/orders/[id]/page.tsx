import { createClient } from '@/lib/supabase/server';
import { StatusPill } from './StatusPill';
import { notFound } from 'next/navigation';
import { User, MapPin, Notebook, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { OrderWithItems } from '@/types/supabase';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PrintWaybillButton } from './PrintWaybillButton';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Admin');

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
            {t('backToOrders')}
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
                  الاسم الكامل
                </p>
                <p className="text-start text-sm font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                  رقم الموبايل
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${order.phone_number}`}
                    className="text-brand-accent text-start text-sm font-bold underline underline-offset-4"
                  >
                    {order.phone_number}
                  </a>
                  <a
                    href={`https://wa.me/2${order.phone_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1 text-[9px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    واتساب
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div className="border-border-color bg-bg-elevated rounded-2xl border p-8 text-start shadow-sm">
            <div className="border-border-color mb-8 flex items-center gap-3 border-b pb-4">
              <MapPin className="h-4 w-4 opacity-30" />
              <h3 className="text-start text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                عنوان التوصيل
              </h3>
            </div>
            <div className="flex flex-col gap-6 text-start">
              <div>
                <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                  المحافظة
                </p>
                <p className="text-start text-sm font-medium">{order.governorate}</p>
              </div>
              <div>
                <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                  العنوان
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
                  ملاحظات العميل
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
                      الكمية: {item.quantity}
                    </p>
                    {(item.selected_size || item.selected_color) && (
                      <p className="text-start text-[9px] opacity-60">
                        {item.selected_size && (
                          <span className="text-brand-accent font-bold">{item.selected_size}</span>
                        )}
                        {item.selected_size && item.selected_color && ' · '}
                        {item.selected_color && <span>{item.selected_color}</span>}
                      </p>
                    )}
                  </div>
                  <p className="text-xs font-bold whitespace-nowrap">
                    {item.price_at_purchase * item.quantity} EGP
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                إجمالي الطلب
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
              {t('colStatus')}
            </p>
            <PrintWaybillButton label={t('printWaybill')} />
          </div>
        </div>
      </div>
    </div>
  );
}
