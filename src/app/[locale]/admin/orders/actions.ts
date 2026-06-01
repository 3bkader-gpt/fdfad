'use server';

import { createClient } from '@/lib/supabase/server';
import { OrderStatus } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

  // Using a double assertion to bypass SSR inference limitations for the polymorphic 'from' method.
  // This is required to satisfy strict type checks in Server Actions where the deep inference for
  // PostgREST tables often resolves to 'never' due to recursive recursion limits.
  const { error } = await (
    supabase.from('orders') as unknown as {
      update: (v: Record<string, string>) => {
        eq: (k: string, v: string) => Promise<{ error: { message: string } | null }>;
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
