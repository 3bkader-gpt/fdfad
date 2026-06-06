'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/supabase';
import { useNotifications } from '@/providers/NotificationProvider';

export function useRealtimeOrders(initialOrders: Order[]) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { showOrderNotification } = useNotifications();

  useEffect(() => {
    console.log('Initializing Supabase Realtime channel subscription...');
    const channel = supabase
      .channel('public-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Realtime postgres_change event received:', payload);
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            setOrders((current) => {
              if (current.some((o) => o.id === newOrder.id)) return current;
              return [newOrder, ...current];
            });
            showOrderNotification(newOrder);
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            setOrders((current) =>
              current.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setOrders((current) => current.filter((o) => o.id !== deletedId));
          }
        },
      )
      .subscribe((status) => {
        console.log(`Supabase Realtime subscription status: ${status}`);
      });

    return () => {
      console.log('Unsubscribing from Supabase Realtime channel...');
      supabase.removeChannel(channel);
    };
  }, [showOrderNotification]);

  return { orders, setOrders };
}
