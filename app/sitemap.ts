/**
 * 自动生成 sitemap.xml
 * ─────────────────────────────────────────────────────────────────
 * 所有页面 × 14 种语言 hreflang alternates
 * 动态拉取产品、系列、博客
 */

import { MetadataRoute } from 'next';
import { getProducts, getCollections, getBlogArticles } from '@/lib/shopify';
import { locales } from '@/lib/i18n/config';

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com').replace(/\/+$/, '');

/** 为路径生成 14 种语言 alternates 的 sitemap 条目 */
function entry(
  path: string,
  freq: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap[number] {
  const isHome = path === '' || path === '/';
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    if (locale === 'en') {
      languages[locale] = isHome ? BASE : `${BASE}${path}`;
    } else {
      languages[locale] = `${BASE}/${locale}${isHome ? '' : path}`;
    }
  }
  languages['x-default'] = isHome ? BASE : `${BASE}${path}`;
  return {
    url: isHome ? BASE : `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── 静态页面 ──────────────────────────────────────────────────────────────
  const staticEntries = [
    entry('',                           'daily',   1.0),
    entry('/collections',               'daily',   0.9),
    entry('/blog',                      'weekly',  0.8),
    entry('/news',                      'weekly',  0.8),
    entry('/pages/our-story',           'monthly', 0.6),
    entry('/pages/sustainability',      'monthly', 0.6),
    entry('/pages/craftsmanship',       'monthly', 0.6),
    entry('/pages/size-guide',          'monthly', 0.6),
    entry('/pages/shipping',            'monthly', 0.6),
    entry('/pages/returns',             'monthly', 0.6),
    entry('/pages/wholesale',           'monthly', 0.5),
    entry('/pages/careers',             'monthly', 0.4),
    entry('/pages/contact',             'monthly', 0.5),
    entry('/policies/privacy-policy',   'yearly',  0.3),
    entry('/policies/refund-policy',    'yearly',  0.3),
    entry('/policies/shipping-policy',  'yearly',  0.3),
    entry('/policies/terms-of-service', 'yearly',  0.3),
    entry('/cart',                      'weekly',  0.4),
    entry('/wishlist',                  'weekly',  0.4),
  ];

  // ── 产品页（从 Shopify 动态拉取） ─────────────────────────────────────────
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts(250);
    productEntries = products.map((p: { handle: string }) =>
      entry(`/products/${p.handle}`, 'weekly', 0.9),
    );
  } catch { /* Shopify API 失败时跳过 */ }

  // ── 系列页 ────────────────────────────────────────────────────────────────
  let collectionEntries: MetadataRoute.Sitemap = [];
  try {
    const collections = await getCollections(50);
    collectionEntries = collections.map((c: { handle: string }) =>
      entry(`/collections/${c.handle}`, 'weekly', 0.85),
    );
  } catch {
    const fallback = ['cashmere', 'merino', 'new-arrivals', 'gifts'];
    collectionEntries = fallback.map((h) => entry(`/collections/${h}`, 'weekly', 0.85));
  }

  // ── 博客文章 ──────────────────────────────────────────────────────────────
  let blogEntries: MetadataRoute.Sitemap = [];
  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await getBlogArticles('news', 100);
    blogEntries = articles.map((a: { handle: string }) =>
      entry(`/blog/${a.handle}`, 'monthly', 0.7),
    );
    newsEntries = articles.map((a: { handle: string }) =>
      entry(`/news/${a.handle}`, 'monthly', 0.7),
    );
  } catch { /* 跳过 */ }

  return [...staticEntries, ...productEntries, ...collectionEntries, ...blogEntries, ...newsEntries];
}
