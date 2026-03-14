/**
 * 从产品图 alt 文字提取颜色
 * ─────────────────────────────────────────────────────────────────
 * alt 格式：VIONIS·XY [产品名] in [颜色], [描述]
 * 例如：VIONIS·XY merino tie-bonnet in scarlet, front view
 */

import { COLORS } from '@/constants/colors';

export function extractColorFromAlt(alt: string): string | null {
  const match = alt.match(/\bin\s+([^,]+)/i);
  if (!match) return null;
  const extracted = match[1].toLowerCase().trim();
  return COLORS.includes(extracted as (typeof COLORS)[number]) ? extracted : null;
}
