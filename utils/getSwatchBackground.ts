/**
 * 解析 swatch 背景值
 * ─────────────────────────────────────────────────────────────────
 * 优先级：swatch.color → swatch.image → 名称推断
 */

export interface SwatchData {
  image?: { previewImage?: { url: string } };
  color?: string;
}

/** 常见颜色名 → hex 映射表 */
const COLOR_NAME_MAP: Record<string, string> = {
  'black': '#1a1a1a',
  'white': '#fafafa',
  'red': '#c0392b',
  'blue': '#2c3e8c',
  'green': '#27ae60',
  'yellow': '#f1c40f',
  'orange': '#e67e22',
  'pink': '#e91e8c',
  'purple': '#8e44ad',
  'brown': '#795548',
  'grey': '#9e9e9e',
  'gray': '#9e9e9e',
  'navy': '#1a237e',
  'beige': '#d4c5a9',
  'cream': '#f5f0e8',
  'ivory': '#fdf6e3',
  'tan': '#d2b48c',
  'khaki': '#c3b091',
  'olive': '#556b2f',
  'teal': '#008080',
  'burgundy': '#800020',
  'maroon': '#800000',
  'coral': '#ff7f50',
  'salmon': '#fa8072',
  'gold': '#c8b69e',
  'silver': '#c0c0c0',
  'charcoal': '#36454f',
  'midnight': '#191970',
  'midnight blue': '#191970',
  'heather': '#b6b6b4',
  'heather grey': '#b6b6b4',
  'heather gray': '#b6b6b4',
  'oatmeal': '#d3c4a8',
  'camel': '#c19a6b',
  'sand': '#c2b280',
  'stone': '#928e85',
  'slate': '#708090',
  'blush': '#de98ab',
  'rose': '#c08081',
  'dusty rose': '#dcae96',
  'sage': '#9caf88',
  'forest': '#228b22',
  'wine': '#722f37',
  'cocoa': '#6e4c3e',
  'mocha': '#7b5b3a',
  'espresso': '#4b3621',
  'snow': '#fffafa',
  'natural': '#f5f0e0',
  'off-white': '#faf0e6',
  'soft ivory': '#f8f4eb',
  'light grey': '#d3d3d3',
  'light gray': '#d3d3d3',
  'dark grey': '#555555',
  'dark gray': '#555555',
};

export function getSwatchBackground(swatch?: SwatchData | null, colorName?: string): string | null {
  // 1. 优先使用明确的颜色值
  if (swatch?.color) {
    const c = swatch.color.trim();
    if (c.startsWith('rgb') || c.startsWith('#')) return c;
    return `rgb(${c})`;
  }
  // 2. 按名称推断（不再使用 swatch image，纯色更干净）
  if (colorName) {
    const key = colorName.toLowerCase().trim().replace(/-/g, ' ');
    if (COLOR_NAME_MAP[key]) return COLOR_NAME_MAP[key];
    for (const [name, hex] of Object.entries(COLOR_NAME_MAP)) {
      if (key.includes(name) || name.includes(key)) return hex;
    }
  }
  // 3. 没有匹配到任何颜色时，返回中性灰（始终可点击）
  return '#b0a99f';
}
