/**
 * SEO 工具函数 — hreflang 与 canonical 生成
 * ─────────────────────────────────────────────────────────────────
 */

import { locales } from '@/lib/i18n/config';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com').trim().replace(/\/+$/, '');

/**
 * 为给定路径生成 alternates（canonical + hreflang）
 * @param path 不含 locale 的路径，例如 "/products/foo" 或 ""（首页）
 */
export function buildAlternates(path: string) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const isHome = cleanPath === '/' || cleanPath === '';
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    if (locale === 'en') {
      // 英文是默认语言，不加 /en 前缀
      languages[locale] = isHome ? SITE_URL : `${SITE_URL}${cleanPath}`;
    } else {
      languages[locale] = `${SITE_URL}/${locale}${isHome ? '' : cleanPath}`;
    }
  }
  // x-default 指向英文版（无前缀）
  languages['x-default'] = isHome ? SITE_URL : `${SITE_URL}${cleanPath}`;

  return {
    canonical: isHome ? SITE_URL : `${SITE_URL}${cleanPath}`,
    languages,
  };
}

/**
 * 标准 OG 图片配置
 */
export const defaultOgImage = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'VIONIS·XY — Rare Cashmere & Seamless Merino',
};
