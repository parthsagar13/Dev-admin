import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { BRAND_TITLE } from '@/lib/brand';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: BRAND_TITLE,
    template: `%s | Neokit`,
  },
  description:
    'Neokit — Premium Developer Assets Marketplace. HTML, React, Next.js, Vue templates, UI kits, and SaaS starters.',
  icons: {
    icon: '/brand/neokit-icon.png',
    apple: '/brand/neokit-icon.png',
  },
  openGraph: {
    type: 'website',
    title: BRAND_TITLE,
    description:
      'Browse premium website templates, admin dashboards, landing pages, and starter kits built for production.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
