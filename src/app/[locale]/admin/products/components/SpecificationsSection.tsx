'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ProductFormValues } from '../types';
import { Input } from '@/components/ui/Input';

interface SpecificationsSectionProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export function SpecificationsSection({ register, errors }: SpecificationsSectionProps) {
  const t = useTranslations('Admin');
  const tc = useTranslations('Common');
  const tp = useTranslations('Products');

  return (
    <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
      <h3 className="border-border-color text-text-primary border-b pb-3 font-serif text-xl font-bold">
        {t('specifications')}
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          id="fabric_type"
          label={tp('fabric')}
          {...register('fabric_type')}
          error={errors.fabric_type}
          placeholder="e.g. Medine Silk"
          helperText={t('helpFabric')}
          className="bg-bg-main"
        />

        <Input
          id="garment_length_cm"
          label={`${tc('garmentLength')} (cm)`}
          {...register('garment_length_cm')}
          error={errors.garment_length_cm}
          type="number"
          placeholder="e.g. 145"
          helperText={t('helpLength')}
          className="bg-bg-main"
        />

        <Input
          id="season"
          label={tc('season')}
          {...register('season')}
          error={errors.season}
          placeholder="e.g. All Seasons, Summer"
          helperText={t('helpSeason')}
          className="bg-bg-main"
        />

        <Input
          id="care_instructions"
          label={tc('careInstructions')}
          {...register('care_instructions')}
          error={errors.care_instructions}
          placeholder="e.g. Machine Wash Cold"
          helperText={t('helpCare')}
          className="bg-bg-main"
        />

        <Input
          id="opacity_scale"
          as="select"
          label={`${tp('opacity')} (1-5)`}
          {...register('opacity_scale')}
          error={errors.opacity_scale}
          helperText={t('helpOpacity')}
          className="bg-bg-main"
        >
          <option value="">Select Opacity</option>
          {[1, 2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>
              {v} {v === 5 ? `(${tp('opaque')})` : ''}
            </option>
          ))}
        </Input>
      </div>
    </section>
  );
}
