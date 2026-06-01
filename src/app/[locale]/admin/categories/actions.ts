'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export async function upsertCategory(formData: FormData, id?: string) {
  const supabase = await createClient();

  const name_ar = formData.get('name_ar') as string;
  const name_en = formData.get('name_en') as string;
  const description_ar = formData.get('description_ar') as string;
  const description_en = formData.get('description_en') as string;

  const slug = name_en
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  const categoryData: CategoryInsert = {
    name: name_ar,
    name_ar,
    name_en,
    slug,
    description: description_ar || null,
    description_ar: description_ar || null,
    description_en: description_en || null,
    is_active: formData.get('is_active') === 'true',
  };

  if (id) {
    const { error } = await (
      supabase.from('categories') as unknown as {
        update: (v: CategoryUpdate) => {
          eq: (k: string, v: string) => Promise<{ error: { message: string } | null }>;
        };
      }
    )
      .update(categoryData as CategoryUpdate)
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await (
      supabase.from('categories') as unknown as {
        insert: (v: CategoryInsert) => Promise<{ error: { message: string } | null }>;
      }
    ).insert(categoryData);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
}

export async function archiveCategory(id: string) {
  const supabase = await createClient();
  // We use an archive strategy (is_active = false) instead of hard deletion to preserve history.
  const { error } = await (
    supabase.from('categories') as unknown as {
      update: (v: { is_active: boolean }) => {
        eq: (k: string, v: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
}
