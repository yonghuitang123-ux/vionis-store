'use client';

/**
 * Analytics — Google Analytics + Shopify Pixel
 * ─────────────────────────────────────────────────────────────────
 * 只有在用户同意 Cookie 后才加载追踪脚本。
 *
 * 环境变量：
 *   NEXT_PUBLIC_GA_ID         — Google Analytics Measurement ID (G-XXXXXXX)
 *   NEXT_PUBLIC_SHOPIFY_PIXEL_ID — Shopify Web Pixel ID (可选)
 */

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { getCookieConsent } from './CookieConsent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export default function Analytics() {
  const [consented, setConsented] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 监听 Cookie 同意
  useEffect(() => {
    if (getCookieConsent() === 'accepted') {
      setConsented(true);
      return;
    }
    const handler = () => setConsented(true);
    window.addEventListener('cookie-consent-accepted', handler);
    return () => window.removeEventListener('cookie-consent-accepted', handler);
  }, []);

  // 路由变更时发送 pageview
  useEffect(() => {
    if (!consented || !GA_ID) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    window.gtag?.('config', GA_ID, { page_path: url });
  }, [pathname, searchParams, consented]);

  if (!consented || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}

// ─── 手动事件追踪（在组件外也能调用） ──────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/** 追踪自定义事件 */
export function trackEvent(action: string, params?: Record<string, any>) {
  window.gtag?.('event', action, params);
}

/** 追踪购买转化 */
export function trackPurchase(transactionId: string, value: number, currency: string) {
  window.gtag?.('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency,
  });
}

/** 追踪加入购物车 */
export function trackAddToCart(itemName: string, value: number, currency: string) {
  window.gtag?.('event', 'add_to_cart', {
    items: [{ item_name: itemName, price: value }],
    value,
    currency,
  });
}
