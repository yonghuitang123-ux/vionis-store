import { MetadataRoute } from 'next'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com').replace(/\/+$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/cart', '/wishlist', '/account', '/search'],
      },
      // AI 爬虫专用规则 — 允许访问 llms.txt
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'PerplexityBot', 'Bytespider', 'CCBot'],
        allow: ['/llms.txt', '/llms-full.txt', '/'],
        disallow: ['/admin', '/api/', '/cart', '/wishlist', '/account'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
