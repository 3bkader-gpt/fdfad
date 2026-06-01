'use client';

import { X, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isPending?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  isPending = false,
}: ConfirmModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Curated color themes based on type
  const theme = {
    danger: {
      bgIcon: 'bg-red-50 dark:bg-red-950/30',
      textIcon: 'text-red-600 dark:text-red-400',
      borderIcon: 'border-red-100 dark:border-red-900/30',
      confirmBtn: 'bg-red-600 hover:bg-red-700 shadow-red-600/10 text-white',
      accentIcon: AlertOctagon,
    },
    warning: {
      bgIcon: 'bg-amber-50 dark:bg-amber-950/30',
      textIcon: 'text-amber-600 dark:text-amber-400',
      borderIcon: 'border-amber-100 dark:border-amber-900/30',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/10 text-white',
      accentIcon: AlertTriangle,
    },
    info: {
      bgIcon: 'bg-brand-accent/10',
      textIcon: 'text-brand-accent',
      borderIcon: 'border-brand-accent/20',
      confirmBtn: 'bg-brand-primary hover:opacity-90 shadow-brand-primary/10 text-white',
      accentIcon: Info,
    },
  }[type];

  const IconComponent = theme.accentIcon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-bg-elevated border-border-color relative w-full max-w-md rounded-3xl border p-8 shadow-2xl transition-all duration-200 animate-in zoom-in-95 slide-in-from-bottom-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="hover:bg-bg-main absolute top-6 right-6 rounded-full p-2 transition-colors duration-200"
        >
          <X className="h-5 w-5 opacity-40 hover:opacity-100" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Accent Icon */}
          <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full border ${theme.bgIcon} ${theme.borderIcon}`}>
            <IconComponent className={`h-7 w-7 ${theme.textIcon}`} />
          </div>

          {/* Title & Message */}
          <h3 className="text-text-primary font-serif text-2xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="text-text-secondary mt-3 text-sm leading-relaxed opacity-70">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              disabled={isPending}
              className="bg-bg-main hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-primary border-border-color flex-1 rounded-full border py-3.5 text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className={`flex-1 rounded-full py-3.5 text-[10px] font-bold tracking-widest uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${theme.confirmBtn}`}
            >
              {isPending && (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
