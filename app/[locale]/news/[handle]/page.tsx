/**
 * News 文章详情页 — Server Component (ISR)
 * ─────────────────────────────────────────────────────────────────
 * 从 Shopify Storefront API 拉取单篇文章全文
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { type CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import PlaceholderImage from '@/components/PlaceholderImage';
import { getBlogArticleByHandle } from '@/lib/shopify';
import { buildAlternates, defaultOgImage } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

export const revalidate = 3600; // ISR: 1 小时

// ─── 类型 ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ handle: string; locale: string }>;
}

// ─── 数据解析 ──────────────────────────────────────────────────────────────────

interface ResolvedArticle {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  contentHtml: string;
}

async function resolveArticle(handle: string): Promise<ResolvedArticle | null> {
  try {
    const article = await getBlogArticleByHandle('news', handle);
    if (article) {
      return {
        title: article.title,
        excerpt: article.excerpt || '',
        date: article.publishedAt || '',
        author: article.authorV2?.name || 'VIONIS·XY',
        image: article.image?.url || '',
        contentHtml: article.contentHtml || '',
      };
    }
  } catch {
    // API 失败
  }
  return null;
}

// ─── SEO 元数据 ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const article = await resolveArticle(handle);
  if (!article) {
    return { title: 'Article Not Found — VIONIS·XY' };
  }
  return {
    title: `${article.title} — VIONIS·XY`,
    description: article.excerpt || article.title,
    alternates: buildAlternates(`/news/${handle}`),
    openGraph: {
      title: `${article.title} — VIONIS·XY`,
      description: article.excerpt || article.title,
      siteName: 'VIONIS·XY',
      type: 'article',
      locale,
      alternateLocale: ['en','fr','de','ja','it','es','pt','nl','pl','cs','da','fi','no','sv'].filter(l => l !== locale),
      images: article.image ? [{ url: article.image }] : [defaultOgImage],
    },
  };
}

// ─── 日期格式化 ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string, locale: string) {
  try {
    return new Date(dateStr).toLocaleDateString(locale === 'en' ? 'en-US' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── 样式常量 ──────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  backgroundColor: '#E8DFD6',
  minHeight: '100vh',
  paddingBottom: 80,
};

const containerStyle: CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '0 24px',
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 36,
  fontWeight: 400,
  lineHeight: 1.2,
  color: '#1a1a1a',
  textAlign: 'center',
  marginTop: 12,
  marginBottom: 16,
};

const metaRowStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: '0.06em',
  color: '#666',
  textAlign: 'center',
  marginBottom: 40,
  display: 'flex',
  justifyContent: 'center',
  gap: 16,
};

const imageWrapperStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 10',
  overflow: 'hidden',
  marginBottom: 48,
  backgroundColor: '#E8DFD6',
};

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 15,
  fontWeight: 300,
  lineHeight: 1.9,
  color: '#333',
};

const backLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#A05E46',
  textDecoration: 'none',
  marginTop: 56,
  transition: 'opacity 0.2s',
};

// ─── HTML 内容组件 ──────────────────────────────────────────────────────────────

async function ArticleHtml({ html, style }: { html: string; style: CSSProperties }) {
  let cleanHtml = html;
  try {
    const { sanitizeShopifyHtml } = await import('@/utils/sanitizeShopifyHtml');
    cleanHtml = sanitizeShopifyHtml(html);
  } catch {
    cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return <div style={style} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

// ─── 页面组件 ──────────────────────────────────────────────────────────────────

export default async function NewsArticlePage({ params }: PageProps) {
  const { handle, locale } = await params;
  const dict = await getDictionary((locale || 'en') as Locale);
  const article = await resolveArticle(handle);

  if (!article) {
    notFound();
  }

  // JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'VIONIS·XY',
    },
    ...(article.date ? { datePublished: article.date } : {}),
    ...(article.image ? { image: article.image } : {}),
  };

  return (
    <div style={pageStyle}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={containerStyle}>
        {/* 面包屑 */}
        <div style={{ paddingTop: 24, marginBottom: 24 }}>
          <Breadcrumb
            items={[
              { label: dict.common?.home || 'Home', href: '/' },
              { label: dict.nav?.news || 'News', href: '/news' },
              { label: article.title },
            ]}
          />
        </div>

        {/* 标题 */}
        <h1 style={titleStyle}>{article.title}</h1>

        {/* 日期 & 作者 */}
        <div style={metaRowStyle}>
          {article.date && <span>{formatDate(article.date, locale)}</span>}
          {article.date && article.author && (
            <span style={{ color: '#ccc' }}>·</span>
          )}
          {article.author && <span>{article.author}</span>}
        </div>

        {/* 封面大图 */}
        {article.image && (
          <div style={imageWrapperStyle}>
            <PlaceholderImage
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* 正文内容 */}
        {article.contentHtml ? (
          <ArticleHtml html={article.contentHtml} style={bodyStyle} />
        ) : (
          <div style={bodyStyle}>
            <p>{article.excerpt}</p>
          </div>
        )}

        {/* 返回链接 */}
        <Link href="/news" style={backLinkStyle}>
          ← {dict.nav?.news || 'News'}
        </Link>
      </div>
    </div>
  );
}
