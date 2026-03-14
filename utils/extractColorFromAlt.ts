/**
 * 从产品图 alt 文字提取颜色
 * ─────────────────────────────────────────────────────────────────
 * 遍历 COLORS 名单，检查 alt 是否包含该颜色名。
 * 优先匹配更长的颜色名（如 "heather grey" 先于 "grey"）。
 */

import { COLORS } from '@/constants/colors'

const SORTED_COLORS = [...COLORS].sort((a, b) => b.length - a.length)

export function extractColorFromAlt(alt: string): string | null {
  if (!alt) return null
  const lower = alt.toLowerCase()
  for (const color of SORTED_COLORS) {
    if (lower.includes(color)) return color
  }
  return null
}
