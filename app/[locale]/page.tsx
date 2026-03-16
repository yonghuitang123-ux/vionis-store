/**
 * 首页 — 服务端组件
 * ─────────────────────────────────────────────────────────────────
 * 服务端预取 Shopify 产品数据，消除客户端 fetch 瀑布流，
 * 大幅降低 LCP（从 ~5s 降至 ~2s）。
 * 交互逻辑委托给客户端组件 HomeContent。
 */

import { getProducts } from '@/lib/shopify';
import HomeContent from './HomeContent';

export default async function Home() {
  let products = [];
  try {
    products = await getProducts();
  } catch {
    // Shopify API 失败时降级为空数组，HomeContent 会显示骨架屏
  }

  return <HomeContent initialProducts={products} />;
}
