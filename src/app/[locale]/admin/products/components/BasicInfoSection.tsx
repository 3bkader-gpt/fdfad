'use client';

import { Sparkles } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Category } from '@/types/supabase';
import { ProductFormValues } from '../types';
import { Input } from '@/components/ui/Input';

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
        <div className="md:col-span-2">
          <Input
            id="title"
            label="Display Title"
            {...register('title')}
            error={errors.title}
            placeholder="e.g. Silk Chiffon Khimar"
            helperText={t('helpTitle')}
            className="bg-bg-main"
          />
        </div>

        <Input
          id="price"
          label={`Price (${tc('egp')})`}
          {...register('price')}
          error={errors.price}
          type="number"
          step="0.01"
          helperText={t('helpPrice')}
          className="bg-bg-main"
        />

        <Input
          id="category_id"
          as="select"
          label={t('primaryCategory')}
          {...register('category_id')}
          error={errors.category_id}
          helperText={t('helpCategory')}
          className="bg-bg-main"
        >
          <option value="">Select a Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name_ar} / {cat.name_en}
            </option>
          ))}
        </Input>

        <Input
          id="is_active"
          as="select"
          label={t('visibility')}
          {...register('is_active')}
          helperText={t('helpVisibility')}
          className="bg-bg-main"
        >
          <option value="true">{t('active')}</option>
          <option value="false">{t('archived')}</option>
        </Input>

        <div className="md:col-span-2">
          <Input
            id="description"
            as="textarea"
            label="Detailed Description"
            {...register('description')}
            rows={4}
            placeholder="Describe the drape, feel, and fit..."
            helperText={t('helpDescription')}
            className="bg-bg-main"
          />
        </div>
      </div>
    </section>
  );
}
