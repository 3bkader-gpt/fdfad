'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

// For components that need direct theme access, next-themes provides useTheme
export { useTheme } from 'next-themes';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false} // Disable system theme to default to light if preferred, or true if system is wanted. Usually 'light' is preferred for this brand unless user toggles.
    >
      {children}
    </NextThemesProvider>
  );
}
