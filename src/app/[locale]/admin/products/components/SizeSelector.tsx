'use client';

import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SizeSelectorProps {
  sizes: string[];
  newSizeInput: string;
  onNewSizeInputChange: (val: string) => void;
  onAddSize: () => void;
  onRemoveSize: (index: number) => void;
  onMoveSize: (index: number, direction: 'up' | 'down') => void;
}

export function SizeSelector({
  sizes,
  newSizeInput,
  onNewSizeInputChange,
  onAddSize,
  onRemoveSize,
  onMoveSize,
}: SizeSelectorProps) {
  const t = useTranslations('Admin');

  return (
    <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
      <h3 className="border-border-color text-text-primary border-b pb-3 font-serif text-xl font-bold">
        {t('sizes')}
      </h3>

      <div className="flex max-w-sm gap-3">
        <input
          type="text"
          value={newSizeInput}
          onChange={(e) => onNewSizeInputChange(e.target.value)}
          placeholder="e.g. 54, S, XL"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddSize();
            }
          }}
          className="bg-bg-main text-text-primary ring-border-color flex-1 rounded-xl px-4 py-3 text-sm shadow-sm ring-1 outline-none focus:ring-2 focus:ring-[#C89B7E]/30"
        />
        <button
          type="button"
          onClick={onAddSize}
          className="bg-brand-primary rounded-xl px-5 py-3 text-xs font-bold text-white uppercase transition-all hover:opacity-90"
        >
          {t('addSize')}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {sizes.length === 0 ? (
          <span className="text-xs italic opacity-40">No sizes added yet.</span>
        ) : (
          sizes.map((size, index) => (
            <div
              key={size}
              className="border-border-color bg-bg-elevated flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"
            >
              <span>{size}</span>
              <div className="border-border-color ml-1 flex items-center gap-0.5 border-l pl-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => onMoveSize(index, 'up')}
                    className="hover:text-brand-accent p-0.5"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                )}
                {index < sizes.length - 1 && (
                  <button
                    type="button"
                    onClick={() => onMoveSize(index, 'down')}
                    className="hover:text-brand-accent p-0.5"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveSize(index)}
                  className="ml-1 p-0.5 text-red-500 hover:text-red-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <p className="text-[10px] opacity-40">{t('helpSizes')}</p>
    </section>
  );
}
