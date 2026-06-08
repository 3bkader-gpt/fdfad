'use client';

import { useState, useRef, useEffect } from 'react';
import { updateOrderStatus } from '../actions';
import { Check, Loader2, ChevronRight } from 'lucide-react';
import { OrderStatus } from '@/types/supabase';
import { useTranslations } from 'next-intl';

const STATUSES: OrderStatus[] = [
  'NEW',
  'CONFIRMED',
  'PREPARING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const statusStyles: Record<OrderStatus, string> = {
  NEW: 'bg-status-new-bg text-status-new-text ring-1 ring-inset ring-black/10',
  CONFIRMED: 'bg-status-confirmed-bg text-status-confirmed-text ring-1 ring-inset ring-black/10',
  PREPARING: 'bg-status-preparing-bg text-status-preparing-text ring-1 ring-inset ring-black/10',
  SHIPPED: 'bg-status-shipped-bg text-status-shipped-text ring-1 ring-inset ring-black/10',
  DELIVERED: 'bg-status-delivered-bg text-status-delivered-text ring-1 ring-inset ring-black/10',
  CANCELLED: 'bg-status-cancelled-bg text-status-cancelled-text ring-1 ring-inset ring-black/10',
};

export function StatusPill({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Admin.status');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = async (newStatus: OrderStatus) => {
    if (newStatus === status) {
      setIsOpen(false);
      return;
    }
    setIsUpdating(true);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setStatus(newStatus);
    } else {
      console.error(result.error);
    }
    setIsUpdating(false);
    setIsOpen(false);
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      // Remove onMouseEnter/onMouseLeave to prevent jitter on touch devices.
      // Click toggle is more robust for a hybrid experience.
    >
      <button
        onClick={toggleOpen}
        disabled={isUpdating}
        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-5 py-1.5 text-[10px] font-bold ring-1 transition-all ring-inset active:scale-95 ${
          statusStyles[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10'
        }`}
      >
        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : t(status)}
        <ChevronRight
          className={`h-3 w-3 opacity-40 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 bg-bg-elevated border-border-color absolute top-full left-0 z-[100] mt-1 w-40 origin-top-left rounded-xl border p-1.5 text-left shadow-2xl duration-200">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              className={`hover:bg-bg-main flex min-h-[44px] w-full items-center justify-between rounded-lg px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-colors ${
                s === status ? 'text-brand-accent' : 'text-text-primary/60'
              }`}
            >
              {t(s)}
              {s === status && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
