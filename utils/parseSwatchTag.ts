/**
 * 解析产品 swatch tag
 * ─────────────────────────────────────────────────────────────────
 * 产品有 swatch:maozi 或 swatch:1 这样的 tag
 */

export function parseSwatchTag(tags: string[]): string | null {
  const tag = tags.find((t) => t.startsWith('swatch:'));
  return tag ? tag.split(':')[1] ?? null : null;
}
