'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Product } from '@/types/supabase';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfo } from './components/ProductInfo';
import { VariantSelector } from './components/VariantSelector';
import { FitGuide } from './components/FitGuide';
import { ProductSpecifications } from './components/ProductSpecifications';
import { ShippingInfo } from './components/ShippingInfo';
import { RelatedProducts } from './components/RelatedProducts';
import { ZoomOverlay } from './components/ZoomOverlay';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
  categoryName?: string | null;
  categorySlug?: string | null;
}

export function ProductDetailsClient({
  product,
  relatedProducts,
  categoryName,
  categorySlug,
}: ProductDetailsClientProps) {
  const tc = useTranslations('Common');
  const t = useTranslations('Products');

  const images = [...(product.product_images || [])].sort(
    (a, b) => a.display_order - b.display_order,
  );

  // Active gallery index for zoom
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  // Selected variant states
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Validation errors
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  // Zoom overlay state
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHeaderVisible(currentY <= lastScrollY.current || currentY <= 120);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleZoomToggle = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const onZoomOpen = (index: number) => {
    setActiveImgIndex(index);
    setIsZoomOpen(true);
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
    (product.size_recommendations as { size: string; weight_range: string }[]) || [];

  return (
    <main className="bg-bg-main text-text-primary min-h-screen pb-32 transition-colors duration-300">
      {/* 1. Floating Mobile Navigation Header */}
      <nav
        className={`fadfaad-dock-shell fixed inset-x-4 top-4 z-[60] flex items-center justify-between rounded-full px-4 py-2 shadow-2xl transition-all duration-500 ease-in-out md:hidden ${
          headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <Link
          href="/"
          className="bg-bg-elevated hover:bg-brand-accent/5 border border-border-color focus-visible:ring-brand-accent flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronLeft className="h-4.5 w-4.5 rtl:rotate-180" />
        </Link>
        <h1 className="text-text-primary font-serif text-lg font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
          {tc('title')}
        </h1>
        <div className="w-10" />
      </nav>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl pt-24 md:pt-28">
        {/* 2. Breadcrumbs (In-flow, static layout) */}
        {categoryName && (
          <nav aria-label="Breadcrumb" className="mb-6 px-6 md:px-0">
            <ol className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase opacity-40">
              <li>
                <Link href="/" className="transition-opacity hover:opacity-100">
                  {tc('back')}
                </Link>
              </li>
              <li className="opacity-40">/</li>
              {categorySlug && (
                <>
                  <li>
                    <Link
                      href={`/categories/${categorySlug}`}
                      className="transition-opacity hover:opacity-100"
                    >
                      {categoryName}
                    </Link>
                  </li>
                  <li className="opacity-40">/</li>
                </>
              )}
              <li className="text-text-primary line-clamp-1 max-w-[200px]">
                {product.title}
              </li>
            </ol>
          </nav>
        )}

        {/* 3. Product Grid */}
        <div className="grid grid-cols-1 gap-8 px-0 md:px-6 md:grid-cols-2">
        <ProductGallery
          images={images}
          productTitle={product.title}
          madeInEgypt={product.made_in_egypt}
          onZoomOpen={onZoomOpen}
        />

        {/* Product Details & Purchase Section */}
        <section className="flex flex-col gap-8 px-6 md:px-0">
          <ProductInfo
            title={product.title}
            price={product.price}
            fabricType={product.fabric_type}
          />

          <VariantSelector
            sizes={product.sizes || []}
            colors={product.colors || []}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeSelect={(size) => {
              setSelectedSize(size);
              setSizeError(false);
            }}
            onColorSelect={(color) => {
              setSelectedColor(color);
              setColorError(false);
            }}
            sizeError={sizeError}
            colorError={colorError}
          />

          <FitGuide
            modelHeightCm={product.model_height_cm}
            modelWeightKg={product.model_weight_kg}
            modelSizeWorn={product.model_size_worn}
            recommendations={recommendations}
          />

          <ProductSpecifications
            fabricType={product.fabric_type}
            garmentLengthCm={product.garment_length_cm}
            season={product.season}
            careInstructions={product.care_instructions}
            opacityScale={product.opacity_scale}
          />

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

          <ShippingInfo />
        </section>
      </div>
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

      <RelatedProducts products={relatedProducts} />

      <ZoomOverlay
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageUrl={images[activeImgIndex]?.url || ''}
        productTitle={product.title}
        zoomScale={zoomScale}
        zoomPosition={zoomPosition}
        onZoomToggle={handleZoomToggle}
      />
    </main>
  );
}
