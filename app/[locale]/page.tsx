/**
 * 首页 — 服务端组件
 * ─────────────────────────────────────────────────────────────────
 * 服务端预取 Shopify 产品数据，消除客户端 fetch 瀑布流，
 * 大幅降低 LCP（从 ~5s 降至 ~2s）。
 * 交互逻辑委托给客户端组件 HomeContent。
 */

import { getCollectionByHandle, getBlogArticles } from '@/lib/shopify';
import { siteConfig } from '@/config/site';
import HomeContent from './HomeContent';

/* ISR: 每小时重新验证一次，避免每次请求都调 Shopify API */
export const revalidate = 3600;

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
  let journalArticles: { handle: string; title: string; excerpt: string; image: { url: string } | null }[] = [];

  const [womenResult, menResult, journalResult] = await Promise.allSettled([
    getCollectionByHandle(grid.女装产品系列, 4),
    getCollectionByHandle(grid.男装产品系列, 4),
    getBlogArticles('journal', 10),
  ]);

  if (womenResult.status === 'fulfilled') {
    womenProducts = womenResult.value?.products?.edges?.map((e: any) => e.node) ?? [];
  }
  if (menResult.status === 'fulfilled') {
    menProducts = menResult.value?.products?.edges?.map((e: any) => e.node) ?? [];
  }
  if (journalResult.status === 'fulfilled') {
    journalArticles = journalResult.value ?? [];
  }

  return (
    <HomeContent
      womenProducts={womenProducts}
      menProducts={menProducts}
      journalArticles={journalArticles}
    />
  );
}
