'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upsertProduct(formData: FormData, id?: string) {
  const supabase = await createClient();

  const productData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    opacity_scale: parseInt(formData.get('opacity_scale') as string),
    fabric_type: formData.get('fabric_type') as string,
    made_in_egypt: formData.get('made_in_egypt') === 'true',
    is_active: formData.get('is_active') === 'true',
    category: 'abaya', // MVP Default
  };

  let productId = id;

  if (id) {
    const { error } = await (supabase as any).from('products').update(productData).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await (supabase as any)
      .from('products')
      .insert(productData)
      .select()
      .single();
    if (error) throw new Error(error.message);
    productId = data.id;
  }

  // Handle Image URL (Simplification for MVP, assuming single URL for now)
  const imageUrl = formData.get('image_url') as string;
  if (imageUrl) {
    // Delete existing to keep it simple for MVP single image
    await (supabase as any).from('product_images').delete().eq('product_id', productId);
    await (supabase as any).from('product_images').insert({
      product_id: productId,
      url: imageUrl,
      display_order: 0,
    });
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await (supabase as any).from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/products');
}
