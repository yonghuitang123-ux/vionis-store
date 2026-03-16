import type { Metadata } from 'next';
import { Cormorant, Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import { ToastProvider } from '@/components/Toast';
import ClientShell from './ClientShell';

const cormorant = Cormorant({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant-garamond',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com';

export const metadata: Metadata = {
  title: 'VIONIS·XY — Rare Cashmere & Seamless Merino',
  description:
    'Handcrafted luxury knitwear from the finest natural fibres. Premium cashmere and merino wool.',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'VIONIS·XY — Rare Cashmere & Seamless Merino',
    description:
      'Handcrafted luxury knitwear from the finest natural fibres.',
    siteName: 'VIONIS·XY',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VIONIS·XY — Rare Cashmere & Seamless Merino' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIONIS·XY — Rare Cashmere & Seamless Merino',
    description: 'Handcrafted luxury knitwear from the finest natural fibres.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://vionisxy.myshopify.com" />
        <link rel="dns-prefetch" href="https://vionisxy.myshopify.com" />
      </head>
      <body
        className={`${cormorant.variable} ${cormorantGaramond.variable} ${montserrat.variable} antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <div style={{ paddingTop: 200 }}>{children}</div>
              <ClientShell />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
