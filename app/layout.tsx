import type { Metadata } from 'next';
import { Cormorant, Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import CartDrawer from '@/components/CartDrawer';
import NewsletterPopup from '@/components/NewsletterPopup';
import ScrollToTop from '@/components/ScrollToTop';
import { ToastProvider } from '@/components/Toast';
import NProgress from '@/components/NProgress';

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
  openGraph: {
    title: 'VIONIS·XY — Rare Cashmere & Seamless Merino',
    description:
      'Handcrafted luxury knitwear from the finest natural fibres.',
    siteName: 'VIONIS·XY',
    type: 'website',
    images: [{ url: '/logo1.png', width: 200, height: 70, alt: 'VIONIS·XY' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${cormorantGaramond.variable} ${montserrat.variable} antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <NProgress />
              <Header />
              <div style={{ paddingTop: 200 }}>{children}</div>
              <CartDrawer />
              <NewsletterPopup />
              <ScrollToTop />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
