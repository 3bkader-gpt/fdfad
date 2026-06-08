'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { ProductImageItem } from '@/types/product';

/**
 * Product Server Actions
 * Handles creation, updates, and deletion with robust validation and logging.
 */

export async function upsertProduct(formData: FormData, id?: string) {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    // 1. Parse Raw Data Safely
    const parseNumber = (key: string) => {
      const val = formData.get(key);
      if (!val || val === '') return null;
      const parsed = parseFloat(val as string);
      return isNaN(parsed) ? null : parsed;
    };

    const parseJson = (key: string, fallback: string = '[]') => {
      try {
        const val = formData.get(key) as string;
        return JSON.parse(val || fallback);
      } catch (e) {
        console.error(`[upsertProduct] JSON parse error for key "${key}":`, e);
        return JSON.parse(fallback);
      }
    };

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: parseNumber('price') ?? 0,
      opacity_scale: parseNumber('opacity_scale'),
      fabric_type: (formData.get('fabric_type') as string) || null,
      made_in_egypt: formData.get('made_in_egypt') === 'true',
      is_active: formData.get('is_active') === 'true',
      sizes: parseJson('sizes'),
      colors: parseJson('colors'),
      garment_length_cm: parseNumber('garment_length_cm'),
      season: (formData.get('season') as string) || null,
      care_instructions: (formData.get('care_instructions') as string) || null,
      model_height_cm: parseNumber('model_height_cm'),
      model_weight_kg: parseNumber('model_weight_kg'),
      model_size_worn: (formData.get('model_size_worn') as string) || null,
      size_recommendations: parseJson('size_recommendations'),
    };

    // 2. Validate
    const productSchemaInternal = z.object({
      title: z.string().min(3, 'Title is required'),
      slug: z
        .string()
        .min(3, 'Slug is required')
        .regex(
          /^[\w\u0600-\u06FF0-9-]+$/,
          'Slug must be URL-friendly (Arabic/English, numbers, hyphens allowed)',
        ),
      description: z.string().optional().nullable(),
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

    const validation = productSchemaInternal.safeParse(rawData);
    if (!validation.success) {
      const errorMsg = validation.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      console.warn('[upsertProduct] Validation failed:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    const productData = validation.data;
    const categoryId = formData.get('category_id') as string;

    let productId = id;

    // 3. Save Product
    if (id) {
      const { error } = await supabase
        .schema('public')
        .from('products')
        .update(productData as Database['public']['Tables']['products']['Update'])
        .eq('id', id);
      if (error) {
        console.error('[upsertProduct] Database update error:', error.message);
        throw new Error(`Database Update Error: ${error.message}`);
      }
    } else {
      const { data, error } = await supabase
        .schema('public')
        .from('products')
        .insert(productData as Database['public']['Tables']['products']['Insert'])
        .select('id')
        .single();

      if (error || !data) {
        console.error(
          '[upsertProduct] Database insert error:',
          error?.message || 'No data returned',
        );
        throw new Error(`Database Insert Error: ${error?.message || 'Failed to create product.'}`);
      }
      productId = (data as { id: string }).id;
    }

    // 4. Handle Category Assignment
    if (productId && categoryId) {
      await supabase
        .schema('public')
        .from('product_categories')
        .delete()
        .eq('product_id', productId);

      const { error: catError } = await supabase
        .schema('public')
        .from('product_categories')
        .insert({
          product_id: productId,
          category_id: categoryId,
        } as Database['public']['Tables']['product_categories']['Insert']);

      if (catError) {
        console.error('[upsertProduct] Category assignment error:', catError.message);
        // We don't throw here as the product is already saved, but we should log it
      }
    }

    // 5. Handle Multiple Images
    const imagesJson = formData.get('images') as string;
    if (imagesJson && productId) {
      const imagesList = parseJson('images');

      await supabase.schema('public').from('product_images').delete().eq('product_id', productId);

      if (Array.isArray(imagesList) && imagesList.length > 0) {
        const inserts = imagesList.map((img: ProductImageItem, index: number) => ({
          product_id: productId!,
          url: img.url,
          is_cover: !!img.is_cover,
          display_order: index,
        }));

        const { error: imagesInsertError } = await supabase
          .schema('public')
          .from('product_images')
          .insert(inserts as Database['public']['Tables']['product_images']['Insert'][]);

        if (imagesInsertError) {
          console.error('[upsertProduct] Image sync error:', imagesInsertError.message);
        }
      }
    }

    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/products', 'layout'); // Revalidate all product pages

    return { success: true, id: productId };
  } catch (e: unknown) {
    const error = e as Error;
    console.error('[upsertProduct] Fatal Error:', error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
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

    if (error) {
      console.error('[deleteProduct] Database error:', error.message);
      throw new Error(error.message);
    }

    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e: unknown) {
    const error = e as Error;
    console.error('[deleteProduct] Fatal Error:', error.message);
    return { success: false, error: error.message };
  }
}
