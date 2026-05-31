import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductForm } from '../ProductForm';
import { Product } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  // Safe cast since we verified existence
  const product = data as unknown as Product;

  return (
    <div className="flex flex-col gap-10">
      <ProductForm initialData={product} />
    </div>
  );
}
