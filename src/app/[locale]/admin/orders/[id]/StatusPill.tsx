'use client';

import { useState, useRef, useEffect } from 'react';
import { updateOrderStatus } from '../actions';
import { Check, Loader2, ChevronRight } from 'lucide-react';
import { OrderStatus } from '@/types/supabase';

const STATUSES: OrderStatus[] = [
  'NEW',
  'CONFIRMED',
  'PREPARING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  CONFIRMED: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  PREPARING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  SHIPPED: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  DELIVERED: 'bg-green-50 text-green-700 ring-green-600/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20',
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
      alert(result.error);
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
          STATUS_COLORS[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10'
        }`}
      >
        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : status}
        <ChevronRight
          className={`h-3 w-3 opacity-40 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-[100] mt-1 w-40 origin-top-left rounded-xl bg-white p-1.5 text-left shadow-2xl ring-1 ring-black/5 duration-200">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-colors hover:bg-[#FAFAFA] ${
                s === status ? 'text-[#C89B7E]' : 'text-[#2C3E35]/60'
              }`}
            >
              {s}
              {s === status && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
