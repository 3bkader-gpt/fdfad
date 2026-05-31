import { createClient } from '@/lib/supabase/server';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  const products = (data as unknown as Product[]) || [];

  return (
    <div className="flex flex-col gap-10 text-left">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-[#2C3E35]">Products</h2>
          <p className="mt-2 text-[10px] font-bold tracking-widest text-[#2C3E35]/60 uppercase">
            Manage your curated collection
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-[#2C3E35] px-6 py-2.5 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-[#1E2B25] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col rounded-2xl border border-[#2C3E35]/5 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#FAFAFA]">
              {product.product_images?.[0] ? (
                <Image
                  src={product.product_images[0].url}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] tracking-widest uppercase italic opacity-20">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 text-left">
                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-bold tracking-tighter uppercase ${product.is_active ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'}`}
                >
                  {product.is_active ? 'Active' : 'Archived'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-left">
              <h3 className="line-clamp-1 text-sm font-medium tracking-tight uppercase">
                {product.title}
              </h3>
              <p className="text-lg font-bold text-[#C89B7E]">{product.price} EGP</p>
              <div className="mt-2 flex items-center gap-2 text-left">
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-30">
                  {product.fabric_type}
                </span>
                <span className="h-1 w-1 rounded-full bg-black/10" />
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-30">
                  OPAC {product.opacity_scale}/5
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-[#2C3E35]/5 pt-4 text-left">
              <Link
                href={`/admin/products/${product.id}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FAFAFA] py-2 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-colors hover:bg-[#F0F0F0]"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Link>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-24 text-center italic opacity-30">
            The collection is currently empty.
          </div>
        )}
      </div>
    </div>
  );
}
