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
  // Shopify CDN 图片：直连，带 &width= 参数
  if (src.includes('cdn.shopify.com')) {
    const url = new URL(src);
    url.searchParams.set('width', String(width));
    return url.toString();
  }

  // 本地图片（/logo1.png 等）或 placehold.co：直接返回原始路径
  // custom loader 模式下 /_next/image 端点不可用
  return src;
}
