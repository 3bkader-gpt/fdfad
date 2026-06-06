'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ImageItem {
  url: string;
  is_cover: boolean;
  display_order: number;
}

interface ProductGalleryProps {
  images: ImageItem[];
  productTitle: string;
  madeInEgypt?: boolean;
  onZoomOpen: (index: number) => void;
}

export function ProductGallery({
  images,
  productTitle,
  madeInEgypt,
  onZoomOpen,
}: ProductGalleryProps) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');

  const mainImageIndex =
    images.findIndex((img) => img.is_cover) !== -1 ? images.findIndex((img) => img.is_cover) : 0;

  const [activeImgIndex, setActiveImgIndex] = useState(mainImageIndex);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollPosition = scrollRef.current.scrollLeft;
      const index = Math.round(scrollPosition / width);
      const safeIndex = Math.min(Math.max(0, index), images.length - 1);
      if (safeIndex !== activeImgIndex) {
        setActiveImgIndex(safeIndex);
      }
    }
  };

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

  return (
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
                    alt={`${productTitle} view ${i}`}
                    fill
                    className="cursor-zoom-in object-cover"
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onClick={() => onZoomOpen(i)}
                  />
                </div>
              ))}
            </div>

            {/* Cover/Action Badge */}
            {madeInEgypt && (
              <span className="bg-brand-primary dark:text-bg-main absolute bottom-6 left-6 rounded px-4 py-1.5 text-[9px] font-bold tracking-[0.2em] text-white uppercase shadow-lg backdrop-blur-sm">
                {tc('madeInEgypt')}
              </span>
            )}

            {/* Main Action Overlays */}
            <button
              type="button"
              onClick={() => onZoomOpen(activeImgIndex)}
              aria-label={t('zoomImage')}
              className="focus-visible:ring-brand-accent absolute right-6 bottom-6 rounded-full bg-black/40 p-2.5 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Gallery Counter */}
            <div
              className="absolute top-6 right-6 rounded-full bg-black/40 px-2.5 py-1.5 text-[9px] font-bold tracking-widest text-white backdrop-blur-sm select-none"
              aria-live="polite"
              aria-atomic="true"
            >
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
        <div className="flex scrollbar-none gap-3 overflow-x-auto px-6 py-2 md:px-0" role="list">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => scrollToImage(i)}
              aria-label={`${t('viewImage')} ${i + 1}`}
              aria-current={i === activeImgIndex}
              className={`focus-visible:ring-brand-accent relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:outline-none ${
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
  );
}
