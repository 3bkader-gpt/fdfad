import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { Product } from '@/types/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminProductsClient } from './AdminProductsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await getTranslations('Admin');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  const products = (data as Product[]) || [];

  return <AdminProductsClient products={products} locale={locale} />;
}

