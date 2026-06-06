import { createClient } from '@/lib/supabase/server';
import { Order } from '@/types/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminDashboardClient } from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Admin');
  const tc = await getTranslations('Common');

  const supabase = await createClient();

  // Fetch metrics and recent orders
  const { data, error } = await supabase
    .schema('public')
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-text-primary">Error loading orders: {error.message}</div>;
  }

  const initialOrders = (data as Order[]) || [];

  const translations = {
    overview: t('overview'),
    overviewSub: t('overviewSub'),
    metricTotal: t('metricTotal'),
    metricNew: t('metricNew'),
    metricConfirmed: t('metricConfirmed'),
    metricPreparing: t('metricPreparing'),
    metricShipped: t('metricShipped'),
    metricDelivered: t('metricDelivered'),
    metricCancelled: t('metricCancelled'),
    revenueWeek: t('revenueWeek'),
    deliveredOnly: t('deliveredOnly'),
    recentOrders: t('recentOrders'),
    viewAll: t('viewAll'),
    colOrder: t('colOrder'),
    colCustomer: t('colCustomer'),
    colLocation: t('colLocation'),
    colTotal: t('colTotal'),
    colStatus: t('colStatus'),
    noOrders: t('noOrders'),
    egp: tc('egp'),
  };

  return (
    <AdminDashboardClient
      initialOrders={initialOrders}
      locale={locale}
      translations={translations}
    />
  );
}
