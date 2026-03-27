'use client';

import { useState, useCallback, type CSSProperties } from 'react';
import Link from 'next/link';
import PlaceholderImage from '@/components/PlaceholderImage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

interface BlogGridProps {
  initialArticles: BlogArticle[];
  initialEndCursor: string | null;
  initialHasNextPage: boolean;
  loadMoreText?: string;
  loadingText?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

const buttonStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#1a1a1a',
  backgroundColor: 'transparent',
  border: '1px solid #1a1a1a',
  padding: '14px 48px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlogGrid({
  initialArticles,
  initialEndCursor,
  initialHasNextPage,
  loadMoreText = 'Load More',
  loadingText = 'Loading…',
}: BlogGridProps) {
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles);
  const [endCursor, setEndCursor] = useState<string | null>(initialEndCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog?first=12&after=${encodeURIComponent(endCursor || '')}`);
      const data = await res.json();
      setArticles((prev) => [...prev, ...data.articles]);
      setEndCursor(data.pageInfo.endCursor);
      setHasNextPage(data.pageInfo.hasNextPage);
    } catch {
      // 静默失败，保持当前状态
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, endCursor]);

  return (
    <>
      {/* 响应式网格样式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-grid{grid-template-columns:1fr}
        @media(min-width:640px){.blog-grid{grid-template-columns:repeat(2,1fr)}}
        @media(min-width:1024px){.blog-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:768px){.blog-grid{grid-template-columns:1fr!important;gap:40px!important}}
        .blog-load-more:hover{background-color:#1a1a1a!important;color:#fff!important}
      ` }} />

      {/* 文章网格 */}
      <div style={gridStyle} className="blog-grid">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            style={cardStyle}
          >
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
                <div style={{ width: '100%', height: '100%', backgroundColor: '#d4c8bc' }} />
              )}
            </div>
            {article.date && <p style={dateStyle}>{formatDate(article.date)}</p>}
            <h2 style={cardTitleStyle}>{article.title}</h2>
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

      {/* Load More 按钮 */}
      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
          <button
            className="blog-load-more"
            style={buttonStyle}
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? loadingText : loadMoreText}
          </button>
        </div>
      )}
    </>
  );
}
