'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ImageInsert = Database['public']['Tables']['product_images']['Insert'];

export async function upsertProduct(formData: FormData, id?: string) {
  const supabase = await createClient();

  const productData: ProductInsert = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    opacity_scale: formData.get('opacity_scale') ? parseInt(formData.get('opacity_scale') as string) : null,
    fabric_type: (formData.get('fabric_type') as string) || null,
    made_in_egypt: formData.get('made_in_egypt') === 'true',
    is_active: formData.get('is_active') === 'true',
    sizes: JSON.parse((formData.get('sizes') as string) || '[]'),
    colors: JSON.parse((formData.get('colors') as string) || '[]'),
    garment_length_cm: formData.get('garment_length_cm')
      ? parseInt(formData.get('garment_length_cm') as string)
      : null,
    season: (formData.get('season') as string) || null,
    care_instructions: (formData.get('care_instructions') as string) || null,
    model_height_cm: formData.get('model_height_cm')
      ? parseInt(formData.get('model_height_cm') as string)
      : null,
    model_weight_kg: formData.get('model_weight_kg')
      ? parseInt(formData.get('model_weight_kg') as string)
      : null,
    model_size_worn: (formData.get('model_size_worn') as string) || null,
    size_recommendations: JSON.parse((formData.get('size_recommendations') as string) || '[]'),
  };

  const categoryId = formData.get('category_id') as string;

  let productId = id;

  if (id) {
    const { error } = await (
      supabase.from('products') as unknown as {
        update: (v: ProductUpdate) => {
          eq: (k: string, v: string) => Promise<{ error: { message: string } | null }>;
        };
      }
    )
      .update(productData as ProductUpdate)
      .eq('id', id);

    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await (
      supabase.from('products') as unknown as {
        insert: (v: ProductInsert) => {
          select: () => {
            single: () => Promise<{
              data: { id: string } | null;
              error: { message: string } | null;
            }>;
          };
        };
      }
    )
      .insert(productData)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create product.');
    productId = data.id;
  }

  // Handle Category Assignment
  if (productId && categoryId) {
    await (
      supabase.from('product_categories') as unknown as {
        delete: () => {
          eq: (k: string, v: string) => Promise<{ error: { message: string } | null }>;
        };
      }
    )
      .delete()
      .eq('product_id', productId);

    await (
      supabase.from('product_categories') as unknown as {
        insert: (v: {
          product_id: string;
          category_id: string;
        }) => Promise<{ error: { message: string } | null }>;
      }
    ).insert({
      product_id: productId,
      category_id: categoryId,
    });
  }

  // Handle Multiple Images
  const imagesJson = formData.get('images') as string;
  if (imagesJson && productId) {
    const imagesList = JSON.parse(imagesJson) as { url: string; is_cover: boolean }[];
    const imagesTable = supabase.from('product_images') as unknown as {
      delete: () => {
        eq: (k: string, v: string) => Promise<{ error: { message: string } | null }>;
      };
      insert: (v: ImageInsert[]) => Promise<{ error: { message: string } | null }>;
    };

    await imagesTable.delete().eq('product_id', productId);

    if (imagesList.length > 0) {
      const inserts: ImageInsert[] = imagesList.map((img, index) => ({
        product_id: productId!,
        url: img.url,
        is_cover: img.is_cover,
        display_order: index,
      }));

      const { error: imagesInsertError } = await imagesTable.insert(inserts);
      if (imagesInsertError) throw new Error(imagesInsertError.message);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  // 1. Find associated images for cleanup
  const { data: images } = (await supabase
    .from('product_images')
    .select('url')
    .eq('product_id', id)) as unknown as { data: { url: string }[] | null };

  // 2. Storage cleanup
  if (images && images.length > 0) {
    const paths = images
      .map((img) => {
        try {
          const url = new URL(img.url);
          const parts = url.pathname.split('/');
          const bucketIndex = parts.indexOf('product-images');
          if (bucketIndex !== -1) {
            return parts.slice(bucketIndex + 1).join('/');
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter((p): p is string => !!p);

    if (paths.length > 0) {
      await supabase.storage.from('product-images').remove(paths);
    }
  }

  // 3. Delete database record
  const { error } = await (
    supabase.from('products') as unknown as {
      delete: () => {
        eq: (k: string, v: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/products');
}
