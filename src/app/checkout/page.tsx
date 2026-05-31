'use client';

import { useCart } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createOrder } from './actions';
import { ChevronLeft, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Enter a valid Egyptian phone number'),
  governorate: z.string().min(1, 'Please select your governorate'),
  address: z.string().min(10, 'Please provide a detailed address'),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const GOVERNORATES = [
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

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const cartTotal = useMemo(() => total(), [total]);

  const handleCheckout = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createOrder({
        customer_name: values.fullName,
        phone_number: values.phone,
        governorate: values.governorate,
        address: values.address,
        notes: values.notes,
        total_amount: cartTotal,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
        })),
      });

      if (result.success) {
        clearCart();
        router.push(`/checkout/success?orderNo=${result.orderNo}`);
      } else {
        alert(result.error);
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">Your bag is empty</h2>
        <p className="mt-2 text-sm opacity-60">Add some curated items before checking out.</p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-[#2C3E35] px-8 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-[#1E2B25]"
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-12 text-[#2C3E35]">
      <nav className="flex items-center justify-between border-b border-[#2C3E35]/5 bg-white px-6 py-4">
        <Link
          href="/"
          className="rounded-full bg-[#FAFAFA] p-2 transition-colors hover:bg-zinc-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-lg font-bold tracking-tight">Checkout</h1>
        <div className="w-9" />
      </nav>

      <div className="mx-auto max-w-md px-6 pt-8">
        <div className="mb-8 rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-black/5">
          <h2 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
            Order Summary
          </h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="truncate pr-4 opacity-70">
                  {item.quantity}x {item.product.title}
                </span>
                <span className="font-medium whitespace-nowrap">
                  {item.product.price * item.quantity} EGP
                </span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-[#2C3E35]/5 pt-4 text-left">
              <span className="text-xs font-bold tracking-widest uppercase">Total to Pay</span>
              <span className="text-xl font-bold text-[#2C3E35]">{cartTotal} EGP</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[#4A7C59]">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleCheckout)} className="flex flex-col gap-6 text-left">
          <h2 className="text-left text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
            Delivery Details
          </h2>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              Full Name
            </label>
            <input
              {...register('fullName')}
              className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.fullName ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
              placeholder="Arwa Mahmoud"
            />
            {errors.fullName && (
              <p className="text-[10px] font-medium text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              Mobile Number
            </label>
            <input
              {...register('phone')}
              className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.phone ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
              placeholder="01xxxxxxxxx"
            />
            {errors.phone && (
              <p className="text-[10px] font-medium text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              Governorate
            </label>
            <select
              {...register('governorate')}
              className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.governorate ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
            >
              <option value="">Select Region</option>
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

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60">
              Detailed Address
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className={`rounded-xl bg-white px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${errors.address ? 'ring-red-200 focus:ring-red-100' : 'ring-black/5 focus:ring-[#C89B7E]/30'}`}
              placeholder="Building #, Street name, District..."
            />
            {errors.address && (
              <p className="text-[10px] font-medium text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-left text-[10px] font-bold tracking-widest uppercase opacity-60">
              Notes (Optional)
            </label>
            <input
              {...register('notes')}
              className="rounded-xl bg-white px-4 py-3.5 text-left text-sm shadow-sm ring-1 ring-black/5 transition-all focus:ring-2 focus:ring-[#C89B7E]/30 focus:outline-none"
              placeholder="Special delivery instructions..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#2C3E35] py-5 text-[11px] font-bold tracking-[0.25em] text-white uppercase shadow-xl shadow-[#2C3E35]/20 transition-all hover:bg-[#1E2B25] active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Confirm Order — ${cartTotal} EGP`
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
