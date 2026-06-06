'use client';

import { useState } from 'react';
import {
  Cairo,
  IBM_Plex_Sans_Arabic,
  Alexandria,
  Readex_Pro,
  Noto_Sans_Arabic,
} from 'next/font/google';
import { Ruler } from 'lucide-react';

const fontCairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
});

const fontIBM = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
});

const fontAlexandria = Alexandria({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-alexandria',
});

const fontReadex = Readex_Pro({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-readex',
});

const fontNoto = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto',
});

const FONTS = [
  { id: 'cairo', name: 'Cairo (Current)', className: fontCairo.className, style: fontCairo.style },
  { id: 'ibm', name: 'IBM Plex Sans Arabic', className: fontIBM.className, style: fontIBM.style },
  {
    id: 'alexandria',
    name: 'Alexandria',
    className: fontAlexandria.className,
    style: fontAlexandria.style,
  },
  { id: 'readex', name: 'Readex Pro', className: fontReadex.className, style: fontReadex.style },
  { id: 'noto', name: 'Noto Sans Arabic', className: fontNoto.className, style: fontNoto.style },
];

export default function FontComparisonPage() {
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);

  return (
    <div
      className={`min-h-screen bg-[#FAFAFA] p-8 text-[#2C3E35] transition-colors duration-300 dark:bg-[#111111] dark:text-[#FAFAFA]`}
    >
      {/* Controls Header */}
      <header className="mx-auto mb-12 max-w-6xl border-b border-black/10 pb-6 dark:border-white/10">
        <h1 className="mb-2 font-serif text-3xl font-bold">Typography Evaluation Sandbox</h1>
        <p className="mb-6 text-sm opacity-60">
          Compare the candidates for the new Arabic typeface across FADFAAD components.
        </p>

        <div className="flex flex-wrap gap-3">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => setSelectedFont(font)}
              className={`rounded-full px-5 py-3 text-xs font-bold transition-all ${
                selectedFont.id === font.id
                  ? 'scale-105 bg-[#2C3E35] text-white shadow-lg dark:bg-[#C89B7E] dark:text-[#111111]'
                  : 'border border-black/10 bg-white opacity-70 hover:opacity-100 dark:border-white/10 dark:bg-[#1A1A1A]'
              }`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Preview Container */}
      <div className={`mx-auto max-w-6xl ${selectedFont.className}`} style={selectedFont.style}>
        {/* Active Font Label Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-[#2C3E35]/5 px-4 py-2 dark:border-white/10 dark:bg-white/5">
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-50">
            Active Font Preview:
          </span>
          <span className="text-brand-primary text-xs font-bold">{selectedFont.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* 1. HOMEPAGE HERO MOCK */}
          <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm md:p-12 dark:border-white/5 dark:bg-[#1A1A1A]">
            <span className="mb-4 block text-[10px] font-bold tracking-widest uppercase opacity-40">
              1. Homepage Hero
            </span>
            <div className="mx-auto max-w-xl py-8 text-center">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase opacity-50">
                تشكيلة صيف ٢٠٢٦
              </span>
              <h2 className="mt-3 mb-6 font-serif text-4xl leading-tight md:text-5xl">
                فن انسياب الأقمشة المحتشمة
              </h2>
              <p className="mb-8 text-sm leading-relaxed opacity-70">
                نقدم لكِ مجموعة عبايات وإسدالات راقية صُممت بعناية في مصر، تجمع بين الأصالة والخطوط
                العصرية لتناسب ذوقكِ الرفيع في كل مناسبة.
              </p>
              <button className="rounded-full bg-[#2C3E35] px-8 py-3.5 text-xs font-bold tracking-widest text-white uppercase shadow-xl transition-transform hover:scale-105 dark:bg-[#C89B7E] dark:text-[#111111]">
                اكتشفي التشكيلة
              </button>
            </div>
          </section>

          {/* 2. PRODUCT DETAILS SECTION MOCK */}
          <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#1A1A1A]">
            <span className="mb-6 block text-[10px] font-bold tracking-widest uppercase opacity-40">
              2. Product Detail Page Elements
            </span>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Product Info Mock */}
              <div className="flex flex-col gap-6 text-start" dir="rtl">
                <div>
                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
                    كريب ناعم • صنع يدوي
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-[#2C3E35] dark:text-[#FAFAFA]">
                    عباية وردي بطبقة أمامية
                  </h3>
                  <div className="mt-2 flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/5">
                    <p className="text-brand-primary text-xl font-bold">
                      ٦٥٠ <span className="text-xs font-normal opacity-60">جنيه مصري</span>
                    </p>
                    <span className="rounded-full bg-[#2C3E35]/5 px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase opacity-60 dark:bg-white/5">
                      درجة ممتازة
                    </span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-55">
                    اكتبي المقاس
                  </label>
                  <div className="flex gap-2">
                    {['٥٢', '٥٤', '٥٦', '٥٨'].map((size, idx) => (
                      <button
                        key={size}
                        className={`flex h-[42px] min-w-[42px] items-center justify-center rounded-xl border text-xs font-bold ${idx === 1 ? 'border-brand-primary bg-brand-primary dark:text-bg-main text-white' : 'bg-bg-elevated border-black/10 dark:border-white/10'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit Guide */}
                <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-[#FAFAFA] p-4 dark:border-white/5 dark:bg-[#111111]">
                  <h4 className="text-brand-primary flex items-center gap-2 border-b border-black/5 pb-2 text-xs font-bold uppercase dark:border-white/5">
                    <Ruler className="h-3.5 w-3.5" />
                    دليل المقاس والموديل
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg border border-black/5 bg-white p-2 dark:border-white/5 dark:bg-[#1A1A1A]">
                      <span className="block text-[8px] uppercase opacity-40">طول الموديل</span>
                      <span className="font-bold">١٦٨ سم</span>
                    </div>
                    <div className="rounded-lg border border-black/5 bg-white p-2 dark:border-white/5 dark:bg-[#1A1A1A]">
                      <span className="block text-[8px] uppercase opacity-40">وزن الموديل</span>
                      <span className="font-bold">٦٥ كجم</span>
                    </div>
                    <div className="rounded-lg border border-black/5 bg-white p-2 dark:border-white/5 dark:bg-[#1A1A1A]">
                      <span className="block text-[8px] uppercase opacity-40">المقاس</span>
                      <span className="text-brand-accent font-bold">٥٦</span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between px-2 text-xs">
                    <span className="font-bold">المقاس المقترح ٥٤</span>
                    <span className="opacity-60">يناسب وزن ٦٥-٨٠ كجم</span>
                  </div>
                </div>
              </div>

              {/* Description & Spec Sheets */}
              <div className="flex flex-col gap-6 text-start" dir="rtl">
                <div>
                  <h4 className="mb-2 text-[10px] font-bold tracking-widest uppercase opacity-40">
                    التفاصيل
                  </h4>
                  <p className="text-xs leading-relaxed opacity-75">
                    عباية واسعة بتصميم أنيق ووظيفة أسلوبية مميزة مع أكمام طويلة وقصة مريحة مناسبة
                    للاستخدام اليومي والمناسبات. القماش كريب ناعم عالي الجودة ولا يشف نهائياً.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-black/5 bg-[#FAFAFA] p-3 dark:border-white/5 dark:bg-[#111111]">
                    <span className="block text-[8px] uppercase opacity-40">نوع القماش</span>
                    <span className="font-semibold">كريب ناعم (Soft Crepe)</span>
                  </div>
                  <div className="rounded-xl border border-black/5 bg-[#FAFAFA] p-3 dark:border-white/5 dark:bg-[#111111]">
                    <span className="block text-[8px] uppercase opacity-40">طول العباية</span>
                    <span className="font-semibold">١٤٥ سم</span>
                  </div>
                  <div className="rounded-xl border border-black/5 bg-[#FAFAFA] p-3 dark:border-white/5 dark:bg-[#111111]">
                    <span className="block text-[8px] uppercase opacity-40">مؤشر الشفافية</span>
                    <span className="font-semibold">٥ / ٥ (غير شفاف)</span>
                  </div>
                  <div className="rounded-xl border border-black/5 bg-[#FAFAFA] p-3 dark:border-white/5 dark:bg-[#111111]">
                    <span className="block text-[8px] uppercase opacity-40">بلد الصنع</span>
                    <span className="font-semibold">صنع في مصر 🇪🇬</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. CATEGORY GRID MOCK */}
          <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#1A1A1A]">
            <span className="mb-6 block text-[10px] font-bold tracking-widest uppercase opacity-40">
              3. Category Page Cards
            </span>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4" dir="rtl">
              {[
                {
                  name: 'عبايات كلاسيك',
                  count: '١٢ قطعة',
                  desc: 'عبايات يومية بقصات مريحة وألوان هادئة.',
                },
                {
                  name: 'إسدالات راقية',
                  count: '٨ قطع',
                  desc: 'إسدالات صلاة وخروج بخامات كريب فاخرة.',
                },
                {
                  name: 'ملابس كاجوال',
                  count: '١٥ قطعة',
                  desc: 'تونيكات فساتين وقطع منسدلة ومحتشمة.',
                },
                {
                  name: 'طرح وإكسسوارات',
                  count: '٦ قطع',
                  desc: 'طرح شيفون كريب ناعم مكملة لإطلالتكِ.',
                },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-[#FAFAFA] p-4 dark:border-white/5 dark:bg-[#111111]"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#2C3E35] dark:text-[#FAFAFA]">
                      {cat.name}
                    </h4>
                    <span className="rounded-full bg-[#2C3E35]/5 px-2 py-0.5 text-[8px] opacity-50 dark:bg-white/5">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-60">{cat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. ADMIN DASHBOARD MOCK */}
          <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#1A1A1A]">
            <span className="mb-6 block text-[10px] font-bold tracking-widest uppercase opacity-40">
              4. Admin Dashboard UI Elements
            </span>

            <div className="flex flex-col gap-6" dir="rtl">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-black/5 bg-[#FAFAFA] p-4 dark:border-white/5 dark:bg-[#111111]">
                  <span className="block text-[9px] tracking-wider uppercase opacity-55">
                    إجمالي المبيعات
                  </span>
                  <span className="text-xl font-bold text-[#4A7C59]">٤٥,٨٠٠ جنيه</span>
                  <span className="mt-1 block text-[8px] text-[#4A7C59]">
                    +١٢٪ عن الأسبوع الماضي
                  </span>
                </div>
                <div className="rounded-xl border border-black/5 bg-[#FAFAFA] p-4 dark:border-white/5 dark:bg-[#111111]">
                  <span className="block text-[9px] tracking-wider uppercase opacity-55">
                    الطلبات الجديدة
                  </span>
                  <span className="text-xl font-bold text-[#1E40AF]">٢٤ طلب جديد</span>
                  <span className="mt-1 block text-[8px] opacity-40">بانتظار التأكيد والشحن</span>
                </div>
                <div className="rounded-xl border border-black/5 bg-[#FAFAFA] p-4 dark:border-white/5 dark:bg-[#111111]">
                  <span className="block text-[9px] tracking-wider uppercase opacity-55">
                    المنتجات النشطة
                  </span>
                  <span className="text-xl font-bold text-[#C89B7E]">١٨ منتج معروض</span>
                  <span className="mt-1 block text-[8px] text-[#4A7C59]">٥ منتجات نفدت كميتها</span>
                </div>
              </div>

              {/* Data Table Mock */}
              <div className="overflow-hidden rounded-xl border border-black/5 bg-[#FAFAFA] dark:border-white/5 dark:bg-[#111111]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#2C3E35]/5 text-[9px] tracking-wider uppercase opacity-60 dark:bg-white/5">
                    <tr>
                      <th className="p-3">المنتج</th>
                      <th className="p-3">القسم الرئيسي</th>
                      <th className="p-3">السعر</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    <tr>
                      <td className="p-3 font-semibold">عباية وردي بطبقة أمامية</td>
                      <td className="p-3">عبايات</td>
                      <td className="p-3">٦٥٠ جنيه</td>
                      <td className="p-3">
                        <span className="rounded bg-[#dcfce7] px-2 py-0.5 text-[8px] font-bold text-[#166534] uppercase dark:bg-[#064e3b] dark:text-[#dcfce7]">
                          نشط
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">إسدال كريب ملكي أسود</td>
                      <td className="p-3">إسدالات</td>
                      <td className="p-3">٨90 جنيه</td>
                      <td className="p-3">
                        <span className="rounded bg-[#dcfce7] px-2 py-0.5 text-[8px] font-bold text-[#166534] uppercase dark:bg-[#064e3b] dark:text-[#dcfce7]">
                          نشط
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
