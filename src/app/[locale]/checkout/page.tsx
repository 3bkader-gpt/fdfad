'use client';

import { useCart, CartItem } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, Link } from '@/i18n/routing';
import { createOrder } from './actions';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatedOrderButton } from '@/components/ui/AnimatedOrderButton';
import { Toast } from '@/components/ui/Toast';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Enter a valid Egyptian phone number'),
  governorate: z.string().min(1, 'Please select your governorate'),
  address: z.string().min(10, 'Please provide a detailed address'),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const GOVERNORATES_EN = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Dakahlia',
  'Red Sea',
  'Beheira',
  'Fayoum',
  'Gharbia',
  'Ismailia',
  'Menofia',
  'Minya',
  'Qalyubia',
  'New Valley',
  'Suez',
  'Aswan',
  'Assiut',
  'Beni Suef',
  'Port Said',
  'Damietta',
  'Sharqia',
  'South Sinai',
  'Kafr El Sheikh',
  'Matrouh',
  'Luxor',
  'Qena',
  'North Sinai',
  'Sohag',
].sort();

const GOVERNORATES_AR = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'البحر الأحمر',
  'البحيرة',
  'الفيوم',
  'الغربية',
  'الإسماعيلية',
  'المنوفية',
  'المنيا',
  'القليوبية',
  'الوادي الجديد',
  'السويس',
  'أسوان',
  'أسيوط',
  'بني سويف',
  'بورسعيد',
  'دمياط',
  'الشرقية',
  'جنوب سيناء',
  'كفر الشيخ',
  'مطروح',
  'الأقصر',
  'قنا',
  'شمال سيناء',
  'سوهاج',
].sort((a, b) => a.localeCompare(b, 'ar'));

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [mountedItems, setMountedItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const t = useTranslations('Checkout');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const GOVERNORATES = isArabic ? GOVERNORATES_AR : GOVERNORATES_EN;

  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMountedItems(items);
    setIsMounted(true);
  }, [items]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const cartTotal = useMemo(() => total(), [total]);

  const handleCheckout = async () => {
    // Manually trigger validation before animation
    const isValid = await trigger();
    if (!isValid) return;

    return new Promise<void>((resolve, reject) => {
      handleSubmit(async (values) => {
        try {
          const result = await createOrder({
            customer_name: values.fullName,
            phone_number: values.phone,
            governorate: values.governorate,
            address: values.address,
            notes: values.notes,
            total_amount: cartTotal,
            items: mountedItems.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price_at_purchase: item.product.price,
              selected_size: item.selectedSize || null,
              selected_color: item.selectedColor || null,
            })),
          });

          if (result.success) {
            // Redirect to success page with order ID
            router.push(`/checkout/success?id=${result.id}`);
            clearCart();
            resolve();
          } else {
            setSubmitError(result.error || t('errorGeneric'));
            reject(new Error(result.error));
          }
        } catch (e: unknown) {
          const error = e as Error;
          console.error(error.message);
          setSubmitError(error.message);
          reject(error);
        }
      })();
    });
  };

  if (!isMounted) {
    return <div className="bg-bg-main min-h-screen" />;
  }

  if (mountedItems.length === 0) {
    return (
      <div className="bg-bg-main text-text-primary flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-bold">{t('empty')}</h2>
        <p className="mt-2 text-sm opacity-60">Add some curated items before checking out.</p>
        <Link
          href="/"
          className="bg-brand-primary mt-8 rounded-full px-8 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:scale-105"
        >
          {tc('back')}
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-bg-main text-text-primary min-h-screen pb-[calc(3rem+env(safe-area-inset-bottom))] transition-colors duration-300">
      {submitError && (
        <Toast message={submitError} type="error" onClose={() => setSubmitError(null)} />
      )}
      <nav className="border-border-color bg-bg-elevated flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="bg-bg-main rounded-full p-2 transition-colors hover:bg-zinc-100">
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h1 className="font-serif text-lg font-bold tracking-tight">{t('title')}</h1>
        <div className="w-9" />
      </nav>

      <div className="mx-auto max-w-md px-6 pt-8 text-start">
        <div className="bg-bg-elevated ring-border-color mb-8 rounded-2xl p-6 shadow-sm ring-1">
          <h2 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
            {t('summary')}
          </h2>
          <div className="flex flex-col gap-3">
            {mountedItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                className="flex justify-between text-sm"
              >
                <span className="truncate pr-4 opacity-70">
                  {item.quantity}x {item.product.title}
                  {(item.selectedSize || item.selectedColor) && (
                    <span className="mt-0.5 block text-[10px] opacity-60">
                      {[item.selectedSize, item.selectedColor].filter(Boolean).join(' / ')}
                    </span>
                  )}
                </span>
                <span className="font-medium whitespace-nowrap">
                  {item.product.price * item.quantity} {tc('egp')}
                </span>
              </div>
            ))}
            <div className="border-border-color mt-2 flex items-center justify-between border-t pt-4">
              <span className="text-xs font-bold tracking-widest uppercase">{t('total')}</span>
              <span className="text-text-primary text-xl font-bold">
                {cartTotal} {tc('egp')}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[#4A7C59]">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>

        <form className="flex flex-col gap-6">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
            {t('details')}
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              {t('fullName')}
            </label>
            <input
              {...register('fullName')}
              className={`bg-bg-elevated rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.fullName ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'}`}
              placeholder="Arwa Mahmoud"
            />
            {errors.fullName && (
              <p className="text-[10px] font-medium text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              {t('phone')}
            </label>
            <input
              {...register('phone')}
              inputMode="tel"
              className={`bg-bg-elevated rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.phone ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'}`}
              placeholder="01xxxxxxxxx"
            />
            {errors.phone && (
              <p className="text-[10px] font-medium text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              {t('governorate')}
            </label>
            <select
              {...register('governorate')}
              className={`bg-bg-elevated rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.governorate ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'}`}
            >
              <option value="">{isArabic ? 'اختاري محافظتك' : 'Select Region'}</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.governorate && (
              <p className="text-[10px] font-medium text-red-500">{errors.governorate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              {t('address')}
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className={`bg-bg-elevated rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.address ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'}`}
              placeholder="Building #, Street name, District..."
            />
            {errors.address && (
              <p className="text-[10px] font-medium text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              {t('notes')}
            </label>
            <input
              {...register('notes')}
              className="bg-bg-elevated ring-border-color focus:ring-brand-accent/30 rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none"
              placeholder="Special delivery instructions..."
            />
          </div>

          <div className="mt-4">
            <AnimatedOrderButton
              onClick={handleCheckout}
              idleLabel={t('confirmOrder', { total: cartTotal })}
              successLabel={t('success')}
              className="shadow-brand-primary/20 shadow-xl"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
