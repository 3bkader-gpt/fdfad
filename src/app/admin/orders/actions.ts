'use server';

import { createClient } from '@/lib/supabase/server';
import { Database, Order } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(
  orderId: string,
  status: Database['public']['Tables']['orders']['Update']['status'],
) {
  const supabase = await createClient();

  const { error } = await (
    supabase.from('orders') as unknown as {
      update: (values: Database['public']['Tables']['orders']['Update']) => {
        eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ status })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
