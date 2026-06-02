import { createClient } from '@/lib/supabase/server';
import { Order } from '@/types/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminOrdersClient } from './AdminOrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  await getTranslations('Admin');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-text-primary p-6">Error loading orders: {error.message}</div>;
  }

  const orders = (data as Order[]) || [];

  return <AdminOrdersClient orders={orders} locale={locale} />;
}
