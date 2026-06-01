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
      <footer className="border-t border-[rgba(44,62,53,0.08)] bg-[#FFFFFF] px-6 py-10 text-center dark:border-[rgba(250,250,250,0.1)] dark:bg-[#1A1A1A]">
        <p className="text-[9px] font-bold tracking-[0.3em] text-[#2C3E35] uppercase opacity-30 dark:text-[#FAFAFA]">
          © 2026 FADFAAD CAIRO
        </p>
      </footer>
    </>
  );
}
