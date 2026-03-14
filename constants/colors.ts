/**
 * 颜色名单 — 唯一数据源
 * ─────────────────────────────────────────────────────────────────
 * 所有颜色匹配逻辑都从这里 import，不要在其他地方硬编码。
 */

export const COLORS = [
  'black',
  'white',
  'grey',
  'gray',
  'red',
  'blue',
  'green',
  'brown',
  'pink',
  'purple',
  'navy',
  'beige',
  'ivory',
  'cream',
  'khaki',
  'tan',
  'oatmeal',
  'ecru',
  'camel',
  'cocoa',
  'charcoal grey',
  'heather grey',
  'rose beige',
  'soft ivory',
  'scarlet',
  'bordeaux',
  'slate blue',
  'midnight navy',
  'spiced ochre',
  'chocolate',
  'taupe',
  'forest night',
  'classic camel',
  'blush',
] as const;

export type ColorName = (typeof COLORS)[number];
