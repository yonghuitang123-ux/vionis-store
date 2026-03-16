/**
 * Shopify CDN 图片 loader
 * ─────────────────────────────────────────────────────────────────
 * 让 next/image 直接生成 Shopify CDN URL（带 &width= 参数），
 * 跳过 Vercel /_next/image 代理层，减少 LCP ~200-500ms。
 *
 * Shopify CDN 自动返回 WebP/AVIF（根据 Accept header），
 * 所以不需要 Vercel 做格式转换。
 */

import type { ImageLoaderProps } from 'next/image';

export default function shopifyImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // 只处理 Shopify CDN 图片
  if (!src.includes('cdn.shopify.com')) {
    // 非 Shopify 图片走 Next.js 默认优化
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  }

  // Shopify CDN 支持 &width=N 参数
  const url = new URL(src);
  url.searchParams.set('width', String(width));
  if (quality) {
    url.searchParams.set('quality', String(quality));
  }
  return url.toString();
}
