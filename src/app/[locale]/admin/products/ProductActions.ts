'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';

const productSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z
    .string()
    .min(3, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be URL-friendly (a-z, 0-9, -)'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  opacity_scale: z.number().min(1).max(5).nullable(),
  fabric_type: z.string().nullable(),
  made_in_egypt: z.boolean(),
  is_active: z.boolean(),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  garment_length_cm: z.number().nullable(),
  season: z.string().nullable(),
  care_instructions: z.string().nullable(),
  model_height_cm: z.number().nullable(),
  model_weight_kg: z.number().nullable(),
  model_size_worn: z.string().nullable(),
  size_recommendations: z
    .array(
      z.object({
        size: z.string(),
        weight_range: z.string(),
      }),
    )
    .default([]),
});

export async function upsertProduct(formData: FormData, id?: string) {
  const supabase: SupabaseClient<Database> = await createClient();

  // 1. Parse and Validate
  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    opacity_scale: formData.get('opacity_scale')
      ? parseInt(formData.get('opacity_scale') as string)
      : null,
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

  const validation = productSchema.safeParse(rawData);
  if (!validation.success) {
    throw new Error(validation.error.issues.map((e) => e.message).join(', '));
  }

  const productData = validation.data;
  const categoryId = formData.get('category_id') as string;

  let productId = id;

  if (id) {
    const { error } = await supabase
      .schema('public')
      .from('products')
      .update(productData as Database['public']['Tables']['products']['Update'])
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .schema('public')
      .from('products')
      .insert(productData as Database['public']['Tables']['products']['Insert'])
      .select('id')
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create product.');
    productId = (data as { id: string }).id;
  }

  // Handle Category Assignment
  if (productId && categoryId) {
    // Delete existing mappings for this product
    await supabase.schema('public').from('product_categories').delete().eq('product_id', productId);

    // Insert new mapping
    const { error: catError } = await supabase
      .schema('public')
      .from('product_categories')
      .insert({
        product_id: productId,
        category_id: categoryId,
      } as Database['public']['Tables']['product_categories']['Insert']);
    if (catError) throw new Error(catError.message);
  }

  // Handle Multiple Images
  const imagesJson = formData.get('images') as string;
  if (imagesJson && productId) {
    const imagesList = JSON.parse(imagesJson) as { url: string; is_cover: boolean }[];

    // Cleanup existing images record (Actual files cleanup is handled separately if needed, but here we sync the list)
    await supabase.schema('public').from('product_images').delete().eq('product_id', productId);

    if (imagesList.length > 0) {
      const inserts = imagesList.map((img, index) => ({
        product_id: productId!,
        url: img.url,
        is_cover: img.is_cover,
        display_order: index,
      }));

      const { error: imagesInsertError } = await supabase
        .schema('public')
        .from('product_images')
        .insert(inserts as Database['public']['Tables']['product_images']['Insert'][]);
      if (imagesInsertError) throw new Error(imagesInsertError.message);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase: SupabaseClient<Database> = await createClient();

  // 1. Find associated images for cleanup
  const { data: images } = await supabase
    .schema('public')
    .from('product_images')
    .select('url')
    .eq('product_id', id);

  // 2. Storage cleanup
  if (images && images.length > 0) {
    const paths = (images as { url: string }[])
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
  const { error } = await supabase.schema('public').from('products').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/products');
}
