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
  items: {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    selected_size?: string | null;
    selected_color?: string | null;
  }[];
}) {
  const supabase = await createClient();

  // 1. Validate items against DB
  const productIds = orderData.items.map((item) => item.product_id);
  const { data: products, error: productError } = (await supabase
    .from('products')
    .select('id, price, is_active')
    .in('id', productIds)) as {
    data: { id: string; price: number; is_active: boolean }[] | null;
    error: unknown;
  };

  if (productError || !products) {
    return { success: false, error: 'Failed to validate products.' };
  }

  let validatedTotal = 0;
  for (const item of orderData.items) {
    const dbProduct = products.find((p) => p.id === item.product_id);

    if (!dbProduct || !dbProduct.is_active) {
      return { success: false, error: `Product ${item.product_id} is unavailable.` };
    }

    if (Number(dbProduct.price) !== item.price_at_purchase) {
      return { success: false, error: 'Price mismatch detected.' };
    }

    validatedTotal += Number(dbProduct.price) * item.quantity;
  }

  if (Math.abs(validatedTotal - orderData.total_amount) > 0.01) {
    return { success: false, error: 'Total amount mismatch.' };
  }

  // 2. Insert Order via RPC
  const { data, error: orderError } = await (
    supabase as unknown as {
      rpc: (
        name: string,
        args: Record<string, string | number | boolean | null>,
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

  // 3. Insert Order Items
  const orderItems: Database['public']['Tables']['order_items']['Insert'][] = orderData.items.map(
    (item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
      selected_size: item.selected_size || null,
      selected_color: item.selected_color || null,
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
  return { success: true, orderNo: order.order_no, id: order.id };
}
