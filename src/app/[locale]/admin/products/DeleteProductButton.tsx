'use client';

import { Trash2 } from 'lucide-react';
import { deleteProduct } from './ProductActions';
import { useTransition, useState } from 'react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useTranslations } from 'next-intl';

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const t = useTranslations('Admin');
  const tc = useTranslations('Common');

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    startTransition(async () => {
      try {
        await deleteProduct(id);
      } catch (e: unknown) {
        const error = e as Error;
        setErrorMsg(error.message);
      }
    });
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className={`flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 ${
          isPending ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={t('deleteProductTitle')}
        message={t('deleteProductConfirm')}
        confirmText={tc('delete')}
        cancelText={tc('cancel')}
        type="danger"
        isPending={isPending}
      />

      {/* Custom Error Alert Modal */}
      <ConfirmModal
        isOpen={!!errorMsg}
        onClose={() => setErrorMsg(null)}
        onConfirm={() => setErrorMsg(null)}
        title={tc('error')}
        message={errorMsg || ''}
        confirmText={tc('confirm')}
        cancelText=""
        type="warning"
      />
    </>
  );
}
