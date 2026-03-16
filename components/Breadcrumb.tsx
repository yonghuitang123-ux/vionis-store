/**
 * Breadcrumb
 * ─────────────────────────────────────────────────────────────────
 * 面包屑导航 — 服务端组件，零客户端 JS。
 *
 * 特性：
 *   · 最后一级为纯文字（当前页），其余为可点击链接
 *   · 使用 / 分隔符
 *   · 自动输出 JSON-LD BreadcrumbList 结构化数据，利于 SEO
 *   · Montserrat 字体，11px 大写，细间距
 */

import Link from 'next/link';
import { type CSSProperties } from 'react';

// ─── 类型 ────────────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// ─── 样式常量 ────────────────────────────────────────────────────────────────

const navStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 6,
};

const linkStyle: CSSProperties = {
  color: '#666',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
};

const currentStyle: CSSProperties = {
  color: '#1a1a1a',
};

const separatorStyle: CSSProperties = {
  color: '#ccc',
  userSelect: 'none',
  fontSize: 10,
};

// ─── 结构化数据生成 ──────────────────────────────────────────────────────────

function buildJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };
}

// ─── 组件 ────────────────────────────────────────────────────────────────────

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items.length) return null;

  const jsonLd = buildJsonLd(items);

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`.breadcrumb-link:hover { color: #1a1a1a !important; }`}</style>
      {/* 面包屑导航 */}
      <nav aria-label="Breadcrumb" style={navStyle}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {/* 分隔符（第一项之前不显示） */}
              {index > 0 && <span style={separatorStyle} aria-hidden>/</span>}

              {isLast || !item.href ? (
                /* 最后一项或无链接 → 纯文字 */
                <span style={currentStyle} aria-current="page">{item.label}</span>
              ) : (
                /* 前面各级 → 可点击链接 */
                <Link
                  href={item.href}
                  className="breadcrumb-link"
                  style={linkStyle}
                >
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
