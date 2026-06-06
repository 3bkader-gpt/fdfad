'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingCart, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Order } from '@/types/supabase';

interface OrderNotification {
  id: string;
  order: Order;
}

interface NotificationContextType {
  showOrderNotification: (order: Order) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

  const showOrderNotification = useCallback((order: Order) => {
    setNotifications((prev) => [...prev, { id: order.id + Date.now(), order }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showOrderNotification }}>
      {children}

      {/* Notification Container */}
      <div className="pointer-events-none fixed top-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-4">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="bg-bg-elevated border-brand-accent/20 pointer-events-auto relative overflow-hidden rounded-2xl border p-5 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-start gap-4">
                <div className="bg-brand-accent/10 text-brand-accent flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                  <ShoppingCart className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-brand-accent text-[10px] font-bold tracking-widest uppercase">
                      New Order Received
                    </p>
                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="hover:bg-bg-main -mt-1 -mr-1 rounded-full p-1 opacity-40 transition-colors hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="mt-1 font-serif text-lg font-bold tracking-tight">
                    {n.order.customer_name}
                  </h4>

                  <div className="mt-3 flex flex-col gap-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="tracking-tighter uppercase opacity-50">Order No:</span>
                      <span className="font-mono font-bold">{n.order.order_no}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tracking-tighter uppercase opacity-50">Total:</span>
                      <span className="font-bold">{n.order.total_amount} EGP</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-[9px] uppercase opacity-40">
                      {new Date(n.order.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <Link
                      href={`/admin/orders/${n.order.id}`}
                      onClick={() => dismissNotification(n.id)}
                      className="bg-brand-primary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Details</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Progress bar for auto-dismiss if needed, or just let user dismiss */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 10, ease: 'linear' }}
                onAnimationComplete={() => dismissNotification(n.id)}
                className="bg-brand-accent/30 absolute bottom-0 left-0 h-1"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
