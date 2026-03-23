/**
 * 首页 — 服务端组件
 * ─────────────────────────────────────────────────────────────────
 * 服务端预取 Shopify 产品数据，消除客户端 fetch 瀑布流，
 * 大幅降低 LCP（从 ~5s 降至 ~2s）。
 * 交互逻辑委托给客户端组件 HomeContent。
 */

import { getProducts, getBlogArticles } from '@/lib/shopify';
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
  let products = [];
  let journalArticles: { handle: string; title: string; excerpt: string; image: { url: string } | null }[] = [];
  try {
    products = await getProducts();
  } catch {
    // Shopify API 失败时降级为空数组，HomeContent 会显示骨架屏
  }
  try {
    journalArticles = await getBlogArticles('journal', 10);
  } catch { /* 回退到静态配置 */ }

  return <HomeContent initialProducts={products} journalArticles={journalArticles} />;
}
