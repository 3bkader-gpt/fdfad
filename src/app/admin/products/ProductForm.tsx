'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { upsertProduct } from './ProductActions';
import { Loader2, ArrowLeft, Globe } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const productSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z
    .string()
    .min(3, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be URL-friendly (a-z, 0-9, -)'),
  description: z.string().optional(),
  price: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Invalid price'),
  opacity_scale: z.string(),
  fabric_type: z.string().min(1, 'Fabric type is required'),
  made_in_egypt: z.string(),
  is_active: z.string(),
  image_url: z.string().url('Invalid image URL').or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export function ProductForm({ initialData }: { initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: initialData.price.toString(),
          opacity_scale: initialData.opacity_scale.toString(),
          made_in_egypt: initialData.made_in_egypt.toString(),
          is_active: initialData.is_active.toString(),
          image_url: initialData.product_images?.[0]?.url || '',
        }
      : {
          made_in_egypt: 'true',
          is_active: 'true',
          opacity_scale: '5',
          image_url: '',
          slug: '',
        },
  });

  const title = watch('title');
  const imageUrl = watch('image_url');

  // Auto-generate slug for new products
  useEffect(() => {
    if (!isEditing && title) {
      setValue('slug', slugify(title), { shouldValidate: true });
    }
  }, [title, isEditing, setValue]);

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));

    try {
      await upsertProduct(formData, initialData?.id);
    } catch (e: any) {
      alert(e.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-10 text-left">
      <header className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-full bg-[#FAFAFA] p-2 transition-colors hover:bg-zinc-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#2C3E35]">
          {initialData ? 'Refine Product' : 'New Creation'}
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Photo Management (Native Upload) */}
        <div className="md:col-span-2">
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setValue('image_url', url, { shouldValidate: true })}
          />
          <input type="hidden" {...register('image_url')} />
          {errors.image_url && (
            <p className="mt-2 text-[10px] font-medium text-red-500">{errors.image_url.message}</p>
          )}
        </div>

        {/* Core Info */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              Display Title
            </label>
            <input
              {...register('title')}
              className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.title ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
              placeholder="e.g. Silk Chiffon Khimar"
            />
            {errors.title && (
              <p className="text-[10px] font-medium text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Hidden Slug Input (Maintained for DB/Schema compatibility) */}
          <input type="hidden" {...register('slug')} />
        </div>

        {/* Pricing & Fabric */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Price (EGP)
          </label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.price ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Fabric Type
          </label>
          <input
            {...register('fabric_type')}
            className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.fabric_type ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
            placeholder="e.g. Medine Silk"
          />
        </div>

        {/* Sensory Details */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Opacity Index (1-5)
          </label>
          <select
            {...register('opacity_scale')}
            className="rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 ring-black/5 focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v} {v === 5 ? '(Opaque)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Visibility
          </label>
          <select
            {...register('is_active')}
            className="rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 ring-black/5 focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
          >
            <option value="true">Active in Catalog</option>
            <option value="false">Archived / Hidden</option>
          </select>
        </div>

        {/* Origin */}
        <div className="flex flex-col gap-6 border-t border-[#2C3E35]/5 pt-8 md:col-span-2">
          <div className="flex flex-col gap-4 rounded-2xl bg-[#F5F5F5] p-6 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 opacity-30" />
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                  Made in Egypt
                </span>
              </div>
              <select
                {...register('made_in_egypt')}
                className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold uppercase shadow-sm outline-none"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Detailed Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1.5 w-full rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 ring-black/5 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="Describe the drape, feel, and fit..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#2C3E35] py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-xl shadow-[#2C3E35]/20 transition-all hover:bg-[#1E2B25] active:scale-95 disabled:opacity-50 md:col-span-2"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Commit to Collection'}
        </button>
      </div>
    </form>
  );
}
