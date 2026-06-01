import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '../ProductForm';

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return (
    <div className="flex flex-col gap-10">
      <ProductForm categories={categories || []} />
    </div>
  );
}
