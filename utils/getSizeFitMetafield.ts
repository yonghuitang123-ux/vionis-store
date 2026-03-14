/**
 * 从产品 metafields 中提取尺码/版型折叠内容
 * ─────────────────────────────────────────────────────────────────
 * 匹配多种常见 namespace/key，Dawn 主题常用 descriptors.size_fit
 */

export interface ProductMetafield {
  namespace: string;
  key: string;
  value: string;
}

const SIZE_FIT_PATTERNS = [
  { ns: 'descriptors', keys: ['size_fit', 'fit', 'size'] },
  { ns: 'custom', keys: ['size_fit', 'fit_description', 'size_guide', 'fit', 'size_details', 'size'] },
  { ns: 'product', keys: ['size_fit', 'fit', 'size'] },
  { ns: 'global', keys: ['size_guide', 'size_fit'] },
];

export function getSizeFitMetafield(
  metafields: ProductMetafield[] | undefined,
): string | null {
  if (!metafields?.length) return null;

  for (const m of metafields) {
    const ns = (m.namespace ?? '').toLowerCase();
    const key = (m.key ?? '').toLowerCase();
    const val = m.value?.trim();
    if (!val) continue;

    for (const { ns: matchNs, keys } of SIZE_FIT_PATTERNS) {
      if (ns !== matchNs) continue;
      if (keys.some((k) => key === k || key.includes(k))) return val;
    }

    if (key.includes('size') || key.includes('fit')) return val;
  }

  return null;
}
