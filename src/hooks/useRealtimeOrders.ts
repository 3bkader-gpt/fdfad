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
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
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
      .subscribe();

    // Polling fallback: check for new/deleted orders every 10 seconds
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Realtime polling fallback error:', error);
          return;
        }

        if (data) {
          setOrders((current) => {
            // Find new orders that we don't have in current state
            const newOrders = (data as Order[]).filter(
              (o) => !current.some((existing) => existing.id === o.id),
            );

            // If we have existing orders and found new ones, trigger notifications
            if (current.length > 0 && newOrders.length > 0) {
              newOrders.forEach((o) => {
                showOrderNotification(o);
              });
            }

            return data as Order[];
          });
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [showOrderNotification]);

  return { orders, setOrders };
}
