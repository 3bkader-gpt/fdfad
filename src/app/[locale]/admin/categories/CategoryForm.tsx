'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { upsertCategory } from './actions';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Category } from '@/types/supabase';

const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  is_active: z.string(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryForm({
  initialData,
  onSuccess,
}: {
  initialData?: Category;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          is_active: initialData.is_active.toString(),
        }
      : {
          name: '',
          description: '',
          is_active: 'true',
        },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));

    try {
      await upsertCategory(formData, initialData?.id);
      onSuccess();
    } catch (e: unknown) {
      const error = e as Error;
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-text-primary flex flex-col gap-6 text-start"
    >
      <div className="flex flex-col gap-1.5 text-start">
        <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
          Category Name
        </label>
        <input
          {...register('name')}
          className={`bg-bg-main text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.name ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'}`}
          placeholder="e.g. Abayas"
        />
        {errors.name && (
          <p className="text-start text-[10px] font-medium text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 text-start">
        <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="bg-bg-main ring-border-color focus:ring-brand-accent/30 text-text-primary w-full rounded-xl px-4 py-3.5 text-start text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
          placeholder="Brief description of the category..."
        />
      </div>

      <div className="flex flex-col gap-1.5 text-start">
        <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
          Visibility
        </label>
        <select
          {...register('is_active')}
          className="bg-bg-main ring-border-color focus:ring-brand-accent/30 text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
        >
          <option value="true">Active</option>
          <option value="false">Hidden</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-primary mt-4 flex w-full items-center justify-center gap-3 rounded-full py-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Category'}
      </button>
    </form>
  );
}
