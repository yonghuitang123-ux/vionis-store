/**
 * 解析 swatch 背景值，与 swatch.liquid 逻辑一致
 * ─────────────────────────────────────────────────────────────────
 * - swatch.image → 用图片作为色块背景 (url(...))
 * - swatch.color → 用颜色值作为色块背景 (hex 或 rgb)
 */

export interface SwatchData {
  image?: { previewImage?: { url: string } };
  color?: string;
}

export function getSwatchBackground(swatch?: SwatchData | null): string | null {
  if (!swatch) return null;
  if (swatch.image?.previewImage?.url) {
    return `url(${swatch.image.previewImage.url})`;
  }
  if (swatch.color) {
    const c = swatch.color.trim();
    if (c.startsWith('rgb') || c.startsWith('#')) return c;
    return `rgb(${c})`;
  }
  return null;
}
