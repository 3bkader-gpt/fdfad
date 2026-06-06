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
  const tc = await getTranslations('Common');

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
    <>
      {/* Screen View */}
      <div className="text-text-primary flex flex-col gap-10 pb-20 transition-colors duration-300 print:hidden">
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
              {t('placedOn')}{' '}
              {new Date(order.created_at).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
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
                  {t('customerCredentials')}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-8 text-start sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                    {t('colCustomer')}
                  </p>
                  <p className="text-start text-sm font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                    {t('customerPhone')}
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
                      {t('whatsApp')}
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
                  {t('deliveryAddress')}
                </h3>
              </div>
              <div className="flex flex-col gap-6 text-start">
                <div>
                  <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                    {t('governorate')}
                  </p>
                  <p className="text-start text-sm font-medium">{order.governorate}</p>
                </div>
                <div>
                  <p className="mb-1 text-start text-[9px] font-bold tracking-widest uppercase opacity-30">
                    {t('address')}
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
                    {t('clientNotes')}
                  </h3>
                </div>
                <p className="text-start text-sm leading-relaxed italic opacity-70">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column: Order Items & Payment */}
          <div className="flex flex-col gap-8 text-start">
            <div className="bg-brand-primary shadow-brand-primary/10 rounded-2xl p-8 text-start text-white dark:text-bg-main shadow-xl">
              <div className="mb-8 flex items-center gap-3 border-b border-white/10 dark:border-bg-main/15 pb-4 text-start">
                <ShoppingBag className="h-4 w-4 opacity-40" />
                <h3 className="text-start text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                  {t('curationManifest')}
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
                        {t('quantity', { qty: item.quantity })}
                      </p>
                      {(item.selected_size || item.selected_color) && (
                        <p className="text-start text-[9px] opacity-60">
                          {item.selected_size && (
                            <span className="text-brand-accent dark:text-[#4A7C59] font-bold">{item.selected_size}</span>
                          )}
                          {item.selected_size && item.selected_color && ' · '}
                          {item.selected_color && <span>{item.selected_color}</span>}
                        </p>
                      )}
                    </div>
                    <p className="text-xs font-bold whitespace-nowrap">
                      {item.price_at_purchase * item.quantity} {tc('egp')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-white/10 dark:border-bg-main/15 pt-6">
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                  {t('orderTotal')}
                </span>
                <span className="text-2xl font-bold tracking-tight">
                  {order.total_amount} {tc('egp')}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-white/5 dark:bg-bg-main/10 py-2 text-[9px] font-bold tracking-widest uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4A7C59]" />
                {t('cashOnDelivery')}
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

      {/* Print View (Waybill / Invoice) */}
      <div
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={`hidden print:block print-only-container text-black bg-white antialiased text-[11px] leading-normal w-full max-w-[800px] mx-auto p-4 ${
          locale === 'ar' ? 'font-cairo' : 'font-sans'
        }`}
      >
        {/* Header Section */}
        <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-start">
          <div className="text-start">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-black mb-1">فضفاض | FADFAAD</h1>
            <p className="text-[9px] uppercase tracking-widest opacity-60">
              {locale === 'ar' ? 'بوليسة شحن / فاتورة' : 'WAYBILL / PACKING SLIP'}
            </p>
          </div>
          <div className="text-end">
            <div className="border border-black px-3 py-1 font-bold text-sm inline-block rounded mb-1">
              {order.order_no}
            </div>
            <p className="text-[9px] opacity-60">
              {t('placedOn')}:{' '}
              {new Date(order.created_at).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
            </p>
          </div>
        </div>

        {/* Shipping Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 border-b border-black/10 pb-4">
          {/* Customer Credentials Column */}
          <div className="border-r border-black/10 pr-4 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-4 text-start">
            <h3 className="font-bold text-[9px] uppercase tracking-wider opacity-60 mb-2 border-b pb-1 text-start">
              {t('customerCredentials')}
            </h3>
            <div className="space-y-1.5 text-start">
              <div>
                <span className="opacity-50 text-[9px] block uppercase text-start">{t('colCustomer')}</span>
                <span className="font-bold text-xs text-start">{order.customer_name}</span>
              </div>
              <div>
                <span className="opacity-50 text-[9px] block uppercase text-start">{t('customerPhone')}</span>
                <span className="font-bold text-xs text-start">{order.phone_number}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Column */}
          <div className="text-start">
            <h3 className="font-bold text-[9px] uppercase tracking-wider opacity-60 mb-2 border-b pb-1 text-start">
              {t('deliveryAddress')}
            </h3>
            <div className="space-y-1.5 text-start">
              <div>
                <span className="opacity-50 text-[9px] block uppercase text-start">{t('governorate')}</span>
                <span className="font-bold text-xs text-start">{order.governorate}</span>
              </div>
              <div>
                <span className="opacity-50 text-[9px] block uppercase text-start">{t('address')}</span>
                <span className="font-medium text-xs block leading-tight text-start">{order.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes (Only printed if present) */}
        {order.notes && (
          <div className="mb-6 bg-black/5 border border-black/10 rounded p-3 text-start">
            <h4 className="font-bold text-[9px] uppercase tracking-wider opacity-60 mb-1 text-start">
              {t('clientNotes')}
            </h4>
            <p className="italic text-xs leading-relaxed text-start">{order.notes}</p>
          </div>
        )}

        {/* Curation Manifest (Products Table) */}
        <div className="mb-6 text-start">
          <h3 className="font-bold text-[9px] uppercase tracking-wider opacity-60 mb-2 border-b pb-1 text-start">
            {t('curationManifest')}
          </h3>
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-black text-[9px] opacity-60 uppercase font-bold text-start">
                <th className="py-1.5 text-start font-bold">{locale === 'ar' ? 'المنتج' : 'Item'}</th>
                <th className="py-1.5 text-center font-bold">{locale === 'ar' ? 'المقاس' : 'Size'}</th>
                <th className="py-1.5 text-center font-bold">{locale === 'ar' ? 'اللون' : 'Color'}</th>
                <th className="py-1.5 text-center font-bold">{locale === 'ar' ? 'الكمية' : 'Qty'}</th>
                <th className="py-1.5 text-end font-bold">{locale === 'ar' ? 'السعر' : 'Price'}</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id} className="border-b border-black/5 text-xs">
                  <td className="py-2 text-start font-medium align-middle">
                    {item.products?.title || 'Unknown Product'}
                  </td>
                  <td className="py-2 text-center align-middle font-bold">
                    {item.selected_size || '-'}
                  </td>
                  <td className="py-2 text-center align-middle">
                    {item.selected_color || '-'}
                  </td>
                  <td className="py-2 text-center align-middle">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-end align-middle font-bold">
                    {item.price_at_purchase * item.quantity} {tc('egp')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-between items-center border-t-2 border-black pt-4 mt-4">
          <div className="bg-black text-white px-3 py-1.5 rounded font-bold uppercase tracking-widest text-[9px] inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4A7C59]" />
            {t('cashOnDelivery')}
          </div>
          <div className="text-end">
            <span className="text-[9px] font-bold tracking-wider uppercase opacity-60 block">
              {t('orderTotal')}
            </span>
            <span className="text-xl font-bold tracking-tight text-black">
              {order.total_amount} {tc('egp')}
            </span>
          </div>
        </div>

        {/* Footer Brand Statement */}
        <div className="border-t border-black/10 pt-6 mt-12 text-center text-[9px] opacity-40 uppercase tracking-widest">
          <p className="mb-1">
            {locale === 'ar' ? 'فضفاض القاهرة - صنع في مصر' : 'FADFAAD CAIRO - MADE IN EGYPT'}
          </p>
          <p>hello@fadfaad.com | @fadfaad.cairo</p>
        </div>
      </div>
    </>
  );
}
