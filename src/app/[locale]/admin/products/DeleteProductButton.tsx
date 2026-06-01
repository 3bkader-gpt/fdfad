'use client';

import { Trash2 } from 'lucide-react';
import { deleteProduct } from './ProductActions';
import { useTransition } from 'react';

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      startTransition(async () => {
        try {
          await deleteProduct(id);
        } catch (e: unknown) {
          const error = e as Error;
          alert(error.message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
