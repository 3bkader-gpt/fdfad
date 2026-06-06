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
      <footer className="border-border-color bg-bg-main px-6 pt-12 pb-32 text-center transition-colors duration-300 md:pb-16">
        <div className="mx-auto max-w-xs">
          <div className="bg-brand-primary/10 mx-auto mb-6 h-px w-12" />
          <p className="text-text-primary text-[9px] font-bold tracking-[0.4em] uppercase opacity-20">
            © 2026 FADFAAD CAIRO
          </p>
          <p className="text-text-primary mt-2 text-[8px] font-medium tracking-[0.2em] uppercase opacity-10">
            The Art of Modest Drapery
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-1">
            <span className="text-text-primary text-[9px] font-bold tracking-widest uppercase opacity-20">
              Digital Boutique by
            </span>
            <a
              href="https://wa.me/201023100767"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary group relative text-[10px] font-bold tracking-[0.15em] uppercase opacity-30 transition-all hover:opacity-100"
            >
              Qalbaz
              <span className="bg-brand-accent absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
