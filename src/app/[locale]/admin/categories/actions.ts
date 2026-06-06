'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';

const categorySchema = z.object({
  name_ar: z.string().min(2, 'Name (Arabic) is required'),
  name_en: z.string().min(2, 'Name (English) is required'),
  description_ar: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  is_active: z.boolean(),
});

export async function upsertCategory(formData: FormData, id?: string) {
  const supabase: SupabaseClient<Database> = await createClient();

  const name_ar = formData.get('name_ar') as string;
  const name_en = formData.get('name_en') as string;
  const description_ar = (formData.get('description_ar') as string) || null;
  const description_en = (formData.get('description_en') as string) || null;
  const is_active = formData.get('is_active') === 'true';

  const validation = categorySchema.safeParse({
    name_ar,
    name_en,
    description_ar,
    description_en,
    is_active,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues.map((e) => e.message).join(', '));
  }

  const slug = name_en
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  const categoryData: Database['public']['Tables']['categories']['Insert'] = {
    name: name_ar,
    name_ar,
    name_en,
    slug,
    description: description_ar || null,
    description_ar: description_ar || null,
    description_en: description_en || null,
    is_active,
  };

  if (id) {
    const { error } = await supabase
      .schema('public')
      .from('categories')
      .update(categoryData as Database['public']['Tables']['categories']['Update'])
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .schema('public')
      .from('categories')
      .insert(categoryData as Database['public']['Tables']['categories']['Insert']);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
}

export async function archiveCategory(id: string) {
  const supabase: SupabaseClient<Database> = await createClient();
  // We use an archive strategy (is_active = false) instead of hard deletion to preserve history.
  const { error } = await supabase
    .schema('public')
    .from('categories')
    .update({ is_active: false } as Database['public']['Tables']['categories']['Update'])
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
}

export async function deleteCategory(id: string) {
  const supabase: SupabaseClient<Database> = await createClient();
  const { error } = await supabase.schema('public').from('categories').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
}
