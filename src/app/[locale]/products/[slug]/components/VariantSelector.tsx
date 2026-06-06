'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface VariantSelectorProps {
  sizes: string[];
  colors: string[];
  selectedSize: string;
  selectedColor: string;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  sizeError?: boolean;
  colorError?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  black: '#0F0F0F',
  beige: '#D4BE9F',
  pink: '#E0A3B5',
  mocha: '#7C5C43',
  olive: '#5E6F54',
  sage: '#8B9B90',
  navy: '#1D2D44',
  grey: '#707070',
  gray: '#707070',
  plum: '#4E2A3A',
  white: '#FAFAFA',
};

export function VariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect,
  sizeError,
  colorError,
}: VariantSelectorProps) {
  const t = useTranslations('Products');

  return (
    <>
      {/* Size Selector */}
      {sizes && sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
              {t('selectSize')}
            </label>
            {sizeError && (
              <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase">
                {t('sizeRequired')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeSelect(size)}
                  className={`flex h-[48px] min-w-[48px] items-center justify-center rounded-xl border text-xs font-bold uppercase transition-all active:scale-95 ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary dark:text-bg-main shadow-brand-primary/15 text-white shadow-lg'
                      : 'border-border-color text-text-primary bg-bg-elevated hover:border-brand-accent'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors && colors.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
              {t('selectColor')}
            </label>
            {colorError && (
              <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase">
                {t('colorRequired')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              const hexCode = COLOR_MAP[color.toLowerCase()];

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onColorSelect(color)}
                  className={`relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-bg-elevated border-brand-accent shadow-brand-accent/10 scale-105 shadow-md'
                      : 'border-border-color bg-bg-elevated hover:border-brand-accent'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: hexCode || '#cbd5e1' }}
                  />
                  <span>{color}</span>
                  {isSelected && <Check className="text-brand-accent ml-1 h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
