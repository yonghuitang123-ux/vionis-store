/**
 * 产品图片按颜色过滤时使用的颜色名单
 * ─────────────────────────────────────────────────────────────────
 * 与 layout.liquid 中的 filterImages 逻辑保持一致。
 * 新增颜色时在此补充，确保 alt 文字能正确匹配。
 */

export const PRODUCT_COLORS = [
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

export type ProductColor = (typeof PRODUCT_COLORS)[number];
