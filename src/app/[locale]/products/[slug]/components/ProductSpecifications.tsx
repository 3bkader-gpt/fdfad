'use client';

import { useTranslations } from 'next-intl';

interface ProductSpecificationsProps {
  fabricType?: string | null;
  garmentLengthCm?: number | null;
  season?: string | null;
  careInstructions?: string | null;
  opacityScale?: number | null;
}

export function ProductSpecifications({
  fabricType,
  garmentLengthCm,
  season,
  careInstructions,
  opacityScale,
}: ProductSpecificationsProps) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">{t('specs')}</h4>
      <div className="grid grid-cols-2 gap-4">
        {fabricType && (
          <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
            <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
              {t('fabric')}
            </span>
            <span className="text-xs font-medium">{fabricType}</span>
          </div>
        )}

        {garmentLengthCm && (
          <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
            <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
              {tc('garmentLength')}
            </span>
            <span className="text-xs font-medium">{garmentLengthCm} cm</span>
          </div>
        )}

        {season && (
          <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
            <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
              {tc('season')}
            </span>
            <span className="text-xs font-medium">{season}</span>
          </div>
        )}

        {careInstructions && (
          <div className="border-border-color bg-bg-elevated col-span-2 rounded-xl border p-4">
            <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
              {tc('careInstructions')}
            </span>
            <span className="text-xs font-medium">{careInstructions}</span>
          </div>
        )}

        <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
          <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
            {t('origin')}
          </span>
          <span className="text-xs font-medium">{tc('madeInEgypt')}</span>
        </div>

        {/* Opacity Meter */}
        {opacityScale !== null && opacityScale !== undefined && (
          <div className="border-border-color bg-bg-elevated flex flex-col justify-center gap-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-40">
                {t('opacity')}
              </span>
              <span className="text-brand-accent text-[8px] font-bold uppercase">
                {opacityScale}/5
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full ${
                    level <= (opacityScale ?? 0)
                      ? 'bg-brand-accent'
                      : 'bg-bg-main border-border-color/50 border'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
