/**
 * Hreflang 标签 — 告诉搜索引擎每个页面的多语言版本
 * 放在 <head> 中，每个语言版本一个 <link rel="alternate">
 */

import { locales } from '@/lib/i18n/config';

interface HreflangTagsProps {
  currentPath: string; // 不含 locale 前缀的路径，如 /products/xxx
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com';

export default function HreflangTags({ currentPath }: HreflangTagsProps) {
  const path = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

  return (
    <>
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${SITE_URL}/${locale}${path}`}
        />
      ))}
      {/* x-default 指向英语版本 */}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/en${path}`} />
    </>
  );
}
