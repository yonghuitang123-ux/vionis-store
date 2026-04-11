'use client';

/**
 * XCotton Shipping Protection SDK 集成
 * ─────────────────────────────────────────────────────────────────
 * 1. 根据当前 locale 设置 window.xcottonConfig
 * 2. 动态加载 sdk.js
 * 3. cartId 就绪后调用 init（refreshCallback 模式）
 * 4. 购物车变更后调用 updateWidget 刷新 SP 面板报价
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { localeCurrencyMap, type Locale } from '@/lib/i18n/config';

// ─── locale → ISO 3166 country code ────────────────────────────────────────────

const LOCALE_COUNTRY_MAP: Record<string, string> = {
  en: 'US', fr: 'FR', de: 'DE', ja: 'JP', it: 'IT',
  es: 'ES', pt: 'PT', nl: 'NL', pl: 'PL', cs: 'CZ',
  da: 'DK', fi: 'FI', no: 'NO', sv: 'SE',
};

// ─── 全局类型声明 ──────────────────────────────────────────────────────────────

declare global {
  interface Window {
    xcottonConfig?: {
      shop: string;
      country: string;
      currency: string;
      language: string;
      publicAccessToken: string;
      spWidgetSelector?: string;
    };
    xcotton?: {
      init: (opts: {
        cartId: string;
        refreshCallback?: () => Promise<void>;
      }) => Promise<void>;
      updateWidget: () => void;
    };
  }
}

// ─── SDK 脚本地址 ──────────────────────────────────────────────────────────────

const SDK_SRC = 'https://sslstaticus.xcottons.com/shopify-plugins/xmh-idc/headless/sdk.js';

// ─── 组件 ──────────────────────────────────────────────────────────────────────

export default function XCottonSDK() {
  const { cartId, lines, refreshCart } = useCart();
  const pathname = usePathname();

  const scriptLoaded = useRef(false);
  const initCartId = useRef<string | null>(null);

  // 从 URL 提取 locale
  const locale = (() => {
    const seg = pathname?.split('/').filter(Boolean)[0];
    return seg && LOCALE_COUNTRY_MAP[seg] ? seg : 'en';
  })();

  const country = LOCALE_COUNTRY_MAP[locale] || 'US';
  const currency = localeCurrencyMap[locale as Locale] || 'USD';

  // ① 设置 config + 加载 SDK 脚本（仅一次）
  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    window.xcottonConfig = {
      shop: 'vionisxy.myshopify.com',
      country,
      currency,
      language: locale,
      publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
      spWidgetSelector: '.xc-sp-container',
    };

    const script = document.createElement('script');
    script.src = SDK_SRC;
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.head.appendChild(script);
  }, [country, currency, locale]);

  // ② cartId 就绪后初始化 SDK
  useEffect(() => {
    if (!cartId || initCartId.current === cartId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tryInit = () => {
      if (cancelled) return;
      if (window.xcotton) {
        initCartId.current = cartId;
        window.xcotton
          .init({
            cartId,
            refreshCallback: async () => {
              await refreshCart();
            },
          })
          .then(() => {
            window.xcotton?.updateWidget();
          })
          .catch(() => {
            /* silenced — SDK 初始化失败不影响主流程 */
          });
      } else {
        timer = setTimeout(tryInit, 300);
      }
    };

    tryInit();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cartId, refreshCart]);

  // ③ 购物车内容变更后刷新 widget 报价
  useEffect(() => {
    if (initCartId.current) {
      window.xcotton?.updateWidget();
    }
  }, [lines]);

  return null;
}
