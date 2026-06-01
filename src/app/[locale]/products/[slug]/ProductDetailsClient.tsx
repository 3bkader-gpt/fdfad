'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ShieldCheck, Truck, Star, Ruler, Maximize2, Check, X } from 'lucide-react';
import { Product } from '@/types/supabase';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

const COLOR_MAP: Record<string, string> = {
  black: '#0F0F0F',
  beige: '#D4BE9F',
  pink: '#E0A3B5',
  mocha: '#7C5C43',
  olive: '#5E6F54',
  sage: '#8B9B90',
  navy: '#1D2D44',
  grey: '#707070',
  gray: '#707070',
  plum: '#4E2A3A',
  white: '#FAFAFA',
};

export function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');

  const images = [...(product.product_images || [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const mainImageIndex =
    images.findIndex((img) => img.is_cover) !== -1 ? images.findIndex((img) => img.is_cover) : 0;

  // Active gallery index
  const [activeImgIndex, setActiveImgIndex] = useState(mainImageIndex);
  // Selected variant states
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Validation errors
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  // Zoom overlay state
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync scroll position with active index on mobile swipe
  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollPosition = scrollRef.current.scrollLeft;
      const index = Math.round(scrollPosition / width);
      // In RTL languages, scroll might go negative or reverse order depending on browser implementation,
      // but standard snaper will trigger active index nicely. We handle safety by boundary checks.
      const safeIndex = Math.min(Math.max(0, index), images.length - 1);
      if (safeIndex !== activeImgIndex) {
        setActiveImgIndex(safeIndex);
      }
    }
  };

  // Scroll to selected thumbnail on click
  const scrollToImage = (index: number) => {
    setActiveImgIndex(index);
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth',
      });
    }
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomScale === 1) {
      // Zoom in
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
      setZoomScale(2);
    } else {
      // Zoom out
      setZoomScale(1);
    }
  };

  // Prevent scroll when zoom modal is open
  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
        setZoomScale(1);
      }, 0);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isZoomOpen]);

  // Size Recommendations list parsing
  const recommendations =
    (product.size_recommendations as unknown as { size: string; weight_range: string }[]) || [];

  return (
    <main className="bg-bg-main text-text-primary min-h-screen pb-32 transition-colors duration-300">
      {/* 1. Navigation Header */}
      <nav className="border-border-color bg-bg-main/80 fixed top-0 left-0 z-[60] flex w-full items-center justify-between border-b px-6 py-4 backdrop-blur-md">
        <Link
          href="/"
          className="bg-bg-elevated hover:bg-brand-accent/5 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h1 className="font-serif text-lg font-bold tracking-tight">{tc('title')}</h1>
        <div className="w-9" />
      </nav>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-0 pt-[73px] md:grid-cols-2 md:px-6 md:pt-28">
        {/* Gallery Section */}
        <section className="flex flex-col gap-4">
          {/* Main Display Container */}
          <div className="bg-bg-elevated border-border-color relative aspect-[3/4] w-full overflow-hidden border-b md:rounded-2xl md:border">
            {images.length > 0 ? (
              <>
                {/* Horizontal Swipe list for mobile */}
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex h-full w-full snap-x snap-mandatory scrollbar-none overflow-x-auto"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {images.map((img, i) => (
                    <div key={img.url} className="relative h-full w-full flex-shrink-0 snap-start">
                      <Image
                        src={img.url}
                        alt={`${product.title} view ${i}`}
                        fill
                        className="cursor-zoom-in object-cover"
                        priority={i === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onClick={() => setIsZoomOpen(true)}
                      />
                    </div>
                  ))}
                </div>

                {/* Cover/Action Badge */}
                {product.made_in_egypt && (
                  <span className="bg-brand-primary absolute bottom-6 left-6 rounded px-4 py-1.5 text-[9px] font-bold tracking-[0.2em] text-white uppercase shadow-lg backdrop-blur-sm">
                    {tc('madeInCairo')}
                  </span>
                )}

                {/* Main Action Overlays */}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute right-6 bottom-6 rounded-full bg-black/40 p-2.5 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/60 active:scale-95"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>

                {/* Gallery Counter */}
                <div className="absolute top-6 right-6 rounded-full bg-black/40 px-2.5 py-1.5 text-[9px] font-bold tracking-widest text-white backdrop-blur-sm select-none">
                  {activeImgIndex + 1} / {images.length}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-xs tracking-widest uppercase italic opacity-20">
                {t('awaitingVisuals')}
              </div>
            )}
          </div>

          {/* Thumbnails Container */}
          {images.length > 1 && (
            <div className="flex scrollbar-none gap-3 overflow-x-auto px-6 py-2 md:px-0">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => scrollToImage(i)}
                  className={`relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    i === activeImgIndex
                      ? 'border-brand-accent scale-105 shadow-md shadow-[#C89B7E]/10'
                      : 'border-border-color opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${i}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Product Details & Purchase Section */}
        <section className="flex flex-col gap-8 px-6 md:px-0">
          {/* Header Specs */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 opacity-40">
              <span className="text-[9px] font-bold tracking-widest uppercase">
                {product.fabric_type}
              </span>
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="text-[9px] font-bold tracking-widest uppercase">
                {tc('handmade')}
              </span>
            </div>

            <h2 className="font-serif text-3xl leading-tight font-medium tracking-tight md:text-4xl">
              {product.title}
            </h2>

            <div className="border-border-color flex items-center justify-between border-b pb-5">
              <p className="text-2xl font-semibold tracking-tight text-brand-primary">
                {product.price} <span className="text-sm font-normal opacity-60">{tc('egp')}</span>
              </p>

              <div className="bg-bg-elevated ring-border-color flex items-center gap-1.5 rounded-full px-3 py-1 ring-1">
                <Star className="fill-brand-accent text-brand-accent h-3 w-3" />
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-60">
                  {t('premium')}
                </span>
              </div>
            </div>
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
                  {t('selectSize')}
                </label>
                {sizeError && (
                  <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase">
                    {t('sizeRequired')}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`flex h-[48px] min-w-[48px] items-center justify-center rounded-xl border text-xs font-bold uppercase transition-all active:scale-95 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary text-white dark:text-bg-main shadow-lg shadow-brand-primary/15'
                          : 'border-border-color text-text-primary bg-bg-elevated hover:border-brand-accent'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
                  {t('selectColor')}
                </label>
                {colorError && (
                  <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase">
                    {t('colorRequired')}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  const hexCode = COLOR_MAP[color.toLowerCase()];

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setColorError(false);
                      }}
                      className={`relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-bg-elevated border-brand-accent scale-105 shadow-md shadow-brand-accent/10'
                          : 'border-border-color bg-bg-elevated hover:border-brand-accent'
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: hexCode || '#cbd5e1' }}
                      />
                      <span>{color}</span>
                      {isSelected && <Check className="text-brand-accent ml-1 h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fit Guide Section */}
          {(product.model_height_cm || product.model_weight_kg || recommendations.length > 0) && (
            <div className="border-border-color bg-bg-elevated flex flex-col gap-5 rounded-2xl border p-6">
              <h4 className="border-border-color flex items-center gap-2 border-b pb-2 text-xs font-bold tracking-[0.15em] text-brand-primary uppercase">
                <Ruler className="text-brand-accent h-4 w-4" />
                {t('fitGuide')}
              </h4>

              {/* Model info cards */}
              {(product.model_height_cm || product.model_weight_kg || product.model_size_worn) && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  {product.model_height_cm && (
                    <div className="bg-bg-main border-border-color rounded-xl border p-2.5">
                      <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                        {tc('modelHeight')}
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {product.model_height_cm} cm
                      </span>
                    </div>
                  )}
                  {product.model_weight_kg && (
                    <div className="bg-bg-main border-border-color rounded-xl border p-2.5">
                      <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                        {tc('modelWeight')}
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {product.model_weight_kg} kg
                      </span>
                    </div>
                  )}
                  {product.model_size_worn && (
                    <div className="bg-bg-main border-border-color rounded-xl border p-2.5">
                      <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                        {tc('modelSize')}
                      </span>
                      <span className="text-brand-accent text-xs font-bold">
                        {product.model_size_worn}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations Table */}
              {recommendations.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
                    {tc('sizeRecommend')}
                  </span>
                  <div className="border-border-color bg-bg-main overflow-hidden rounded-xl border text-xs">
                    {recommendations.map((row, i) => (
                      <div
                        key={i}
                        className={`flex justify-between px-4 py-2.5 ${
                          i < recommendations.length - 1 ? 'border-border-color border-b' : ''
                        }`}
                      >
                        <span className="font-bold text-text-primary">
                          {tc('modelSize')} {row.size}
                        </span>
                        <span className="opacity-70">{row.weight_range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Specifications Cards Grid */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
              {t('specs')}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
                <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                  {t('fabric')}
                </span>
                <span className="text-xs font-medium">{product.fabric_type}</span>
              </div>

              {product.garment_length_cm && (
                <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
                  <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                    {tc('garmentLength')}
                  </span>
                  <span className="text-xs font-medium">{product.garment_length_cm} cm</span>
                </div>
              )}

              {product.season && (
                <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
                  <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                    {tc('season')}
                  </span>
                  <span className="text-xs font-medium">{product.season}</span>
                </div>
              )}

              {product.care_instructions && (
                <div className="border-border-color bg-bg-elevated col-span-2 rounded-xl border p-4">
                  <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                    {tc('careInstructions')}
                  </span>
                  <span className="text-xs font-medium">{product.care_instructions}</span>
                </div>
              )}

              <div className="border-border-color bg-bg-elevated rounded-xl border p-4">
                <span className="mb-0.5 block text-[8px] font-bold tracking-widest uppercase opacity-40">
                  {t('origin')}
                </span>
                <span className="text-xs font-medium">{tc('madeInEgypt')}</span>
              </div>

              {/* Opacity Meter */}
              <div className="border-border-color bg-bg-elevated flex flex-col justify-center gap-2 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold tracking-widest uppercase opacity-40">
                    {t('opacity')}
                  </span>
                  <span className="text-brand-accent text-[8px] font-bold uppercase">
                    {product.opacity_scale}/5
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        level <= product.opacity_scale
                          ? 'bg-brand-accent'
                          : 'bg-bg-main border-border-color/50 border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-border-color border-t pt-6">
              <h4 className="mb-3 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                {t('details')}
              </h4>
              <p className="text-sm leading-relaxed text-pretty whitespace-pre-line opacity-70">
                {product.description}
              </p>
            </div>
          )}

          {/* Shipping & Returns Info */}
          <div className="border-border-color bg-bg-elevated flex flex-col gap-4 rounded-2xl border p-6">
            <h4 className="border-border-color border-b pb-2 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
              {t('shippingTitle')}
            </h4>
            <div className="flex items-center gap-4">
              <div className="bg-bg-main ring-border-color rounded-full p-2 shadow-sm ring-1">
                <ShieldCheck className="text-brand-primary h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-tight uppercase">{tc('exchangePolicy')}</p>
                <p className="mt-0.5 text-[10px] opacity-60">{tc('easyExchange')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-bg-main ring-border-color rounded-full p-2 shadow-sm ring-1">
                <Truck className="text-brand-accent h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-tight uppercase">Cash on Delivery</p>
                <p className="text-[10px] text-pretty opacity-60">
                  Pay securely upon arrival. Fast dispatch in 2-3 days.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Mobile Add To Bag CTA */}
      <div className="border-border-color bg-bg-main/90 fixed bottom-0 left-0 z-50 w-full border-t px-6 pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />
      </div>

      {/* Desktop/Tablet Static CTA wrapper */}
      <div className="mx-auto mt-8 hidden max-w-6xl px-6 md:block">
        <div className="ml-auto w-1/2">
          <AddToCartButton
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-border-color mx-auto mt-20 max-w-6xl border-t px-6 pt-12">
          <h3 className="mb-8 text-center font-serif text-2xl font-bold tracking-tight text-brand-primary md:text-start">
            {t('relatedTitle')}
          </h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {relatedProducts.map((rel) => {
              const coverImg =
                rel.product_images?.find((img) => img.is_cover) || rel.product_images?.[0];
              return (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group flex flex-col gap-3 text-start"
                >
                  <div className="border-border-color relative aspect-[3/4] w-full overflow-hidden rounded-2xl border bg-[#F5F5F5]">
                    {coverImg ? (
                      <Image
                        src={coverImg.url}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs italic opacity-20">
                        {t('awaitingVisuals')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
                      {rel.fabric_type}
                    </span>
                    <h4 className="group-hover:text-brand-accent truncate text-sm font-medium tracking-tight text-text-primary transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-brand-primary text-xs font-bold">
                      {rel.price}{' '}
                      <span className="text-[10px] font-normal opacity-60">{tc('egp')}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox Tap-to-Zoom Modal */}
      {isZoomOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2.5 text-white shadow transition-colors hover:bg-white/20 active:scale-95"
            onClick={() => setIsZoomOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative aspect-[3/4] w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative h-full w-full origin-center transition-transform duration-300"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
              onClick={handleZoom}
            >
              <Image
                src={images[activeImgIndex].url}
                alt={`${product.title} zoomed view`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          <div className="absolute bottom-6 rounded-full bg-black/40 px-4 py-2 text-[10px] tracking-wider text-white uppercase backdrop-blur-sm">
            {zoomScale === 1 ? 'Tap image to zoom 2x' : 'Tap to zoom out'}
          </div>
        </div>
      )}
    </main>
  );
}
