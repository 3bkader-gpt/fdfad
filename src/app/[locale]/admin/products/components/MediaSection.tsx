'use client';

import { Image as ImageIcon } from 'lucide-react';
import { MultiImageUpload } from '@/components/ui/MultiImageUpload';
import { useTranslations } from 'next-intl';
import { ProductImageItem } from '@/types/product';

interface MediaSectionProps {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
}

export function MediaSection({ images, onChange }: MediaSectionProps) {
  const t = useTranslations('Admin');

  return (
    <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
      <h3 className="border-border-color text-text-primary flex items-center gap-2 border-b pb-3 font-serif text-xl font-bold">
        <ImageIcon className="text-brand-accent h-5 w-5" />
        {t('media')}
      </h3>
      <MultiImageUpload value={images} onChange={onChange} />
    </section>
  );
}
