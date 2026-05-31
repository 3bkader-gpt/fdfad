import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

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

export const metadata = {
  title: 'فضفاض | Fadfaad Modest Fashion',
  description: 'The Art of Modest Drapery',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className="flex min-h-full flex-col antialiased">
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}
