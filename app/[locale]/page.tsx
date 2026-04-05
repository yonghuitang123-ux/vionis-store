/**
 * 首页 — 服务端组件
 * ─────────────────────────────────────────────────────────────────
 * 服务端预取 Shopify 产品数据，消除客户端 fetch 瀑布流，
 * 大幅降低 LCP（从 ~5s 降至 ~2s）。
 * 交互逻辑委托给客户端组件 HomeContent。
 */

import { getProductsByHandles, getBlogArticles } from '@/lib/shopify';
import { siteConfig } from '@/config/site';
import HomeContent from './HomeContent';

/* ISR: 每 10 分钟重新验证，确保新博客文章及时出现在首页 */
export const revalidate = 600;

/* 预生成所有语言版本的首页（SSG） */
export function generateStaticParams() {
  return [
    'en', 'fr', 'de', 'ja', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'da', 'fi', 'no', 'sv',
  ].map((locale) => ({ locale }));
}

export default async function Home() {
  const { grid } = siteConfig;
  let womenProducts: any[] = [];
  let menProducts: any[] = [];
  let journalArticles: { handle: string; title: string; excerpt: string; image: { url: string } | null; publishedAt?: string }[] = [];
  let newsArticles: { handle: string; title: string; excerpt: string; image: { url: string } | null; publishedAt?: string }[] = [];

  const [womenResult, menResult, journalResult, newsResult] = await Promise.allSettled([
    getProductsByHandles(grid.女装产品handles),
    getProductsByHandles(grid.男装产品handles),
    getBlogArticles('journal', 4),
    getBlogArticles('news', 4),
  ]);

  if (womenResult.status === 'fulfilled') womenProducts = womenResult.value ?? [];
  if (menResult.status === 'fulfilled')   menProducts   = menResult.value   ?? [];
  if (journalResult.status === 'fulfilled') journalArticles = journalResult.value?.articles ?? [];
  if (newsResult.status === 'fulfilled') newsArticles = newsResult.value?.articles ?? [];

  return (
    <HomeContent
      womenProducts={womenProducts}
      menProducts={menProducts}
      journalArticles={journalArticles}
      newsArticles={newsArticles}
    />
  );
}
