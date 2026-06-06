'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';

const orderSchema = z.object({
  customer_name: z.string().min(3, 'Name is required'),
  phone_number: z.string().regex(/^01[0125][0-9]{8}$/, 'Invalid phone number'),
  governorate: z.string().min(1, 'Governorate is required'),
  address: z.string().min(10, 'Address is required'),
  notes: z.string().optional().nullable(),
  total_amount: z.number().min(0),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().min(1),
        price_at_purchase: z.number().min(0),
        selected_size: z.string().optional().nullable(),
        selected_color: z.string().optional().nullable(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export async function createOrder(orderData: z.infer<typeof orderSchema>) {
  const supabase: SupabaseClient<Database> = await createClient();

  // 0. Initial Validation
  const validation = orderSchema.safeParse(orderData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((e) => e.message).join(', '),
    };
  }

  // 1. Validate items against DB
  const productIds = orderData.items.map((item) => item.product_id);
  const { data: dbProducts, error: productError } = await supabase
    .schema('public')
    .from('products')
    .select('id, price, is_active')
    .in('id', productIds);

  if (productError || !dbProducts) {
    return { success: false, error: 'Failed to validate products.' };
  }

  let validatedTotal = 0;
  for (const item of orderData.items) {
    // We cast dbProducts to a specific subset of the Row type because the selected fields are known
    const dbProduct = (dbProducts as { id: string; price: number; is_active: boolean }[]).find(
      (p) => p.id === item.product_id,
    );

    if (!dbProduct || !dbProduct.is_active) {
      return { success: false, error: `Product is currently unavailable.` };
    }

    if (Number(dbProduct.price) !== item.price_at_purchase) {
      return { success: false, error: 'Price mismatch detected. Please refresh your cart.' };
    }

    validatedTotal += Number(dbProduct.price) * item.quantity;
  }

  if (Math.abs(validatedTotal - orderData.total_amount) > 0.01) {
    return { success: false, error: 'Total amount mismatch.' };
  }

  // 2. Insert Order via RPC
  const { data, error: orderError } = await supabase.schema('public').rpc('create_order_rpc', {
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

  // RPC returns an object, but we need to cast it correctly based on our knowledge of the DB
  const order = data as { id: string; order_no: string };

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

  const { error: itemsError } = await supabase
    .schema('public')
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    return { success: false, error: 'Order created but items failed to save.' };
  }

  revalidatePath('/admin');
  return { success: true, orderNo: order.order_no, id: order.id };
}
