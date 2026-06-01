'use client';

import { useState } from 'react';
import { Category } from '@/types/supabase';
import { Plus, Edit2, Archive, Tag, X } from 'lucide-react';
import { CategoryForm } from './CategoryForm';
import { archiveCategory } from './actions';

export function CategoryManagerClient({ initialCategories }: { initialCategories: Category[] }) {
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
        'Are you sure you want to archive this category? It will no longer appear on the storefront but will remain in the database for history.',
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
    <div className="flex flex-col gap-8">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-full bg-[#2C3E35] px-6 py-2.5 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-[#1E2B25] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative flex flex-col gap-4 rounded-2xl border border-[#2C3E35]/5 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FAFAFA] p-2">
                  <Tag className="h-4 w-4 opacity-40" />
                </div>
                <h3 className="text-sm font-bold tracking-tight text-[#2C3E35] uppercase">
                  {cat.name}
                </h3>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[8px] font-bold tracking-tighter uppercase ${
                  cat.is_active
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                    : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                }`}
              >
                {cat.is_active ? 'Active' : 'Archived'}
              </span>
            </div>

            {cat.description && (
              <p className="line-clamp-2 text-[10px] leading-relaxed opacity-40">
                {cat.description}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2 border-t border-[#2C3E35]/5 pt-4">
              <button
                onClick={() => handleEdit(cat)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FAFAFA] py-2 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-colors hover:bg-[#F0F0F0]"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
              {cat.is_active && (
                <button
                  onClick={() => handleArchive(cat.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors hover:bg-amber-100"
                  title="Archive Category"
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="animate-in zoom-in-95 relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl duration-200">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-2 hover:bg-[#FAFAFA]"
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
