/**
 * 博客列表页 — Server Component
 * ─────────────────────────────────────────────────────────────────
 * 服务端预取首批 12 篇文章，客户端 BlogGrid 组件处理 Load More 分页。
 * 若 Shopify API 返回空则回退至 siteConfig 中的静态配置。
 */

import type { Metadata } from 'next';
import { type CSSProperties } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import BlogGrid from '@/components/BlogGrid';
import { getBlogArticles } from '@/lib/shopify';
import { siteConfig } from '@/config/site';
import { buildAlternates, defaultOgImage } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

// 每 10 分钟重新验证，确保新文章及时出现
export const revalidate = 600;

// ─── SEO 元数据 ────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'Journal — VIONIS·XY',
    description:
      'Explore stories of rare cashmere, merino craftsmanship, and quiet luxury from VIONIS·XY.',
    alternates: buildAlternates('/blog'),
    openGraph: {
      title: 'Journal — VIONIS·XY',
      description:
        'Explore stories of rare cashmere, merino craftsmanship, and quiet luxury.',
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

// ─── 页面组件 ──────────────────────────────────────────────────────────────────

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary((locale || 'en') as Locale);

  // 首批加载 12 篇
  let initialArticles: { slug: string; title: string; excerpt: string; date: string; image: string }[] = [];
  let endCursor: string | null = null;
  let hasNextPage = false;

  try {
    const result = await getBlogArticles('journal', 12);
    initialArticles = result.articles.map((a: any) => ({
      slug: a.handle,
      title: a.title,
      excerpt: a.excerpt || '',
      date: a.publishedAt || '',
      image: a.image?.url || '',
    }));
    endCursor = result.pageInfo.endCursor;
    hasNextPage = result.pageInfo.hasNextPage;
  } catch {
    // API 失败，回退到 siteConfig
    initialArticles = siteConfig.blog.文章列表.map((a) => ({
      slug: a.链接.replace('/blog/', ''),
      title: a.文章标题,
      excerpt: a.文章正文,
      date: '',
      image: a.图片_电脑端 || '',
    }));
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* 面包屑 */}
        <div style={{ paddingTop: 24, marginBottom: 24 }}>
          <Breadcrumb
            items={[
              { label: dict.common?.home || 'Home', href: '/' },
              { label: dict.common?.journal || 'Journal' },
            ]}
          />
        </div>

        {/* 标题 */}
        <h1 style={titleStyle}>JOURNAL</h1>

        {/* 文章网格 + Load More */}
        <BlogGrid
          initialArticles={initialArticles}
          initialEndCursor={endCursor}
          initialHasNextPage={hasNextPage}
          loadMoreText={dict.common?.loadMore || 'Load More'}
          loadingText={dict.common?.loading || 'Loading…'}
        />
      </div>
    </div>
  );
}
