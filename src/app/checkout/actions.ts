'use server';

import { createClient } from '@/lib/supabase/server';
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

  // 1. Insert Order
  const { data: order, error: orderError } = await (supabase as any)
    .from('orders')
    .insert({
      customer_name: orderData.customer_name,
      phone_number: orderData.phone_number,
      governorate: orderData.governorate,
      address: orderData.address,
      notes: orderData.notes || null,
      total_amount: orderData.total_amount,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message || 'Failed to create order.' };
  }

  // 2. Insert Order Items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_purchase: item.price_at_purchase,
  }));

  const { error: itemsError } = await (supabase as any).from('order_items').insert(orderItems);

  if (itemsError) {
    return { success: false, error: 'Order created but items failed to save.' };
  }

  revalidatePath('/admin');
  return { success: true, orderNo: order.order_no };
}
