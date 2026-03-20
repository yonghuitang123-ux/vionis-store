import type { Metadata } from 'next';
import { Cormorant, Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import { ToastProvider } from '@/components/Toast';
import ClientShell from './ClientShell';

const cormorant = Cormorant({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant-garamond',
  subsets: ['latin'],
  weight: ['300', '400'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com').replace(/\/+$/, '');

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
        <link rel="preconnect" href="https://vionisxy.myshopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vionisxy.myshopify.com" />
        {/* Preload LCP hero image — mobile only (sizes=50vw → DPR picks w=640) */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0961%2F1965%2F2627%2Ffiles%2FVIONIS_XY_4.webp%3Fv%3D1773731718&w=640&q=70"
          media="(max-width: 749px)"
          fetchPriority="high"
        />
        {/* Preload LCP hero image — desktop */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0961%2F1965%2F2627%2Ffiles%2FVIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp%3Fv%3D1770369606&w=640&q=70"
          media="(min-width: 750px)"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${cormorant.variable} ${cormorantGaramond.variable} ${montserrat.variable} antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              {/* Header is rendered inside [locale]/layout.tsx so it has access to I18nProvider */}
              {children}
              <ClientShell />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
