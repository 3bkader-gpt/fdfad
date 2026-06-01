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
      <footer className="border-t border-[rgba(44,62,53,0.08)] dark:border-[rgba(250,250,250,0.1)] bg-[#FFFFFF] dark:bg-[#1A1A1A] px-6 py-10 text-center">
        <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 text-[#2C3E35] dark:text-[#FAFAFA]">
          © 2026 FADFAAD CAIRO
        </p>
      </footer>
    </>
  );
}
