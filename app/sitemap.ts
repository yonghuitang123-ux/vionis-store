/**
 * 自动生成 sitemap.xml
 * ─────────────────────────────────────────────────────────────────
 * 包含：首页、产品页、系列页、博客、静态内容页
 * 利于 SEO 和搜索引擎抓取
 */

import { MetadataRoute } from 'next';
import { getProducts, getCollections, getBlogArticles } from '@/lib/shopify';
import { siteConfig } from '@/config/site';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/cart`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/account`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/account/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/account/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/pages/our-story`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/pages/sustainability`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/pages/size-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/pages/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/pages/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/pages/wholesale`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // 产品页
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts(100);
    productPages = products.map((p: { handle: string }) => ({
      url: `${BASE_URL}/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch {
    // API 失败时跳过
  }

  // 系列页（从 API 获取所有 collection）
  let collectionPages: MetadataRoute.Sitemap = [];
  try {
    const collections = await getCollections(30);
    collectionPages = collections.map((c: { handle: string }) => ({
      url: `${BASE_URL}/collections/${c.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch {
    // API 失败时使用 nav 中的 handle
    const handles = ['cashmere', 'merino', 'new-arrivals', 'gifts'];
    collectionPages = handles.map((handle) => ({
      url: `${BASE_URL}/collections/${handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  }

  // 博客文章
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const articles = await getBlogArticles('news', 50);
    if (articles.length > 0) {
      blogPages = articles.map((a: { handle: string }) => ({
        url: `${BASE_URL}/blog/${a.handle}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    } else {
      // 回退 config
      const posts = siteConfig.blog?.文章列表 ?? [];
      blogPages = posts.map((p) => {
        const slug = (p.链接 || '').replace(/^\/blog\//, '') || 'article';
        return {
          url: `${BASE_URL}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });
    }
  } catch {
    const posts = siteConfig.blog?.文章列表 ?? [];
    blogPages = posts.map((p) => {
      const slug = (p.链接 || '').replace(/^\/blog\//, '') || 'article';
      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });
  }

  return [...staticPages, ...productPages, ...collectionPages, ...blogPages];
}
