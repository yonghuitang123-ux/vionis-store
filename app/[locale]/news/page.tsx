/**
 * News 列表页 — Server Component (SSG)
 * ─────────────────────────────────────────────────────────────────
 * 从 Shopify Storefront API 拉取 "News" 博客下的所有文章，
 * 展示为列表：标题 + 配图 + 日期 + 摘要。
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { type CSSProperties } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import PlaceholderImage from '@/components/PlaceholderImage';
import { getBlogArticles } from '@/lib/shopify';
import { buildAlternates, defaultOgImage } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

// ─── SEO 元数据 ────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'News — VIONIS·XY',
    description:
      'The latest news and updates from VIONIS·XY. Discover our newest collections, behind-the-scenes stories, and brand announcements.',
    alternates: buildAlternates('/news'),
    openGraph: {
      title: 'News — VIONIS·XY',
      description:
        'The latest news and updates from VIONIS·XY.',
      siteName: 'VIONIS·XY',
      type: 'website',
      images: [defaultOgImage],
    },
  };
}

// ─── 样式常量 ──────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  backgroundColor: '#E8DFD6',
  minHeight: '100vh',
  paddingBottom: 80,
};

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 36,
  fontWeight: 400,
  letterSpacing: '0.15em',
  textAlign: 'center',
  color: '#1a1a1a',
  marginTop: 12,
  marginBottom: 48,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: 32,
};

const cardStyle: CSSProperties = {
  textDecoration: 'none',
  color: '#1a1a1a',
  display: 'block',
};

const imageWrapperStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '3 / 4',
  overflow: 'hidden',
  backgroundColor: '#E8DFD6',
};

const dateStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#666',
  marginTop: 16,
  marginBottom: 6,
};

const cardTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 22,
  fontWeight: 500,
  lineHeight: 1.3,
  color: '#1a1a1a',
  marginBottom: 8,
};

const excerptStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 300,
  lineHeight: 1.7,
  color: '#555',
};

// ─── 日期格式化 ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── 页面组件 ──────────────────────────────────────────────────────────────────

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary((locale || 'en') as Locale);

  // 从 Shopify API 获取 "News" 博客文章
  let articles: any[] = [];
  try {
    const apiArticles = await getBlogArticles('news', 50);
    articles = apiArticles.map((a: any) => ({
      handle: a.handle,
      title: a.title,
      excerpt: a.excerpt || '',
      date: a.publishedAt || '',
      image: a.image?.url || '',
    }));
  } catch {
    articles = [];
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* 面包屑 */}
        <div style={{ paddingTop: 24, marginBottom: 24 }}>
          <Breadcrumb
            items={[
              { label: dict.common?.home || 'Home', href: '/' },
              { label: 'News' },
            ]}
          />
        </div>

        {/* 响应式网格样式 */}
        <style dangerouslySetInnerHTML={{ __html: `
          .news-grid{grid-template-columns:1fr}
          @media(min-width:640px){.news-grid{grid-template-columns:repeat(2,1fr)}}
          @media(min-width:1024px){.news-grid{grid-template-columns:repeat(3,1fr)}}
          @media(max-width:768px){.news-grid{grid-template-columns:1fr!important;gap:40px!important}}
        ` }} />

        {/* 标题 */}
        <h1 style={titleStyle}>NEWS</h1>

        {/* 空状态 */}
        {articles.length === 0 && (
          <p style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 14,
            color: '#888',
            textAlign: 'center',
            marginTop: 48,
          }}>
            No news articles yet. Check back soon.
          </p>
        )}

        {/* 文章网格 */}
        <div style={gridStyle} className="news-grid">
          {articles.map((article) => (
            <Link
              key={article.handle}
              href={`/news/${article.handle}`}
              style={cardStyle}
            >
              {/* 封面图 */}
              <div style={imageWrapperStyle}>
                {article.image ? (
                  <PlaceholderImage
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#d4c8bc',
                    }}
                  />
                )}
              </div>

              {/* 日期 */}
              {article.date && (
                <p style={dateStyle}>{formatDate(article.date)}</p>
              )}

              {/* 标题 */}
              <h2 style={cardTitleStyle}>{article.title}</h2>

              {/* 摘要 */}
              {article.excerpt && (
                <p style={excerptStyle}>
                  {article.excerpt.length > 120
                    ? `${article.excerpt.slice(0, 120)}…`
                    : article.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
