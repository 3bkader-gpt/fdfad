import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { WHATSAPP_URL } from '@/data/site';
import { notFound } from 'next/navigation';
import { OrderWithItems } from '@/types/supabase';
import { ClearCart } from '@/components/ui/ClearCart';

export default async function SuccessPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  if (!id) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single();

  const order = data
    ? (data as unknown as OrderWithItems)
    : {
        order_no: `FDF-PENDING`,
        customer_name: '',
        phone_number: '',
        governorate: '',
        address: '',
        total_amount: 0,
        order_items: [],
      };

  const t = await getTranslations('Checkout');
  const tc = await getTranslations('Common');

  const message = `📦 *طلب جديد من فضفاض* | #${order.order_no}
👤 *العميل:* ${order.customer_name}
📞 *الموبايل:* ${order.phone_number}
📍 *العنوان:* ${order.governorate}, ${order.address}

🛍️ *المنتجات:*
${order.order_items
  .map(
    (item) =>
      `${item.quantity}x ${item.products?.title || 'Unknown'} (${item.selected_color || '-'} - مقاس: ${item.selected_size || '-'}) = ${item.price_at_purchase * item.quantity} EGP`,
  )
  .join('\n')}

💰 *الإجمالي:* ${order.total_amount} EGP`;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C3E35]">
      <ClearCart />
      <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-12 text-center">
        <div className="animate-in zoom-in mb-8 rounded-full bg-green-50 p-6 duration-500">
          <CheckCircle2 className="h-16 w-12 text-[#4A7C59]" />
        </div>

        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-[#2C3E35]">
          {t('success')}
        </h1>
        <p className="mb-10 text-sm text-pretty opacity-60">
          رقم الطلب: {order.order_no}
          <br />
          تم استلام طلبك.
        </p>

        {/* Order Info */}
        <div className="mb-10 w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#2C3E35]/5 pb-4 text-left">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                {t('orderNo')}
              </span>
              <span className="font-mono text-sm font-bold text-[#C89B7E]">{order.order_no}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#2C3E35]/5 pb-4 text-left">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                Status
              </span>
              <span className="rounded bg-[#FAFAFA] px-2 py-1 text-[10px] font-bold uppercase">
                {t('processing')}
              </span>
            </div>
          </div>
        </div>

        {/* Social / Next Steps */}
        <div className="flex w-full flex-col gap-4">
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            اضغط لتأكيد الأوردر
          </a>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#2C3E35] py-5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all active:scale-95"
          >
            {tc('back')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <footer className="mt-16 opacity-30">
          <p className="text-[9px] font-bold tracking-widest uppercase">
            © 2026 {tc('title').toUpperCase()} CAIRO
          </p>
        </footer>
      </div>
    </main>
  );
}
