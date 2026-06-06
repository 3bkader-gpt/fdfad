'use client';

import { Ruler } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SizeRecommendationItem } from '@/types/product';

interface FitGuideProps {
  modelHeightCm?: number | null;
  modelWeightKg?: number | null;
  modelSizeWorn?: string | null;
  recommendations: SizeRecommendationItem[];
}

export function FitGuide({
  modelHeightCm,
  modelWeightKg,
  modelSizeWorn,
  recommendations,
}: FitGuideProps) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');

  if (!modelHeightCm && !modelWeightKg && recommendations.length === 0) {
    return null;
  }

  return (
    <div className="border-border-color bg-bg-elevated flex flex-col gap-5 rounded-2xl border p-6">
      <h4 className="border-border-color text-brand-primary flex items-center gap-2 border-b pb-2 text-xs font-bold tracking-[0.15em] uppercase">
        <Ruler className="text-brand-accent h-4 w-4" />
        {t('fitGuide')}
      </h4>

      {/* Model info cards */}
      {(modelHeightCm || modelWeightKg || modelSizeWorn) && (
        <div className="grid grid-cols-3 gap-3 text-center">
          {modelHeightCm && (
            <div className="bg-bg-main border-border-color rounded-xl border p-2.5">
              <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                {tc('modelHeight')}
              </span>
              <span className="text-text-primary text-xs font-bold">{modelHeightCm} cm</span>
            </div>
          )}
          {modelWeightKg && (
            <div className="bg-bg-main border-border-color rounded-xl border p-2.5">
              <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                {tc('modelWeight')}
              </span>
              <span className="text-text-primary text-xs font-bold">{modelWeightKg} kg</span>
            </div>
          )}
          {modelSizeWorn && (
            <div className="bg-bg-main border-border-color rounded-xl border p-2.5">
              <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                {tc('modelSize')}
              </span>
              <span className="text-brand-accent text-xs font-bold">{modelSizeWorn}</span>
            </div>
          )}
        </div>
      )}

      {/* Recommendations Table */}
      {recommendations.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
            {tc('sizeRecommend')}
          </span>
          <div className="border-border-color bg-bg-main overflow-hidden rounded-xl border text-xs">
            {recommendations.map((row, i) => (
              <div
                key={i}
                className={`flex justify-between px-4 py-2.5 ${
                  i < recommendations.length - 1 ? 'border-border-color border-b' : ''
                }`}
              >
                <span className="text-text-primary font-bold">
                  {tc('size')} {row.size}
                </span>
                <span className="opacity-70">{row.weight_range}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
