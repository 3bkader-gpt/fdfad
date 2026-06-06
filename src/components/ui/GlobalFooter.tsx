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
      <footer className="border-border-color bg-bg-main px-6 pt-6 pb-24 text-center transition-colors duration-300 md:pb-12">
        <div className="mx-auto max-w-xs">
          <div className="bg-brand-primary/10 mx-auto mb-4 h-px w-8" />
          <p className="text-text-secondary text-[9px] font-bold tracking-[0.4em] uppercase">
            © 2026 FADFAAD CAIRO
          </p>
          <p className="text-text-secondary/60 mt-1 text-[8px] font-medium tracking-[0.2em] uppercase">
            The Art of Modest Drapery
          </p>

          <div className="mt-4 flex flex-col items-center justify-center gap-0.5">
            <span className="text-text-secondary/80 text-[9px] font-bold tracking-widest uppercase">
              Digital Boutique by
            </span>
            <a
              href="https://wa.me/201023100767"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary group relative text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
            >
              Qalbaz
              <span className="bg-brand-accent absolute -bottom-0.5 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
