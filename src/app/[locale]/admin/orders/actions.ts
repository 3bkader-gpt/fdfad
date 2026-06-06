'use server';

import { createClient } from '@/lib/supabase/server';
import { Database, OrderStatus } from '@/types/supabase';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';

const statusSchema = z.enum(['NEW', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase: SupabaseClient<Database> = await createClient();

  const validation = statusSchema.safeParse(status);
  if (!validation.success) {
    return { success: false, error: 'Invalid order status' };
  }

  const { error } = await supabase
    .schema('public')
    .from('orders')
    .update({ status } as Database['public']['Tables']['orders']['Update'])
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function deleteOrder(orderId: string) {
  const supabase: SupabaseClient<Database> = await createClient();

  const { error } = await supabase.schema('public').from('orders').delete().eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
