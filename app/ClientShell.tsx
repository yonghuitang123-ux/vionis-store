'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false });
const NProgress = dynamic(() => import('@/components/NProgress'), { ssr: false });

/* 非关键组件：首屏渲染完成后再加载（延迟 3s 或用户交互时） */
const NewsletterPopup = dynamic(() => import('@/components/NewsletterPopup'), { ssr: false });
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });

export default function ClientShell() {
  const [deferred, setDeferred] = useState(false);

  useEffect(() => {
    /* 3 秒后或用户首次交互时加载非关键组件 */
    const timer = setTimeout(() => setDeferred(true), 3000);
    const onInteract = () => { setDeferred(true); cleanup(); };
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('click', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
    window.addEventListener('scroll', onInteract, { once: true, passive: true });
    window.addEventListener('click', onInteract, { once: true });
    window.addEventListener('touchstart', onInteract, { once: true, passive: true });
    return cleanup;
  }, []);

  return (
    <>
      <NProgress />
      <CartDrawer />
      {deferred && (
        <>
          <NewsletterPopup />
          <ScrollToTop />
          <CookieConsent />
        </>
      )}
    </>
  );
}
