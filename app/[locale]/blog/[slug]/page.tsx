/**
 * 博客文章详情页 — Server Component
 * ─────────────────────────────────────────────────────────────────
 * 优先从 Shopify Storefront API 获取单篇文章，
 * 若 API 返回空则从 siteConfig 中匹配 slug 进行回退。
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { type CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import PlaceholderImage from '@/components/PlaceholderImage';
import { getBlogArticleByHandle } from '@/lib/shopify';
import { siteConfig } from '@/config/site';

// 每 10 分钟重新验证，确保文章更新及时
export const revalidate = 600;
import { buildAlternates, defaultOgImage } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

// ─── 类型 ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// ─── SEO 元数据 ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await resolveArticle(slug);
  if (!article) {
    return { title: 'Article Not Found — VIONIS·XY' };
  }
  return {
    title: `${article.title} — VIONIS·XY`,
    description: article.excerpt || article.title,
    alternates: buildAlternates(`/blog/${slug}`),
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

// ─── 数据解析 ──────────────────────────────────────────────────────────────────

interface ResolvedArticle {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  contentHtml: string;
  isApi: boolean;
}

async function resolveArticle(slug: string): Promise<ResolvedArticle | null> {
  // 优先尝试 Shopify API
  try {
    const apiArticle = await getBlogArticleByHandle('journal', slug);
    if (apiArticle) {
      return {
        title: apiArticle.title,
        excerpt: apiArticle.excerpt || '',
        date: apiArticle.publishedAt || '',
        author: apiArticle.authorV2?.name || 'VIONIS·XY',
        image: apiArticle.image?.url || '',
        contentHtml: apiArticle.contentHtml || '',
        isApi: true,
      };
    }
  } catch {
    // API 调用失败，继续回退
  }

  // 回退到 siteConfig 中匹配 slug
  const configArticle = siteConfig.blog.文章列表.find(
    (a) => a.链接.replace('/blog/', '') === slug,
  );
  if (configArticle) {
    return {
      title: configArticle.文章标题,
      excerpt: configArticle.文章正文,
      date: '',
      author: 'VIONIS·XY',
      image: configArticle.图片_电脑端 || configArticle.图片_手机端 || '',
      contentHtml: '',
      isApi: false,
    };
  }

  return null;
}

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

// ─── HTML 内容组件（延迟加载 sanitizer 避免 serverless 环境问题） ──────────────

async function ArticleHtml({ html, style }: { html: string; style: CSSProperties }) {
  let cleanHtml = html;
  try {
    const { sanitizeShopifyHtml } = await import('@/utils/sanitizeShopifyHtml');
    cleanHtml = sanitizeShopifyHtml(html);
  } catch {
    // sanitizer 加载失败时使用基本的标签过滤
    cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return <div style={style} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

// ─── 页面组件 ──────────────────────────────────────────────────────────────────

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug, locale } = await params;
  const dict = await getDictionary((locale || 'en') as Locale);
  const article = await resolveArticle(slug);

  if (!article) {
    notFound();
  }

  // JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
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
      {/* JSON-LD 结构化数据 */}
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
              { label: dict.common?.journal || 'Journal', href: '/blog' },
              { label: article.title },
            ]}
          />
        </div>

        {/* 标题 */}
        <h1 style={titleStyle}>{article.title}</h1>

        {/* 日期 & 作者 */}
        <div style={metaRowStyle}>
          {article.date && <span>{formatDate(article.date)}</span>}
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
        {article.isApi && article.contentHtml ? (
          <ArticleHtml html={article.contentHtml} style={bodyStyle} />
        ) : (
          <div style={bodyStyle}>
            <p>{article.excerpt}</p>
          </div>
        )}

        {/* 返回链接 */}
        <Link href="/blog" style={backLinkStyle}>
          ← {dict.common?.journal || 'Journal'}
        </Link>
      </div>
    </div>
  );
}
