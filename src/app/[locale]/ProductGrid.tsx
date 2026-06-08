import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/types/supabase';
import { getTranslations } from 'next-intl/server';

export async function ProductGrid() {
  const supabase = await createClient();
  const tp = await getTranslations('Products');
  const tc = await getTranslations('Common');

  const { data: products, error } = await supabase
    .schema('public')
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-text-primary text-center font-serif text-lg text-red-500 italic">
          {tc('error')}
        </p>
      </div>
    );
  }

  return (
    <>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-16 text-start">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center opacity-40">
          <p className="text-text-primary text-center font-serif text-lg italic">{tp('empty')}</p>
        </div>
      )}
    </>
  );
}
