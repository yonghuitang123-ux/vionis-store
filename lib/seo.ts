/**
 * SEO 工具函数 — hreflang 与 canonical 生成
 * ─────────────────────────────────────────────────────────────────
 */

import { locales } from '@/lib/i18n/config';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com').trim().replace(/\/+$/, '');

/**
 * 为给定路径生成 alternates（canonical + hreflang）
 * @param path   不含 locale 的路径，例如 "/products/foo" 或 ""（首页）
 * @param locale 当前页面的 locale，canonical 将指向该语言版本
 */
export function buildAlternates(path: string, locale: string = 'en') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const isHome = cleanPath === '/' || cleanPath === '';
  const languages: Record<string, string> = {};
  for (const l of locales) {
    if (l === 'en') {
      languages[l] = isHome ? SITE_URL : `${SITE_URL}${cleanPath}`;
    } else {
      languages[l] = `${SITE_URL}/${l}${isHome ? '' : cleanPath}`;
    }
  }
  // x-default 指向英文版（无前缀）
  languages['x-default'] = isHome ? SITE_URL : `${SITE_URL}${cleanPath}`;

  // canonical 指向当前语言版本
  const canonical =
    locale === 'en' || !locale
      ? isHome ? SITE_URL : `${SITE_URL}${cleanPath}`
      : `${SITE_URL}/${locale}${isHome ? '' : cleanPath}`;

  return { canonical, languages };
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
