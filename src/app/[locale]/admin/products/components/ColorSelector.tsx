'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ColorSelectorProps {
  colors: string[];
  newColorInput: string;
  onNewColorInputChange: (val: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  standardColors: string[];
}

export function ColorSelector({
  colors,
  newColorInput,
  onNewColorInputChange,
  onAddColor,
  onRemoveColor,
  standardColors,
}: ColorSelectorProps) {
  const t = useTranslations('Admin');

  return (
    <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
      <h3 className="border-border-color text-text-primary border-b pb-3 font-serif text-xl font-bold">
        {t('colors')}
      </h3>

      <div className="flex max-w-md gap-3">
        <input
          type="text"
          value={newColorInput}
          onChange={(e) => onNewColorInputChange(e.target.value)}
          placeholder="e.g. Beige, Olive, Mocha"
          list="standard-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddColor();
            }
          }}
          className="bg-bg-main text-text-primary ring-border-color flex-1 rounded-xl px-4 py-3 text-sm shadow-sm ring-1 outline-none focus:ring-2 focus:ring-[#C89B7E]/30"
        />
        <datalist id="standard-colors">
          {standardColors.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <button
          type="button"
          onClick={onAddColor}
          className="bg-brand-primary rounded-xl px-5 py-3 text-xs font-bold text-white uppercase transition-all hover:opacity-90"
        >
          {t('addColor')}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {colors.length === 0 ? (
          <span className="text-xs italic opacity-40">No colors added yet.</span>
        ) : (
          colors.map((color, index) => {
            const isKnown = standardColors.includes(color);
            return (
              <div
                key={color}
                className="border-border-color bg-bg-elevated flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold"
              >
                <span
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{
                    backgroundColor: isKnown ? color.toLowerCase() : '#e4e4e7',
                  }}
                />
                <span>{color}</span>
                <button
                  type="button"
                  onClick={() => onRemoveColor(index)}
                  className="border-border-color ml-2 border-l pl-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
      <p className="text-[10px] opacity-40">{t('helpColors')}</p>
    </section>
  );
}
