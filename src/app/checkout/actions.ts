'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

export async function createOrder(orderData: {
  customer_name: string;
  phone_number: string;
  governorate: string;
  address: string;
  notes?: string;
  total_amount: number;
  items: { product_id: string; quantity: number; price_at_purchase: number }[];
}) {
  const supabase = await createClient();

  // 1. Insert Order via RPC (Handles sequence and human-readable ID securely)
  const { data, error: orderError } = await (
    supabase as unknown as {
      rpc: (
        name: string,
        args: Record<string, unknown>,
      ) => Promise<{
        data: { id: string; order_no: string } | null;
        error: { message: string } | null;
      }>;
    }
  ).rpc('create_order_rpc', {
    p_customer_name: orderData.customer_name,
    p_phone_number: orderData.phone_number,
    p_governorate: orderData.governorate,
    p_address: orderData.address,
    p_notes: orderData.notes || null,
    p_total_amount: orderData.total_amount,
  });

  if (orderError || !data) {
    return { success: false, error: orderError?.message || 'Failed to create order.' };
  }

  const order = data;

  // 2. Insert Order Items
  const orderItems: Database['public']['Tables']['order_items']['Insert'][] = orderData.items.map(
    (item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }),
  );

  const { error: itemsError } = await (
    supabase.from('order_items') as unknown as {
      insert: (
        v: Database['public']['Tables']['order_items']['Insert'][],
      ) => Promise<{ error: { message: string } | null }>;
    }
  ).insert(orderItems);

  if (itemsError) {
    return { success: false, error: 'Order created but items failed to save.' };
  }

  revalidatePath('/admin');
  return { success: true, orderNo: order.order_no };
}
