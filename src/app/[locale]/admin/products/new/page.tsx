import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '../ProductForm';
import { setRequestLocale } from 'next-intl/server';

export default async function NewProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: categories } = await supabase
    .schema('public')
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return (
    <div className="text-text-primary flex flex-col gap-10">
      <ProductForm categories={categories || []} />
    </div>
  );
}
