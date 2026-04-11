/**
 * Collection / PLP 页面
 * ─────────────────────────────────────────────────────────────────
 * 服务端组件 — 根据 handle 获取 Shopify 系列数据并渲染产品列表。
 * 排序功能由客户端子组件 CollectionGrid 处理。
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCollectionByHandle } from '@/lib/shopify';
import Breadcrumb from '@/components/Breadcrumb';
import CollectionGrid from './CollectionGrid';
import type { ShopifyProduct } from '@/components/ProductCard';
import { buildAlternates, defaultOgImage } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

// ─── Shopify edges → 扁平产品数组 ──────────────────────────────────────────────

function normalizeProducts(edges: any[]): ShopifyProduct[] {
  return edges.map((e: any) => ({
    ...e.node,
    images: e.node.images.edges.map((img: any) => img.node),
  }));
}

// ─── 类型 ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ handle: string; locale: string }>;
}

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return { title: 'Collection Not Found — VIONIS·XY' };
  const title = collection.seo?.title || `${collection.title} — VIONIS·XY`;
  const description = collection.seo?.description || collection.description || '';
  return {
    title,
    description,
    alternates: buildAlternates(`/collections/${handle}`, locale),
    openGraph: {
      title,
      description,
      siteName: 'VIONIS·XY',
      locale,
      alternateLocale: ['en','fr','de','ja','it','es','pt','nl','pl','cs','da','fi','no','sv'].filter(l => l !== locale),
      images: [defaultOgImage],
    },
  };
}

// ─── 页面组件 ────────────────────────────────────────────────────────────────

export default async function CollectionPage({ params }: PageProps) {
  const { handle, locale } = await params;
  const dict = await getDictionary((locale || 'en') as Locale);
  const collection = await getCollectionByHandle(handle);
  if (!collection) notFound();

  const products = normalizeProducts(collection.products?.edges ?? []);

  return (
    <main style={{ backgroundColor: '#E8DFD6', minHeight: '100vh' }}>
      <div className="collection-container">
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: dict.common?.home || 'Home', href: '/' },
            { label: dict.common?.collections || 'Collections', href: '/collections' },
            { label: collection.title },
          ]}
        />

        {/* 系列标题 */}
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 36,
            fontWeight: 400,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#1a1a1a',
            margin: '40px 0 12px',
          }}
        >
          {collection.title}
        </h1>

        {/* 系列描述（可选） */}
        {collection.description && (
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 14,
              color: '#555',
              textAlign: 'center',
              maxWidth: 600,
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}
          >
            {collection.description}
          </p>
        )}

        {/* 产品网格 + 客户端排序 */}
        <CollectionGrid products={products} />
      </div>

      {/* 响应式布局 */}
      <style>{`
        .collection-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
        }
        @media (max-width: 768px) {
          .collection-container {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}
