'use client';

import dynamic from 'next/dynamic';

const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false });
const NewsletterPopup = dynamic(() => import('@/components/NewsletterPopup'), { ssr: false });
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false });
const NProgress = dynamic(() => import('@/components/NProgress'), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <NProgress />
      <CartDrawer />
      <NewsletterPopup />
      <ScrollToTop />
    </>
  );
}
