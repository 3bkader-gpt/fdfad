'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { upsertProduct } from './ProductActions';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Product, Category } from '@/types/supabase';
import { useTranslations } from 'next-intl';
import { BasicInfoSection } from './components/BasicInfoSection';
import { MediaSection } from './components/MediaSection';
import { SizeSelector } from './components/SizeSelector';
import { ColorSelector } from './components/ColorSelector';
import { SpecificationsSection } from './components/SpecificationsSection';
import { FitGuideSection } from './components/FitGuideSection';
import { ProductImageItem, SizeRecommendationItem } from '@/types/product';
import { productSchema, ProductFormValues } from './types';

const slugify = (text: string) => {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      // Support Arabic characters: \u0600-\u06FF
      .replace(/[^\w\u0600-\u06FF-]+/g, '')
      .replace(/--+/g, '-')
  );
};

const DEFAULT_CARE_INSTRUCTIONS = 'غسيل على البارد - لا يحتاج للكي بدرجة حرارة عالية';

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
  const [isSlugModified, setIsSlugModified] = useState(false);
  const router = useRouter();
  const t = useTranslations('Admin');

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
      return initialData.size_recommendations as unknown as SizeRecommendationItem[];
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
          care_instructions: DEFAULT_CARE_INSTRUCTIONS,
          model_height_cm: '165',
          model_weight_kg: '60',
          model_size_worn: '',
        },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const title = watch('title');
  const slug = watch('slug');

  // Auto-generate slug for new products or when not manually modified
  useEffect(() => {
    if (!isSlugModified && title) {
      setValue('slug', slugify(title), { shouldValidate: true });
    }
  }, [title, isSlugModified, setValue]);

  const onSlugBlur = () => {
    if (!slug && title) {
      setValue('slug', slugify(title), { shouldValidate: true });
      setIsSlugModified(false);
    }
  };

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
          className="bg-bg-elevated hover:bg-bg-main rounded-full p-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h2 className="text-text-primary font-serif text-3xl font-bold tracking-tight">
          {initialData ? t('editProduct') : t('newProduct')}
        </h2>
      </header>

      <div className="flex flex-col gap-10">
        <BasicInfoSection register={register} errors={errors} categories={categories} />

        {/* Manual Slug Override (Optional for Admin) */}
        <section className="bg-bg-elevated border-border-color flex flex-col gap-4 rounded-2xl border p-6 shadow-sm md:p-8">
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            URL Slug (Auto-generated)
          </label>
          <input
            {...register('slug')}
            onChange={() => setIsSlugModified(true)}
            onBlur={onSlugBlur}
            className={`bg-bg-main text-text-primary rounded-xl px-4 py-3 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.slug ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-[#C89B7E]/30'}`}
          />
          {errors.slug && <p className="text-[10px] text-red-500">{errors.slug.message}</p>}
          <p className="text-[10px] opacity-40">
            This is the link address for the product. It updates automatically but you can override
            it if needed.
          </p>
        </section>

        <MediaSection images={images} onChange={setImages} />
        <SizeSelector
          sizes={sizes}
          newSizeInput={newSizeInput}
          onNewSizeInputChange={setNewSizeInput}
          onAddSize={addSize}
          onRemoveSize={removeSize}
          onMoveSize={moveSize}
        />
        <ColorSelector
          colors={colors}
          newColorInput={newColorInput}
          onNewColorInputChange={setNewColorInput}
          onAddColor={addColor}
          onRemoveColor={removeColor}
          standardColors={STANDARD_COLORS}
        />
        <SpecificationsSection register={register} errors={errors} />
        <FitGuideSection
          register={register}
          sizes={sizes}
          sizeRecommendations={sizeRecommendations}
          onAddRecommendation={addRecommendationRow}
          onRemoveRecommendation={removeRecommendationRow}
          onUpdateRecommendation={updateRecommendationRow}
        />

        <input type="hidden" {...register('made_in_egypt')} />
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
