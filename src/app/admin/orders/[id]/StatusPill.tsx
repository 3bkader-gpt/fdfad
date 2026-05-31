'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../actions';
import { Check, Loader2, ChevronRight } from 'lucide-react';

const STATUSES = ['NEW', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  CONFIRMED: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  PREPARING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  SHIPPED: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  DELIVERED: 'bg-green-50 text-green-700 ring-green-600/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20',
};

export function StatusPill({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    setIsUpdating(true);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert(result.error);
    }
    setIsUpdating(false);
  };

  return (
    <div className="relative group inline-block">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ring-inset ${
          STATUS_COLORS[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10'
        }`}
      >
        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : status}
        <ChevronRight className="h-3 w-3 opacity-40 transition-transform group-hover:rotate-90" />
      </div>

      <div className="absolute left-0 top-full z-[100] mt-1 hidden w-32 origin-top-left animate-in fade-in slide-in-from-top-1 rounded-xl bg-white p-1 shadow-2xl ring-1 ring-black/5 duration-200 group-hover:block">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleUpdate(s)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-[#FAFAFA] ${
              s === status ? 'text-[#C89B7E]' : 'text-[#2C3E35]/60'
            }`}
          >
            {s}
            {s === status && <Check className="h-3 w-3" />}
          </button>
        ))}
      </div>
    </div>
  );
}
