import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductForm } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await (supabase as any)
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10">
      <ProductForm initialData={product} />
    </div>
  );
}
