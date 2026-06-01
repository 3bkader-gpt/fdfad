import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { GlobalFooter } from '@/components/ui/GlobalFooter';
import { Geist, Geist_Mono, Playfair_Display, Cairo } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic'],
});

export const metadata = {
  title: 'فضفاض | Fadfaad Modest Fashion',
  description: 'The Art of Modest Drapery',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { ThemeProvider } from '@/providers/ThemeProvider';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cairo.variable}`}
    >
      <body
        className={`flex min-h-full flex-col antialiased ${locale === 'ar' ? 'font-cairo' : 'font-sans'}`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <GlobalHeader />
            {children}
            <GlobalFooter />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
