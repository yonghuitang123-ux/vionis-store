/**
 * robots.txt 自动生成
 * ─────────────────────────────────────────────────────────────────
 * 允许所有搜索引擎抓取，禁止敏感路径
 */

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/_next/', '/cart'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/account/', '/_next/', '/cart'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
