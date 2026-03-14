/**
 * 颜色名称 → 色块背景色映射（用于 ColorSelector swatch）
 */

export const COLOR_SWATCH_MAP: Record<string, string> = {
  black: '#1a1a1a',
  white: '#f5f5f0',
  ivory: '#fffff0',
  cream: '#f5f0e8',
  beige: '#d4c5a9',
  camel: '#c19a6b',
  'classic camel': '#c19a6b',
  sand: '#d2b48c',
  tan: '#d2b48c',
  brown: '#6b4226',
  chocolate: '#3e2723',
  espresso: '#3c1414',
  navy: '#1b2a4a',
  'midnight navy': '#1b2a4a',
  blue: '#3a5a8c',
  'slate blue': '#5a7a9c',
  grey: '#8c8c8c',
  gray: '#8c8c8c',
  'charcoal grey': '#36454f',
  'heather grey': '#9a9a9a',
  red: '#8b2500',
  scarlet: '#b22222',
  burgundy: '#5c1a1b',
  bordeaux: '#5c1a1b',
  wine: '#722f37',
  green: '#3a5a3a',
  'forest night': '#2d3d2d',
  olive: '#556b2f',
  pink: '#d4a5a5',
  blush: '#de98a8',
  rose: '#b76e79',
  'rose beige': '#c4a494',
  orange: '#c65d07',
  'spiced ochre': '#c67d07',
  rust: '#a0522d',
  cocoa: '#5c3a21',
  oatmeal: '#c8b896',
  taupe: '#9e8e7e',
  khaki: '#bdb395',
  lavender: '#b4a7d6',
  fog: '#c8c8c0',
  ecru: '#c2b280',
  'soft ivory': '#f5f0e6',
  purple: '#6b4c9a',
};

export function getSwatchColor(colorValue: string): string {
  const key = colorValue.toLowerCase().trim();
  if (COLOR_SWATCH_MAP[key]) return COLOR_SWATCH_MAP[key];
  for (const [k, v] of Object.entries(COLOR_SWATCH_MAP)) {
    if (key.includes(k)) return v;
  }
  return '#ccc';
}
