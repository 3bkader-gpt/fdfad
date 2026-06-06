'use client';

import { usePathname } from '@/i18n/routing';
import { SocialFollow } from './SocialFollow';

export function GlobalFooter() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <SocialFollow />
      <footer className="border-border-color bg-bg-main px-6 pt-16 pb-32 text-center transition-colors duration-300 md:pb-16">
        <div className="mx-auto max-w-xs">
          <div className="bg-brand-primary/10 mx-auto mb-8 h-px w-12" />
          <p className="text-text-primary text-[9px] font-bold tracking-[0.4em] uppercase opacity-20">
            © 2026 FADFAAD CAIRO
          </p>
          <p className="text-text-primary mt-2 text-[8px] font-medium tracking-[0.2em] uppercase opacity-10">
            The Art of Modest Drapery
          </p>
        </div>
      </footer>
    </>
  );
}
