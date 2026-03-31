import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/cart', '/wishlist', '/account', '/search', '/_next/static/'],
      },
      // AI 爬虫专用规则 — 允许访问 llms.txt
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'PerplexityBot', 'Bytespider', 'CCBot'],
        allow: ['/llms.txt', '/llms-full.txt', '/'],
        disallow: ['/admin', '/api/', '/cart', '/wishlist', '/account'],
      },
    ],
    sitemap: 'https://vionisxy.com/sitemap.xml',
  }
}
