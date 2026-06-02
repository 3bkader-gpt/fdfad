'use client';

import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'error', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isError = type === 'error';

  return (
    <div
      className={`animate-slide-in-right fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 items-start gap-3 rounded-2xl px-5 py-4 shadow-2xl md:bottom-8 ${
        isError ? 'bg-red-600 text-white' : 'bg-[#4A7C59] text-white'
      }`}
      style={{ maxWidth: 'calc(100vw - 2rem)', minWidth: '280px' }}
      role="alert"
      aria-live="assertive"
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-80" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-80" />
      )}
      <p className="flex-1 text-sm leading-snug font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
