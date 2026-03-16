/**
 * 购物车页面 — 服务端入口
 * ─────────────────────────────────────────────────────────────────
 * 导出静态 metadata，实际 UI 由客户端组件 CartPageContent 渲染。
 */

import type { Metadata } from 'next';
import CartPageContent from './CartPageContent';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export function generateMetadata(): Metadata {
  return {
    title: 'Shopping Cart — VIONIS·XY',
    description: 'Review your shopping cart and proceed to checkout.',
    alternates: buildAlternates('/cart'),
    openGraph: {
      title: 'Shopping Cart — VIONIS·XY',
      description: 'Review your shopping cart and proceed to checkout.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default function CartPage() {
  return <CartPageContent />;
}
