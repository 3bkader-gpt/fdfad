'use client';

import { Sparkles } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Category } from '@/types/supabase';
import { ProductFormValues } from '../types';

interface BasicInfoSectionProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: Category[];
}

export function BasicInfoSection({ register, errors, categories }: BasicInfoSectionProps) {
  const t = useTranslations('Admin');
  const tc = useTranslations('Common');

  return (
    <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
      <h3 className="border-border-color text-text-primary flex items-center gap-2 border-b pb-3 font-serif text-xl font-bold">
        <Sparkles className="text-brand-accent h-5 w-5" />
        {t('basicInfo')}
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Display Title
          </label>
          <input
            {...register('title')}
            className={`bg-bg-main text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.title ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
            placeholder="e.g. Silk Chiffon Khimar"
          />
          {errors.title && (
            <p className="text-[10px] text-red-500">{errors.title.message as string}</p>
          )}
          <p className="text-[10px] opacity-40">{t('helpTitle')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Price ({tc('egp')})
          </label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            className={`bg-bg-main text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.price ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
          />
          {errors.price && (
            <p className="text-[10px] text-red-500">{errors.price.message as string}</p>
          )}
          <p className="text-[10px] opacity-40">{t('helpPrice')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('primaryCategory')}
          </label>
          <select
            {...register('category_id')}
            className={`bg-bg-main text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.category_id ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_ar} / {cat.name_en}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-[10px] text-red-500">{errors.category_id.message as string}</p>
          )}
          <p className="text-[10px] opacity-40">{t('helpCategory')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('visibility')}
          </label>
          <select
            {...register('is_active')}
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
          >
            <option value="true">{t('active')}</option>
            <option value="false">{t('archived')}</option>
          </select>
          <p className="text-[10px] opacity-40">{t('helpVisibility')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Made in Egypt
          </label>
          <select
            {...register('made_in_egypt')}
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <p className="text-[10px] opacity-40">{t('helpMadeInEgypt')}</p>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Detailed Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="bg-bg-main text-text-primary ring-border-color w-full rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="Describe the drape, feel, and fit..."
          />
          <p className="text-[10px] opacity-40">{t('helpDescription')}</p>
        </div>
      </div>
    </section>
  );
}
