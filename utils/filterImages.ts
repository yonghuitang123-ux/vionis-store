/**
 * 按选中颜色过滤产品图片
 * ─────────────────────────────────────────────────────────────────
 * 逻辑与 layout.liquid 中的 filterImages 保持一致：
 *   A. alt 包含当前颜色 → 显示
 *   B. alt 包含其他颜色 → 隐藏
 *   C. alt 不含任何颜色（通用图）→ 显示
 */

import { PRODUCT_COLORS, type ProductColor } from '@/constants/colors';

export interface MediaItem {
  url: string;
  altText?: string | null;
  alt?: string | null;
  width?: number;
  height?: number;
}

/** 检查 alt 是否包含「其他颜色」（非当前颜色） */
function isOtherColor(alt: string, currentColor: string): boolean {
  const altLower = alt.toLowerCase().trim();
  const currentLower = currentColor.toLowerCase().trim();

  return PRODUCT_COLORS.some(
    (c) => c !== currentLower && altLower.includes(c),
  );
}

/** 检查选中的值是否为有效颜色（用于判断是否应用过滤） */
export function isValidColor(value: string): boolean {
  const val = value.toLowerCase().trim();
  return PRODUCT_COLORS.includes(val as any);
}

/**
 * 根据选中颜色过滤媒体列表
 * @param media 产品图片/媒体数组
 * @param selectedColor 当前选中的颜色值（如 "Forest Night"）
 * @returns 过滤后应显示的媒体列表
 */
export function filterImagesByColor<T extends MediaItem>(
  media: T[],
  selectedColor: string | null | undefined,
): T[] {
  if (!selectedColor?.trim()) {
    return media;
  }

  const val = selectedColor.toLowerCase().trim();

  // 若选中的不是颜色（如尺码），不应用过滤
  if (!PRODUCT_COLORS.includes(val as ProductColor)) {
    return media;
  }

  return media.filter((item) => {
    const alt = (item.altText ?? item.alt ?? '').toLowerCase();

    // A. 匹配当前颜色 → 显示
    if (alt.includes(val)) {
      return true;
    }

    // B. 匹配其他颜色 → 隐藏
    if (isOtherColor(alt, val)) {
      return false;
    }

    // C. 通用图（不含任何颜色）→ 显示
    return true;
  });
}
