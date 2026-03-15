/**
 * 翻译文件加载器 — 按需动态导入
 */

import type { Locale } from './config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = Record<string, any>;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((m) => m.default),
  fr: () => import('@/locales/fr.json').then((m) => m.default),
  de: () => import('@/locales/de.json').then((m) => m.default),
  ja: () => import('@/locales/ja.json').then((m) => m.default),
  it: () => import('@/locales/it.json').then((m) => m.default),
  es: () => import('@/locales/es.json').then((m) => m.default),
  pt: () => import('@/locales/pt.json').then((m) => m.default),
  nl: () => import('@/locales/nl.json').then((m) => m.default),
  pl: () => import('@/locales/pl.json').then((m) => m.default),
  cs: () => import('@/locales/cs.json').then((m) => m.default),
  da: () => import('@/locales/da.json').then((m) => m.default),
  fi: () => import('@/locales/fi.json').then((m) => m.default),
  no: () => import('@/locales/no.json').then((m) => m.default),
  sv: () => import('@/locales/sv.json').then((m) => m.default),
};

/** 服务端获取翻译字典 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale];
  if (!load) return loaders.en();
  return load();
}
