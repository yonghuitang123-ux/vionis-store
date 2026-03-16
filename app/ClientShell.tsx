'use client';

import dynamic from 'next/dynamic';

// ─── 懒加载非首屏关键组件（减少初始 JS ~200KB+） ─────────────────────────────
const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false });
const NewsletterPopup = dynamic(() => import('@/components/NewsletterPopup'), { ssr: false });
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false });
const NProgress = dynamic(() => import('@/components/NProgress'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });
const Analytics = dynamic(() => import('@/components/Analytics'), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <NProgress />
      <CartDrawer />
      <NewsletterPopup />
      <ScrollToTop />
      <CookieConsent />
      <Analytics />
    </>
  );
}
