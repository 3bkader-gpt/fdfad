'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Camera, X, Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdating(true);

    try {
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

      onChange(publicUrl);
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-left text-[10px] font-bold tracking-widest uppercase opacity-60">
        Product Photography
      </label>

      <div className="group relative flex aspect-[3/4] w-full max-w-[240px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#2C3E35]/10 bg-[#F5F5F5] transition-all hover:border-[#C89B7E]/30">
        {value ? (
          <>
            <Image src={value} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-white/90 p-2 text-[#2C3E35] shadow-lg transition-transform active:scale-95"
              >
                <UploadCloud className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="rounded-full bg-red-500/90 p-2 text-white shadow-lg transition-transform active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-3 px-8 text-center"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#C89B7E]" />
            ) : (
              <>
                <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-black/5">
                  <Camera className="h-6 w-6 text-[#2C3E35]/40" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-[#2C3E35] uppercase">
                    Tap to select
                  </span>
                  <span className="text-[9px] italic opacity-40">3:4 Portrait recommended</span>
                </div>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
