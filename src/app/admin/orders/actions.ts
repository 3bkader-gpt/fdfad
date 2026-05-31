'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { error } = await (supabase as any).from('orders').update({ status }).eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
