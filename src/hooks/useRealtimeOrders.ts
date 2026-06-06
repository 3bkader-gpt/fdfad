'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/supabase';
import { useNotifications } from '@/providers/NotificationProvider';

export function useRealtimeOrders(initialOrders: Order[]) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { showOrderNotification } = useNotifications();

  useEffect(() => {
    const channel = supabase
      .channel('public-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((current) => {
            // Prevent duplicates
            if (current.some((o) => o.id === newOrder.id)) return current;
            return [newOrder, ...current];
          });
          showOrderNotification(newOrder);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrders((current) => current.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const deletedId = payload.old.id;
          setOrders((current) => current.filter((o) => o.id !== deletedId));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showOrderNotification]);

  return { orders, setOrders };
}
