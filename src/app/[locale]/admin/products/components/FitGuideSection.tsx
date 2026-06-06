'use client';

import { UseFormRegister } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SizeRecommendationItem } from '@/types/product';
import { ProductFormValues } from '../types';

interface FitGuideSectionProps {
  register: UseFormRegister<ProductFormValues>;
  sizes: string[];
  sizeRecommendations: SizeRecommendationItem[];
  onAddRecommendation: () => void;
  onRemoveRecommendation: (index: number) => void;
  onUpdateRecommendation: (index: number, field: keyof SizeRecommendationItem, val: string) => void;
}

export function FitGuideSection({
  register,
  sizes,
  sizeRecommendations,
  onAddRecommendation,
  onRemoveRecommendation,
  onUpdateRecommendation,
}: FitGuideSectionProps) {
  const t = useTranslations('Admin');
  const tc = useTranslations('Common');

  return (
    <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
      <h3 className="border-border-color text-text-primary border-b pb-3 font-serif text-xl font-bold">
        {t('fitGuideSec')}
      </h3>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tc('modelHeight')} (cm)
          </label>
          <input
            {...register('model_height_cm')}
            type="number"
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="e.g. 168"
          />
          <p className="text-[10px] opacity-40">{t('helpModelHeight')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tc('modelWeight')} (kg)
          </label>
          <input
            {...register('model_weight_kg')}
            type="number"
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="e.g. 65"
          />
          <p className="text-[10px] opacity-40">{t('helpModelWeight')}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tc('modelSize')}
          </label>
          <input
            {...register('model_size_worn')}
            className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="e.g. 56"
          />
          <p className="text-[10px] opacity-40">{t('helpModelSize')}</p>
        </div>
      </div>

      {/* Sizing Recommendations Table */}
      <div className="border-border-color flex flex-col gap-4 border-t pt-6">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tc('sizeRecommend')} Mappings
          </label>
          <button
            type="button"
            onClick={onAddRecommendation}
            className="text-brand-accent flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase transition-all hover:text-[#b08264]"
          >
            <Plus className="h-3 w-3" />
            {t('addRecommendation')}
          </button>
        </div>

        {sizeRecommendations.length === 0 ? (
          <p className="text-xs italic opacity-40">No mappings added yet. e.g. Size 52 → 50-65kg</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sizeRecommendations.map((row, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="grid flex-1 grid-cols-2 gap-4">
                  <select
                    value={row.size}
                    onChange={(e) => onUpdateRecommendation(index, 'size', e.target.value)}
                    className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-2.5 text-sm shadow-sm ring-1 focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                  >
                    <option value="">Select Size</option>
                    {sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    {/* Fallback if sizes array is empty */}
                    {sizes.length === 0 && <option value="Free Size">Free Size</option>}
                  </select>
                  <input
                    type="text"
                    value={row.weight_range}
                    onChange={(e) => onUpdateRecommendation(index, 'weight_range', e.target.value)}
                    placeholder="e.g. 50-65kg"
                    className="bg-bg-main text-text-primary ring-border-color rounded-xl px-4 py-2.5 text-sm shadow-sm ring-1 focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveRecommendation(index)}
                  className="rounded-lg p-2 text-red-500 transition-all hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-[10px] opacity-40">{t('helpRecommendations')}</p>
      </div>
    </section>
  );
}
