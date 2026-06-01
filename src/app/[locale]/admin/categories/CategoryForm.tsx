'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { upsertCategory } from './actions';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Category } from '@/types/supabase';
import { useTranslations } from 'next-intl';

type CategoryFormValues = {
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  is_active: string;
};

export function CategoryForm({
  initialData,
  onSuccess,
}: {
  initialData?: Category;
  onSuccess: () => void;
}) {
  const t = useTranslations('Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categorySchema = z.object({
    name_ar: z.string().min(2, t('nameRequired')),
    name_en: z.string().min(2, t('nameRequired')),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
    is_active: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          name_ar: initialData.name_ar,
          name_en: initialData.name_en,
          description_ar: initialData.description_ar || '',
          description_en: initialData.description_en || '',
          is_active: initialData.is_active.toString(),
        }
      : {
          name_ar: '',
          name_en: '',
          description_ar: '',
          description_en: '',
          is_active: 'true',
        },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value || ''));

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Arabic Name */}
        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('categoryNameAr')}
          </label>
          <input
            {...register('name_ar')}
            className={`bg-bg-main text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.name_ar ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'}`}
            placeholder={t('categoryNameArPlaceholder')}
            dir="rtl"
          />
          {errors.name_ar && (
            <p className="text-start text-[10px] font-medium text-red-500">
              {errors.name_ar.message}
            </p>
          )}
        </div>

        {/* English Name */}
        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('categoryNameEn')}
          </label>
          <input
            {...register('name_en')}
            className={`bg-bg-main text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.name_en ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'}`}
            placeholder={t('categoryNameEnPlaceholder')}
            dir="ltr"
          />
          {errors.name_en && (
            <p className="text-start text-[10px] font-medium text-red-500">
              {errors.name_en.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Arabic Description */}
        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('descriptionAr')}
          </label>
          <textarea
            {...register('description_ar')}
            rows={3}
            className="bg-bg-main ring-border-color focus:ring-brand-accent/30 text-text-primary w-full rounded-xl px-4 py-3.5 text-start text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
            placeholder={t('descriptionArPlaceholder')}
            dir="rtl"
          />
        </div>

        {/* English Description */}
        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('descriptionEn')}
          </label>
          <textarea
            {...register('description_en')}
            rows={3}
            className="bg-bg-main ring-border-color focus:ring-brand-accent/30 text-text-primary w-full rounded-xl px-4 py-3.5 text-start text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
            placeholder={t('descriptionEnPlaceholder')}
            dir="ltr"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-start">
        <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
          {t('visibility')}
        </label>
        <select
          {...register('is_active')}
          className="bg-bg-main ring-border-color focus:ring-brand-accent/30 text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
        >
          <option value="true">{t('active')}</option>
          <option value="false">{t('hidden')}</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-primary mt-4 flex w-full items-center justify-center gap-3 rounded-full py-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('saveCategory')}
      </button>
    </form>
  );
}
