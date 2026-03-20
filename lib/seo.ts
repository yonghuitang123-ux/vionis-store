/**
 * SEO 工具函数 — hreflang 与 canonical 生成
 * ─────────────────────────────────────────────────────────────────
 */

import { locales } from '@/lib/i18n/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisy.com';

/**
 * 为给定路径生成 alternates（canonical + hreflang）
 * @param path 不含 locale 的路径，例如 "/products/foo" 或 ""（首页）
 */
export function buildAlternates(path: string) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
  }
  // x-default 指向英文版
  languages['x-default'] = `${SITE_URL}/en${cleanPath === '/' ? '' : cleanPath}`;

  return {
    canonical: `${SITE_URL}/en${cleanPath === '/' ? '' : cleanPath}`,
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
