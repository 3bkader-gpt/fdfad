'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { upsertProduct } from './ProductActions';
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { MultiImageUpload } from '@/components/ui/MultiImageUpload';
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
  opacity_scale: z.string().optional(),
  fabric_type: z.string().optional(),
  made_in_egypt: z.string(),
  is_active: z.string(),
  category_id: z.string().min(1, 'Category is required'),
  garment_length_cm: z.string().optional(),
  season: z.string().optional(),
  care_instructions: z.string().optional(),
  model_height_cm: z.string().optional(),
  model_weight_kg: z.string().optional(),
  model_size_worn: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductImageItem {
  url: string;
  is_cover: boolean;
}

interface SizeRecommendationItem {
  size: string;
  weight_range: string;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const STANDARD_COLORS = [
  'Black',
  'Beige',
  'Pink',
  'Mocha',
  'Olive',
  'Sage',
  'Navy',
  'Grey',
  'Plum',
  'White',
];

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

  // Multi-image state
  const [images, setImages] = useState<ProductImageItem[]>(() => {
    if (initialData?.product_images) {
      return [...initialData.product_images]
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => ({ url: img.url, is_cover: img.is_cover }));
    }
    return [];
  });

  // Sizes list state
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [newSizeInput, setNewSizeInput] = useState('');

  // Colors list state
  const [colors, setColors] = useState<string[]>(initialData?.colors || []);
  const [newColorInput, setNewColorInput] = useState('');

  // Fit guide size recommendations state
  const [sizeRecommendations, setSizeRecommendations] = useState<SizeRecommendationItem[]>(() => {
    if (initialData?.size_recommendations) {
      try {
        return initialData.size_recommendations as unknown as SizeRecommendationItem[];
      } catch {
        return [];
      }
    }
    return [];
  });

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
          fabric_type: initialData.fabric_type || '',
          price: initialData.price.toString(),
          opacity_scale: initialData.opacity_scale?.toString() || '',
          made_in_egypt: initialData.made_in_egypt.toString(),
          is_active: initialData.is_active.toString(),
          category_id: initialData.product_categories?.[0]?.category_id || '',
          garment_length_cm: initialData.garment_length_cm?.toString() || '',
          season: initialData.season || '',
          care_instructions: initialData.care_instructions || '',
          model_height_cm: initialData.model_height_cm?.toString() || '',
          model_weight_kg: initialData.model_weight_kg?.toString() || '',
          model_size_worn: initialData.model_size_worn || '',
        }
      : {
          made_in_egypt: 'true',
          is_active: 'true',
          opacity_scale: '5',
          slug: '',
          title: '',
          description: '',
          fabric_type: '',
          price: '0',
          category_id: '',
          garment_length_cm: '',
          season: '',
          care_instructions: '',
          model_height_cm: '',
          model_weight_kg: '',
          model_size_worn: '',
        },
  });

  const title = watch('title');

  // Auto-generate slug for new products
  useEffect(() => {
    if (!isEditing && title) {
      setValue('slug', slugify(title), { shouldValidate: true });
    }
  }, [title, isEditing, setValue]);

  const addSize = () => {
    const trimmed = newSizeInput.trim().toUpperCase();
    if (trimmed && !sizes.includes(trimmed)) {
      setSizes([...sizes, trimmed]);
      setNewSizeInput('');
    }
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const moveSize = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sizes.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sizes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSizes(updated);
  };

  const addColor = () => {
    const trimmed = newColorInput.trim();
    if (trimmed && !colors.includes(trimmed)) {
      setColors([...colors, trimmed]);
      setNewColorInput('');
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addRecommendationRow = () => {
    setSizeRecommendations([...sizeRecommendations, { size: '', weight_range: '' }]);
  };

  const removeRecommendationRow = (index: number) => {
    setSizeRecommendations(sizeRecommendations.filter((_, i) => i !== index));
  };

  const updateRecommendationRow = (
    index: number,
    field: keyof SizeRecommendationItem,
    val: string,
  ) => {
    const updated = sizeRecommendations.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: val };
      }
      return row;
    });
    setSizeRecommendations(updated);
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value ?? ''));

    // Append serialized variants & images
    formData.append('sizes', JSON.stringify(sizes));
    formData.append('colors', JSON.stringify(colors));
    formData.append('size_recommendations', JSON.stringify(sizeRecommendations));
    formData.append('images', JSON.stringify(images));

    try {
      await upsertProduct(formData, initialData?.id);
      router.push('/admin/products');
    } catch (e: unknown) {
      const error = e as Error;
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-4xl flex-col gap-10 pb-20 text-start"
    >
      <header className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="bg-bg-elevated rounded-full p-2 transition-colors hover:bg-bg-main"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
          {initialData ? t('editProduct') : t('newProduct')}
        </h2>
      </header>

      {/* Upgraded Grouped Form Sections */}
      <div className="flex flex-col gap-10">
        {/* Section 1: Basic Information */}
        <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
          <h3 className="border-border-color flex items-center gap-2 border-b pb-3 font-serif text-xl font-bold text-text-primary">
            <Sparkles className="text-brand-accent h-5 w-5" />
            {t('basicInfo')}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                Display Title
              </label>
              <input
                {...register('title')}
                className={`rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.title ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
                placeholder="e.g. Silk Chiffon Khimar"
              />
              {errors.title && <p className="text-[10px] text-red-500">{errors.title.message}</p>}
              <p className="text-[10px] opacity-40">{t('helpTitle')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                Price ({tc('egp')})
              </label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                className={`rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.price ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
              />
              {errors.price && <p className="text-[10px] text-red-500">{errors.price.message}</p>}
              <p className="text-[10px] opacity-40">{t('helpPrice')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {t('primaryCategory')}
              </label>
              <select
                {...register('category_id')}
                className={`rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.category_id ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_ar} / {cat.name_en}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-[10px] text-red-500">{errors.category_id.message}</p>
              )}
              <p className="text-[10px] opacity-40">{t('helpCategory')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {t('visibility')}
              </label>
              <select
                {...register('is_active')}
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
              >
                <option value="true">{t('active')}</option>
                <option value="false">{t('archived')}</option>
              </select>
              <p className="text-[10px] opacity-40">{t('helpVisibility')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                Made in Egypt
              </label>
              <select
                {...register('made_in_egypt')}
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              <p className="text-[10px] opacity-40">{t('helpMadeInEgypt')}</p>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                Detailed Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                placeholder="Describe the drape, feel, and fit..."
              />
              <p className="text-[10px] opacity-40">{t('helpDescription')}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Media Management */}
        <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
          <h3 className="border-border-color flex items-center gap-2 border-b pb-3 font-serif text-xl font-bold text-text-primary">
            <ImageIcon className="text-brand-accent h-5 w-5" />
            {t('media')}
          </h3>
          <MultiImageUpload value={images} onChange={setImages} />
        </section>

        {/* Section 3: Sizes Selector */}
        <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
          <h3 className="border-border-color border-b pb-3 font-serif text-xl font-bold text-text-primary">
            {t('sizes')}
          </h3>

          <div className="flex max-w-sm gap-3">
            <input
              type="text"
              value={newSizeInput}
              onChange={(e) => setNewSizeInput(e.target.value)}
              placeholder="e.g. 54, S, XL"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSize();
                }
              }}
              className="flex-1 rounded-xl bg-bg-main text-text-primary px-4 py-3 text-sm shadow-sm ring-1 ring-border-color outline-none focus:ring-2 focus:ring-[#C89B7E]/30"
            />
            <button
              type="button"
              onClick={addSize}
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
                        onClick={() => moveSize(index, 'up')}
                        className="hover:text-brand-accent p-0.5"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                    )}
                    {index < sizes.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveSize(index, 'down')}
                        className="hover:text-brand-accent p-0.5"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
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

        {/* Section 4: Colors Selector */}
        <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
          <h3 className="border-border-color border-b pb-3 font-serif text-xl font-bold text-text-primary">
            {t('colors')}
          </h3>

          <div className="flex max-w-md gap-3">
            <input
              type="text"
              value={newColorInput}
              onChange={(e) => setNewColorInput(e.target.value)}
              placeholder="e.g. Beige, Olive, Mocha"
              list="standard-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor();
                }
              }}
              className="flex-1 rounded-xl bg-bg-main text-text-primary px-4 py-3 text-sm shadow-sm ring-1 ring-border-color outline-none focus:ring-2 focus:ring-[#C89B7E]/30"
            />
            <datalist id="standard-colors">
              {STANDARD_COLORS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={addColor}
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
                // simple mapping for chips
                const isKnown = STANDARD_COLORS.includes(color);
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
                      onClick={() => removeColor(index)}
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

        {/* Section 5: Specifications */}
        <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
          <h3 className="border-border-color border-b pb-3 font-serif text-xl font-bold text-text-primary">
            {t('specifications')}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tp('fabric')}
              </label>
              <input
                {...register('fabric_type')}
                className={`rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.fabric_type ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
                placeholder="e.g. Medine Silk"
              />
              <p className="text-[10px] opacity-40">{t('helpFabric')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tc('garmentLength')} (cm)
              </label>
              <input
                {...register('garment_length_cm')}
                type="number"
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                placeholder="e.g. 145"
              />
              <p className="text-[10px] opacity-40">{t('helpLength')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tc('season')}
              </label>
              <input
                {...register('season')}
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                placeholder="e.g. All Seasons, Summer"
              />
              <p className="text-[10px] opacity-40">{t('helpSeason')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tc('careInstructions')}
              </label>
              <input
                {...register('care_instructions')}
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                placeholder="e.g. Machine Wash Cold"
              />
              <p className="text-[10px] opacity-40">{t('helpCare')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tp('opacity')} (1-5)
              </label>
              <select
                {...register('opacity_scale')}
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
              >
                <option value="">Select Opacity</option>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    {v} {v === 5 ? `(${tp('opaque')})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-[10px] opacity-40">{t('helpOpacity')}</p>
            </div>
          </div>
        </section>

        {/* Section 6: Fit & Recommendations */}
        <section className="bg-bg-elevated border-border-color flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-8">
          <h3 className="border-border-color border-b pb-3 font-serif text-xl font-bold text-text-primary">
            {t('fitGuideSec')}
          </h3>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tc('modelHeight')} (cm)
              </label>
              <input
                {...register('model_height_cm')}
                type="number"
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                placeholder="e.g. 168"
              />
              <p className="text-[10px] opacity-40">{t('helpModelHeight')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tc('modelWeight')} (kg)
              </label>
              <input
                {...register('model_weight_kg')}
                type="number"
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                placeholder="e.g. 65"
              />
              <p className="text-[10px] opacity-40">{t('helpModelWeight')}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tc('modelSize')}
              </label>
              <input
                {...register('model_size_worn')}
                className="rounded-xl bg-bg-main text-text-primary px-4 py-3.5 text-sm shadow-sm ring-1 ring-border-color transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                placeholder="e.g. 56"
              />
              <p className="text-[10px] opacity-40">{t('helpModelSize')}</p>
            </div>
          </div>

          {/* Sizing Recommendations Table */}
          <div className="border-border-color flex flex-col gap-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {tc('sizeRecommend')} Mappings
              </label>
              <button
                type="button"
                onClick={addRecommendationRow}
                className="text-brand-accent flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase transition-all hover:text-[#b08264]"
              >
                <Plus className="h-3 w-3" />
                {t('addRecommendation')}
              </button>
            </div>

            {sizeRecommendations.length === 0 ? (
              <p className="text-xs italic opacity-40">
                No mappings added yet. e.g. Size 52 → 50-65kg
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {sizeRecommendations.map((row, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="grid flex-1 grid-cols-2 gap-4">
                      <select
                        value={row.size}
                        onChange={(e) => updateRecommendationRow(index, 'size', e.target.value)}
                        className="rounded-xl bg-bg-main text-text-primary px-4 py-2.5 text-sm shadow-sm ring-1 ring-border-color focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                      >
                        <option value="">Select Size</option>
                        {sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                        {/* Fallback if sizes array is empty */}
                        {sizes.length === 0 && <option value="Free Size">Free Size</option>}
                      </select>
                      <input
                        type="text"
                        value={row.weight_range}
                        onChange={(e) =>
                          updateRecommendationRow(index, 'weight_range', e.target.value)
                        }
                        placeholder="e.g. 50-65kg"
                        className="rounded-xl bg-bg-main text-text-primary px-4 py-2.5 text-sm shadow-sm ring-1 ring-border-color focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRecommendationRow(index)}
                      className="rounded-lg p-2 text-red-500 transition-all hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] opacity-40">{t('helpRecommendations')}</p>
          </div>
        </section>

        <input type="hidden" {...register('slug')} />
      </div>

      {/* Validation Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="mb-1 text-xs font-bold text-red-600">في حقول محتاجة مراجعة:</p>
          <ul className="list-inside list-disc space-y-0.5">
            {errors.title && <li className="text-[10px] text-red-500">{errors.title.message}</li>}
            {errors.fabric_type && (
              <li className="text-[10px] text-red-500">{errors.fabric_type.message}</li>
            )}
            {errors.category_id && <li className="text-[10px] text-red-500">لازم تختار قسم</li>}
            {errors.price && <li className="text-[10px] text-red-500">{errors.price.message}</li>}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-[#2C3E35] py-5 text-[11px] font-bold tracking-[0.3em] text-white uppercase shadow-xl shadow-[#2C3E35]/20 transition-all hover:bg-[#1E2B25] active:scale-95 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('commit')}
      </button>
    </form>
  );
}
