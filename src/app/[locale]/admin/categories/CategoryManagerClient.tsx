'use client';

import { useState } from 'react';
import { Category } from '@/types/supabase';
import { Plus, Edit2, Archive, Tag, X } from 'lucide-react';
import { CategoryForm } from './CategoryForm';
import { archiveCategory } from './actions';
import { useTranslations } from 'next-intl';

export function CategoryManagerClient({ initialCategories }: { initialCategories: Category[] }) {
  const t = useTranslations('Admin');
  const tc = useTranslations('Common');
  const [categories, setCategories] = useState(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  const handleArchive = async (id: string) => {
    if (
      confirm(
        t('archiveConfirm'),
      )
    ) {
      try {
        await archiveCategory(id);
        setCategories(categories.map((c) => (c.id === id ? { ...c, is_active: false } : c)));
      } catch (e: unknown) {
        const error = e as Error;
        alert(error.message);
      }
    }
  };

  return (
    <div className="text-text-primary flex flex-col gap-8">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-brand-primary flex items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:opacity-90 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {t('addCategory')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group border-border-color bg-bg-elevated relative flex flex-col gap-4 rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-bg-main border-border-color rounded-full border p-2">
                  <Tag className="h-4 w-4 opacity-40" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-bold tracking-tight">{cat.name_ar}</h3>
                  <span className="text-[10px] font-medium opacity-65">{cat.name_en}</span>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[8px] font-bold tracking-tighter uppercase ${
                  cat.is_active
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {cat.is_active ? t('active') : t('archived')}
              </span>
            </div>

            {(cat.description_ar || cat.description_en) && (
              <div className="flex flex-col gap-1 text-[10px] leading-relaxed opacity-50">
                {cat.description_ar && <p className="line-clamp-1" dir="rtl">{cat.description_ar}</p>}
                {cat.description_en && <p className="line-clamp-1" dir="ltr">{cat.description_en}</p>}
              </div>
            )}

            <div className="border-border-color mt-2 flex items-center gap-2 border-t pt-4">
              <button
                onClick={() => handleEdit(cat)}
                className="bg-bg-main hover:bg-bg-elevated flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-colors hover:opacity-100"
              >
                <Edit2 className="h-3 w-3" />
                {tc('edit')}
              </button>
              {cat.is_active && (
                <button
                  onClick={() => handleArchive(cat.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40"
                  title={t('archived')}
                >
                  <Archive className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Basic Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 cursor-pointer bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="bg-bg-elevated animate-in zoom-in-95 border-border-color relative w-full max-w-md rounded-3xl border p-8 shadow-2xl duration-200">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold">
                {editingCategory ? t('editCategory') : t('newCategory')}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="hover:bg-bg-main rounded-full p-2"
              >
                <X className="h-5 w-5 opacity-40" />
              </button>
            </div>
            <CategoryForm
              initialData={editingCategory}
              onSuccess={() => {
                setIsFormOpen(false);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
