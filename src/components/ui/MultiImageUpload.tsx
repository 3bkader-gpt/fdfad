'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Camera, X, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ProductImageItem {
  url: string;
  is_cover: boolean;
}

interface MultiImageUploadProps {
  value: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
}

export function MultiImageUpload({ value = [], onChange }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Admin');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit to 10 images total
    if (value.length + files.length > 10) {
      alert('You can only upload up to 10 images per product.');
      return;
    }

    setIsUploading(true);

    try {
      const uploadedImages: ProductImageItem[] = [...value];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Generate unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // 2. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 3. Get Public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('product-images').getPublicUrl(filePath);

        // If this is the first image ever, set as cover by default
        const isCover = uploadedImages.length === 0;

        uploadedImages.push({
          url: publicUrl,
          is_cover: isCover,
        });
      }

      onChange(uploadedImages);
    } catch (e: unknown) {
      const error = e as Error;
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);

    // If we removed the cover image, set the first one of the remaining as cover
    const removedCover = value[index]?.is_cover;
    if (removedCover && updated.length > 0) {
      updated[0].is_cover = true;
    }

    onChange(updated);
  };

  const setCoverImage = (index: number) => {
    const updated = value.map((img, i) => ({
      ...img,
      is_cover: i === index,
    }));
    onChange(updated);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === value.length - 1) return;

    const newIndex = direction === 'left' ? index - 1 : index + 1;
    const updated = [...value];

    // Swap items
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex items-center justify-between">
        <label className="text-left text-[10px] font-bold tracking-widest uppercase opacity-60">
          {t('media')} (1 - 10 {t('products')})
        </label>
        <span className="text-[10px] opacity-40">{value.length} / 10</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Upload Button */}
        {value.length < 10 && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#2C3E35]/10 bg-[#F5F5F5] transition-all hover:border-[#C89B7E]/30 hover:bg-zinc-100 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#C89B7E]" />
            ) : (
              <>
                <Camera className="mb-2 h-6 w-6 text-[#2C3E35]/40" />
                <span className="text-[9px] font-bold tracking-wider text-[#2C3E35] uppercase">
                  {t('helpImage')}
                </span>
              </>
            )}
          </button>
        )}

        {/* Existing Images */}
        {value.map((img, index) => (
          <div
            key={img.url}
            className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border transition-all ${
              img.is_cover
                ? 'border-brand-accent ring-brand-accent/20 shadow-md ring-2 shadow-[#C89B7E]/10'
                : 'border-border-color bg-bg-elevated'
            }`}
          >
            <Image src={img.url} alt={`Preview ${index}`} fill className="object-cover" />

            {/* Badges */}
            {img.is_cover && (
              <span className="absolute top-2 left-2 flex items-center gap-1 rounded bg-[#C89B7E] px-2 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase shadow">
                <Star className="h-2 w-2 fill-white" />
                Cover
              </span>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-start justify-between">
                <button
                  type="button"
                  onClick={() => setCoverImage(index)}
                  className={`rounded-full p-1.5 shadow backdrop-blur-sm transition-transform active:scale-95 ${
                    img.is_cover
                      ? 'bg-[#C89B7E] text-white'
                      : 'bg-white/90 text-zinc-600 hover:bg-white'
                  }`}
                  title="Set as Cover"
                >
                  <Star className={`h-3.5 w-3.5 ${img.is_cover ? 'fill-white' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-full bg-red-500/90 p-1.5 text-white shadow backdrop-blur-sm transition-transform hover:bg-red-500 active:scale-95"
                  title="Remove Image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Reordering Chevrons */}
              <div className="flex justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'left')}
                    className="rounded-full bg-white/90 p-1 text-zinc-800 shadow transition-transform hover:bg-white active:scale-95"
                    title="Move Left"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                )}
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'right')}
                    className="rounded-full bg-white/90 p-1 text-zinc-800 shadow transition-transform hover:bg-white active:scale-95"
                    title="Move Right"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
      <p className="text-[10px] opacity-40">{t('helpMedia')}</p>
    </div>
  );
}
