/**
 * 博客列表页 — Server Component
 * ─────────────────────────────────────────────────────────────────
 * 优先从 Shopify Storefront API 获取文章列表，
 * 若 API 返回空则回退至 siteConfig 中的静态配置。
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { type CSSProperties } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import PlaceholderImage from '@/components/PlaceholderImage';
import { getBlogArticles } from '@/lib/shopify';
import { siteConfig } from '@/config/site';

// ─── SEO 元数据 ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Journal — VIONIS·XY',
  description:
    'Explore stories of rare cashmere, merino craftsmanship, and quiet luxury from VIONIS·XY.',
  openGraph: {
    title: 'Journal — VIONIS·XY',
    description:
      'Explore stories of rare cashmere, merino craftsmanship, and quiet luxury.',
    siteName: 'VIONIS·XY',
    type: 'website',
  },
};

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
  gridTemplateColumns: 'repeat(3, 1fr)',
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
  color: '#888',
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

export default async function BlogPage() {
  // 尝试从 Shopify API 获取文章
  let apiArticles: any[] = [];
  try {
    apiArticles = await getBlogArticles('news', 20);
  } catch {
    apiArticles = [];
  }

  // 如果 API 返回空，回退到 siteConfig 静态配置
  const useApi = apiArticles.length > 0;
  const articles = useApi
    ? apiArticles.map((a: any) => ({
        slug: a.handle,
        title: a.title,
        excerpt: a.excerpt || '',
        date: a.publishedAt || '',
        image: a.image?.url || '',
      }))
    : siteConfig.blog.文章列表.map((a) => ({
        slug: a.链接.replace('/blog/', ''),
        title: a.文章标题,
        excerpt: a.文章正文,
        date: '',
        image: a.图片_电脑端 || '',
      }));

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* 面包屑 */}
        <div style={{ paddingTop: 24, marginBottom: 24 }}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Journal' },
            ]}
          />
        </div>

        {/* 标题 */}
        <h1 style={titleStyle}>JOURNAL</h1>

        {/* 文章网格 */}
        <div style={gridStyle} className="blog-grid">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
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

      {/* 响应式：移动端单列 */}
      <style>{`
        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
