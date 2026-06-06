'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface ZoomOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productTitle: string;
  zoomScale: number;
  zoomPosition: { x: number; y: number };
  onZoomToggle: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function ZoomOverlay({
  isOpen,
  onClose,
  imageUrl,
  productTitle,
  zoomScale,
  zoomPosition,
  onZoomToggle,
}: ZoomOverlayProps) {
  const tco = useTranslations('Checkout');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Zoom"
      style={{ touchAction: 'none' }}
    >
      <button
        type="button"
        className="focus-visible:ring-brand-accent fixed top-6 right-6 z-[110] rounded-full bg-white/10 p-2.5 text-white shadow transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
        onClick={onClose}
        aria-label="Close zoom"
        autoFocus
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative flex h-full w-full items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[3/4] w-full max-w-2xl overflow-hidden">
          <div
            className="relative h-full w-full origin-center transition-transform duration-300"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            onClick={onZoomToggle}
            role="button"
            tabIndex={0}
            aria-label={zoomScale === 1 ? 'Zoom In' : 'Zoom Out'}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onZoomToggle(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }}
          >
            <Image
              src={imageUrl}
              alt={`${productTitle} zoomed view`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-6 rounded-full bg-black/40 px-4 py-2 text-[10px] tracking-wider text-white uppercase backdrop-blur-sm"
        aria-hidden="true"
      >
        {zoomScale === 1 ? tco('zoomIn') : tco('zoomOut')}
      </div>
    </div>
  );
}
