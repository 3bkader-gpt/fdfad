'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { upsertProduct } from './ProductActions';
import { Loader2, ArrowLeft, Globe } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Link, useRouter } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Product, Category } from '@/types/supabase';
import { useTranslations } from 'next-intl';

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
  image_url: z.string().optional().or(z.literal('')),
  category_id: z.string().min(1, 'Category is required'),
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

export function ProductForm({
  initialData,
  categories = [],
}: {
  initialData?: Product;
  categories?: Category[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;
  const router = useRouter();
  const t = useTranslations('Admin');
  const tc = useTranslations('Common');
  const tp = useTranslations('Products');

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
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description || '',
          fabric_type: initialData.fabric_type,
          price: initialData.price.toString(),
          opacity_scale: initialData.opacity_scale.toString(),
          made_in_egypt: initialData.made_in_egypt.toString(),
          is_active: initialData.is_active.toString(),
          image_url: initialData.product_images?.[0]?.url || '',
          category_id: initialData.product_categories?.[0]?.category_id || '',
        }
      : {
          made_in_egypt: 'true',
          is_active: 'true',
          opacity_scale: '5',
          image_url: '',
          slug: '',
          title: '',
          description: '',
          fabric_type: '',
          price: '0',
          category_id: '',
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
    Object.entries(values).forEach(([key, value]) => formData.append(key, value ?? ''));

    try {
      await upsertProduct(formData, initialData?.id);
      router.push('/admin/products');
    } catch (e: unknown) {
      const error = e as Error;
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errs: object) => {
    console.error('[ProductForm] Validation errors:', errs);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex max-w-2xl flex-col gap-10 text-start">
      <header className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-full bg-[#FAFAFA] p-2 transition-colors hover:bg-zinc-100"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#2C3E35]">
          {initialData ? t('editProduct') : t('newProduct')}
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-8 text-start md:grid-cols-2">
        {/* Photo Management */}
        <div className="text-start md:col-span-2">
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setValue('image_url', url, { shouldValidate: true })}
          />
          <input type="hidden" {...register('image_url')} />
          {errors.image_url && (
            <p className="mt-2 text-start text-[10px] font-medium text-red-500">
              {errors.image_url.message}
            </p>
          )}
          <p className="mt-1.5 text-[10px] opacity-40">{t('helpImage')}</p>
        </div>

        {/* Core Info */}
        <div className="flex flex-col gap-6 text-start md:col-span-2">
          <div className="flex flex-col gap-1.5 text-start">
            <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
              Display Title
            </label>
            <input
              {...register('title')}
              className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.title ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
              placeholder="e.g. Silk Chiffon Khimar"
            />
            {errors.title && (
              <p className="text-start text-[10px] font-medium text-red-500">
                {errors.title.message}
              </p>
            )}
            <p className="text-[10px] opacity-40">{t('helpTitle')}</p>
          </div>

          <input type="hidden" {...register('slug')} />
        </div>

        {/* Pricing & Fabric */}
        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            Price ({tc('egp')})
          </label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.price ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
          />
          <p className="text-[10px] opacity-40">{t('helpPrice')}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tp('fabric')}
          </label>
          <input
            {...register('fabric_type')}
            className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.fabric_type ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
            placeholder="e.g. Medine Silk"
          />
          <p className="text-[10px] opacity-40">{t('helpFabric')}</p>
        </div>

        {/* Sensory Details */}
        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tp('opacity')} (1-5)
          </label>
          <select
            {...register('opacity_scale')}
            className="rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 ring-black/5 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v} {v === 5 ? `(${tp('opaque')})` : ''}
              </option>
            ))}
          </select>
          <p className="text-[10px] opacity-40">{t('helpOpacity')}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-start">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('visibility')}
          </label>
          <select
            {...register('is_active')}
            className="rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 ring-black/5 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
          >
            <option value="true">{t('active')}</option>
            <option value="false">{t('archived')}</option>
          </select>
          <p className="text-[10px] opacity-40">{t('helpVisibility')}</p>
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-1.5 text-start md:col-span-2">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            {t('primaryCategory')}
          </label>
          <select
            {...register('category_id')}
            className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.category_id ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_ar} / {cat.name_en}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-start text-[10px] font-medium text-red-500">
              {errors.category_id.message}
            </p>
          )}
          <p className="text-[10px] opacity-40">{t('helpCategory')}</p>
        </div>

        {/* Origin */}
        <div className="flex flex-col gap-6 border-t border-[#2C3E35]/5 pt-8 text-start md:col-span-2">
          <div className="flex flex-col gap-4 rounded-2xl bg-[#F5F5F5] p-6 text-start">
            <div className="flex items-center justify-between text-start">
              <div className="flex items-center gap-3 text-start">
                <Globe className="h-4 w-4 opacity-30" />
                <span className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
                  {tc('madeInEgypt')}
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
            <p className="text-[10px] opacity-40">{t('helpMadeInEgypt')}</p>
          </div>
        </div>

        <div className="text-start md:col-span-2">
          <label className="text-start text-[10px] font-bold tracking-widest uppercase opacity-60">
            Detailed Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1.5 w-full rounded-xl bg-white px-4 py-3.5 text-start text-sm shadow-sm ring-1 ring-black/5 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
            placeholder="Describe the drape, feel, and fit..."
          />
          <p className="mt-1.5 text-[10px] opacity-40">{t('helpDescription')}</p>
        </div>

        {/* Validation Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="md:col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-[11px] font-bold text-red-600 mb-1">في حاجة ناقصة:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.title && <li className="text-[10px] text-red-500">{errors.title.message}</li>}
              {errors.fabric_type && <li className="text-[10px] text-red-500">{errors.fabric_type.message}</li>}
              {errors.category_id && <li className="text-[10px] text-red-500">لازم تختار قسم</li>}
              {errors.price && <li className="text-[10px] text-red-500">{errors.price.message}</li>}
              {errors.image_url && <li className="text-[10px] text-red-500">{errors.image_url.message}</li>}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#2C3E35] py-5 text-[11px] font-bold tracking-[0.3em] text-white uppercase shadow-xl shadow-[#2C3E35]/20 transition-all hover:bg-[#1E2B25] active:scale-95 disabled:opacity-50 md:col-span-2"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('commit')}
        </button>
      </div>
    </form>
  );
}
