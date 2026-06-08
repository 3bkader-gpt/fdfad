'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { deleteOrder } from '../actions';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const t = useTranslations('Admin');
  const tcom = useTranslations('Common');
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const res = await deleteOrder(orderId);
      if (res.success) {
        router.push('/admin');
      } else {
        console.error(res.error || 'Failed to delete order');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-[10px] font-bold tracking-widest text-red-600 uppercase transition-all duration-200 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
        {tcom('delete')}
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title={t('deleteOrderTitle')}
        message={t('deleteOrderConfirm')}
        confirmText={tcom('delete')}
        cancelText={tcom('cancel')}
        type="danger"
        isPending={isPending}
      />
    </>
  );
}
