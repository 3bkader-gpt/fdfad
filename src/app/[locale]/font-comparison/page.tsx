'use client';

import { useState } from 'react';
import {
  Cairo,
  IBM_Plex_Sans_Arabic,
  Alexandria,
  Readex_Pro,
  Noto_Sans_Arabic,
} from 'next/font/google';
import { Star, ShieldCheck, Truck, Ruler, Play } from 'lucide-react';

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
  { id: 'alexandria', name: 'Alexandria', className: fontAlexandria.className, style: fontAlexandria.style },
  { id: 'readex', name: 'Readex Pro', className: fontReadex.className, style: fontReadex.style },
  { id: 'noto', name: 'Noto Sans Arabic', className: fontNoto.className, style: fontNoto.style },
];

export default function FontComparisonPage() {
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);

  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-[#2C3E35] p-8 dark:bg-[#111111] dark:text-[#FAFAFA] transition-colors duration-300`}>
      {/* Controls Header */}
      <header className="max-w-6xl mx-auto mb-12 border-b border-black/10 dark:border-white/10 pb-6">
        <h1 className="font-serif text-3xl font-bold mb-2">Typography Evaluation Sandbox</h1>
        <p className="opacity-60 text-sm mb-6">Compare the candidates for the new Arabic typeface across FADFAAD components.</p>
        
        <div className="flex flex-wrap gap-3">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => setSelectedFont(font)}
              className={`px-5 py-3 rounded-full text-xs font-bold transition-all ${
                selectedFont.id === font.id
                  ? 'bg-[#2C3E35] text-white dark:bg-[#C89B7E] dark:text-[#111111] shadow-lg scale-105'
                  : 'bg-white border border-black/10 dark:bg-[#1A1A1A] dark:border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Preview Container */}
      <div className={`max-w-6xl mx-auto ${selectedFont.className}`} style={selectedFont.style}>
        
        {/* Active Font Label Badge */}
        <div className="mb-8 inline-flex items-center gap-2 bg-[#2C3E35]/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 rounded-xl">
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Active Font Preview:</span>
          <span className="text-xs font-bold text-brand-primary">{selectedFont.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12">
          
          {/* 1. HOMEPAGE HERO MOCK */}
          <section className="bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-12 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-4 block">1. Homepage Hero</span>
            <div className="text-center max-w-xl mx-auto py-8">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase opacity-50">تشكيلة صيف ٢٠٢٦</span>
              <h2 className="text-4xl md:text-5xl font-serif mt-3 mb-6 leading-tight">فن انسياب الأقمشة المحتشمة</h2>
              <p className="text-sm opacity-70 leading-relaxed mb-8">
                نقدم لكِ مجموعة عبايات وإسدالات راقية صُممت بعناية في القاهرة، تجمع بين الأصالة والخطوط العصرية لتناسب ذوقكِ الرفيع في كل مناسبة.
              </p>
              <button className="bg-[#2C3E35] text-white dark:bg-[#C89B7E] dark:text-[#111111] px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-xl hover:scale-105 transition-transform">
                اكتشفي التشكيلة
              </button>
            </div>
          </section>

          {/* 2. PRODUCT DETAILS SECTION MOCK */}
          <section className="bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-6 block">2. Product Detail Page Elements</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Info Mock */}
              <div className="flex flex-col gap-6 text-start" dir="rtl">
                <div>
                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">كريب ناعم • صنع يدوي</span>
                  <h3 className="text-2xl font-bold mt-1 text-[#2C3E35] dark:text-[#FAFAFA]">عباية وردي بطبقة أمامية</h3>
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 mt-2">
                    <p className="text-xl font-bold text-brand-primary">٦٥٠ <span className="text-xs font-normal opacity-60">جنيه مصري</span></p>
                    <span className="bg-[#2C3E35]/5 dark:bg-white/5 text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase opacity-60">درجة ممتازة</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-55">اكتبي المقاس</label>
                  <div className="flex gap-2">
                    {['٥٢', '٥٤', '٥٦', '٥٨'].map((size, idx) => (
                      <button key={size} className={`flex h-[42px] min-w-[42px] items-center justify-center rounded-xl border text-xs font-bold ${idx === 1 ? 'border-brand-primary bg-brand-primary text-white dark:text-bg-main' : 'border-black/10 dark:border-white/10 bg-bg-elevated'}`}>{size}</button>
                    ))}
                  </div>
                </div>

                {/* Fit Guide */}
                <div className="border border-black/5 dark:border-white/5 rounded-2xl p-4 bg-[#FAFAFA] dark:bg-[#111111] flex flex-col gap-4">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase pb-2 border-b border-black/5 dark:border-white/5">
                    <Ruler className="h-3.5 w-3.5" />
                    دليل المقاس والموديل
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white dark:bg-[#1A1A1A] p-2 rounded-lg border border-black/5 dark:border-white/5">
                      <span className="block text-[8px] opacity-40 uppercase">طول الموديل</span>
                      <span className="font-bold">١٦٨ سم</span>
                    </div>
                    <div className="bg-white dark:bg-[#1A1A1A] p-2 rounded-lg border border-black/5 dark:border-white/5">
                      <span className="block text-[8px] opacity-40 uppercase">وزن الموديل</span>
                      <span className="font-bold">٦٥ كجم</span>
                    </div>
                    <div className="bg-white dark:bg-[#1A1A1A] p-2 rounded-lg border border-black/5 dark:border-white/5">
                      <span className="block text-[8px] opacity-40 uppercase">المقاس</span>
                      <span className="font-bold text-brand-accent">٥٦</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs px-2 mt-1">
                    <span className="font-bold">المقاس المقترح ٥٤</span>
                    <span className="opacity-60">يناسب وزن ٦٥-٨٠ كجم</span>
                  </div>
                </div>
              </div>

              {/* Description & Spec Sheets */}
              <div className="flex flex-col gap-6 text-start" dir="rtl">
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2">التفاصيل</h4>
                  <p className="text-xs leading-relaxed opacity-75">
                    عباية واسعة بتصميم أنيق ووظيفة أسلوبية مميزة مع أكمام طويلة وقصة مريحة مناسبة للاستخدام اليومي والمناسبات. القماش كريب ناعم عالي الجودة ولا يشف نهائياً.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="border border-black/5 dark:border-white/5 rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#111111]">
                    <span className="block text-[8px] opacity-40 uppercase">نوع القماش</span>
                    <span className="font-semibold">كريب ناعم (Soft Crepe)</span>
                  </div>
                  <div className="border border-black/5 dark:border-white/5 rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#111111]">
                    <span className="block text-[8px] opacity-40 uppercase">طول العباية</span>
                    <span className="font-semibold">١٤٥ سم</span>
                  </div>
                  <div className="border border-black/5 dark:border-white/5 rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#111111]">
                    <span className="block text-[8px] opacity-40 uppercase">مؤشر الشفافية</span>
                    <span className="font-semibold">٥ / ٥ (غير شفاف)</span>
                  </div>
                  <div className="border border-black/5 dark:border-white/5 rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#111111]">
                    <span className="block text-[8px] opacity-40 uppercase">بلد الصنع</span>
                    <span className="font-semibold">صنع في مصر 🇪🇬</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. CATEGORY GRID MOCK */}
          <section className="bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-6 block">3. Category Page Cards</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" dir="rtl">
              {[
                { name: 'عبايات كلاسيك', count: '١٢ قطعة', desc: 'عبايات يومية بقصات مريحة وألوان هادئة.' },
                { name: 'إسدالات راقية', count: '٨ قطع', desc: 'إسدالات صلاة وخروج بخامات كريب فاخرة.' },
                { name: 'ملابس كاجوال', count: '١٥ قطعة', desc: 'تونيكات فساتين وقطع منسدلة ومحتشمة.' },
                { name: 'طرح وإكسسوارات', count: '٦ قطع', desc: 'طرح شيفون كريب ناعم مكملة لإطلالتكِ.' },
              ].map((cat, i) => (
                <div key={i} className="border border-black/5 dark:border-white/5 rounded-2xl p-4 bg-[#FAFAFA] dark:bg-[#111111] flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-[#2C3E35] dark:text-[#FAFAFA]">{cat.name}</h4>
                    <span className="text-[8px] opacity-50 bg-[#2C3E35]/5 dark:bg-white/5 px-2 py-0.5 rounded-full">{cat.count}</span>
                  </div>
                  <p className="text-[10px] opacity-60 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. ADMIN DASHBOARD MOCK */}
          <section className="bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-6 block">4. Admin Dashboard UI Elements</span>
            
            <div className="flex flex-col gap-6" dir="rtl">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-black/5 dark:border-white/5 rounded-xl p-4 bg-[#FAFAFA] dark:bg-[#111111]">
                  <span className="block text-[9px] opacity-55 uppercase tracking-wider">إجمالي المبيعات</span>
                  <span className="text-xl font-bold text-[#4A7C59]">٤٥,٨٠٠ جنيه</span>
                  <span className="block text-[8px] text-[#4A7C59] mt-1">+١٢٪ عن الأسبوع الماضي</span>
                </div>
                <div className="border border-black/5 dark:border-white/5 rounded-xl p-4 bg-[#FAFAFA] dark:bg-[#111111]">
                  <span className="block text-[9px] opacity-55 uppercase tracking-wider">الطلبات الجديدة</span>
                  <span className="text-xl font-bold text-[#1E40AF]">٢٤ طلب جديد</span>
                  <span className="block text-[8px] opacity-40 mt-1">بانتظار التأكيد والشحن</span>
                </div>
                <div className="border border-black/5 dark:border-white/5 rounded-xl p-4 bg-[#FAFAFA] dark:bg-[#111111]">
                  <span className="block text-[9px] opacity-55 uppercase tracking-wider">المنتجات النشطة</span>
                  <span className="text-xl font-bold text-[#C89B7E]">١٨ منتج معروض</span>
                  <span className="block text-[8px] text-[#4A7C59] mt-1">٥ منتجات نفدت كميتها</span>
                </div>
              </div>

              {/* Data Table Mock */}
              <div className="border border-black/5 dark:border-white/5 rounded-xl overflow-hidden bg-[#FAFAFA] dark:bg-[#111111]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#2C3E35]/5 dark:bg-white/5 text-[9px] uppercase tracking-wider opacity-60">
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
                      <td className="p-3"><span className="bg-[#dcfce7] text-[#166534] dark:bg-[#064e3b] dark:text-[#dcfce7] px-2 py-0.5 rounded text-[8px] font-bold uppercase">نشط</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">إسدال كريب ملكي أسود</td>
                      <td className="p-3">إسدالات</td>
                      <td className="p-3">٨90 جنيه</td>
                      <td className="p-3"><span className="bg-[#dcfce7] text-[#166534] dark:bg-[#064e3b] dark:text-[#dcfce7] px-2 py-0.5 rounded text-[8px] font-bold uppercase">نشط</span></td>
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
