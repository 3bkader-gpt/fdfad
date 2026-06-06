'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ProductFormValues } from '../types';

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
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tp('fabric')}
          </label>
          <input
            {...register('fabric_type')}
            className={`bg-bg-main text-text-primary rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.fabric_type ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
            placeholder="e.g. Medine Silk"
          />
          <p className="text-[10px] opacity-40">{t('helpFabric')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tc('garmentLength')} (cm)
          </label>
          <input
            {...register('garment_length_cm')}
            type="number"
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="e.g. 145"
          />
          <p className="text-[10px] opacity-40">{t('helpLength')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tc('season')}
          </label>
          <input
            {...register('season')}
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="e.g. All Seasons, Summer"
          />
          <p className="text-[10px] opacity-40">{t('helpSeason')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tc('careInstructions')}
          </label>
          <input
            {...register('care_instructions')}
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="e.g. Machine Wash Cold"
          />
          <p className="text-[10px] opacity-40">{t('helpCare')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tp('opacity')} (1-5)
          </label>
          <select
            {...register('opacity_scale')}
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
          >
            <option value="">Select Opacity</option>
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v} {v === 5 ? `(${tp('opaque')})` : ''}
              </option>
            ))}
          </select>
          <p className="text-[10px] opacity-40">{t('helpOpacity')}</p>
        </div>
      </div>
    </section>
  );
}
