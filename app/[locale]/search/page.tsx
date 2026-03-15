/**
 * 搜索结果页
 * ─────────────────────────────────────────────────────────────────
 * 服务端组件 — 根据 URL 查询参数 ?q= 调用 searchProducts 获取结果。
 * 复用 ProductCard 渲染产品网格，布局与 Collection 页保持一致。
 */

import type { Metadata } from 'next';
import { searchProducts } from '@/lib/shopify';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import type { ShopifyProduct } from '@/components/ProductCard';

// ─── Shopify 原始产品数据标准化 ──────────────────────────────────────────────

function normalizeProduct(raw: any): ShopifyProduct {
  return {
    ...raw,
    images: raw.images?.edges?.map((img: any) => img.node) ?? [],
  };
}

// ─── 类型 ────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || '';
  return {
    title: query
      ? `"${query}" Search Results — VIONIS·XY`
      : 'Search — VIONIS·XY',
  };
}

// ─── 页面组件 ────────────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  let products: ShopifyProduct[] = [];
  let totalCount = 0;

  if (query) {
    const result = await searchProducts(query);
    products = result.products.map(normalizeProduct);
    totalCount = result.totalCount;
  }

  return (
    <main style={{ backgroundColor: '#E8DFD6', minHeight: '100vh' }}>
      <div className="search-container">
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Search Results' },
          ]}
        />

        {/* 搜索标题 */}
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 36,
            fontWeight: 400,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#1a1a1a',
            margin: '40px 0 8px',
          }}
        >
          {query ? (
            <>
              Results for{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 500 }}>
                &ldquo;{query}&rdquo;
              </span>
            </>
          ) : (
            'Search'
          )}
        </h1>

        {/* 结果计数 */}
        {query && (
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 13,
              color: '#888',
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          </p>
        )}

        {/* 产品网格 */}
        {products.length > 0 ? (
          <div className="search-grid">
            {products.map((product, i) => (
              <ProductCard
                key={product.handle}
                product={product}
                priority={i < 4}
              />
            ))}
          </div>
        ) : (
          /* 空结果状态 */
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0 80px',
            }}
          >
            {query ? (
              <p
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: 15,
                  color: '#888',
                  lineHeight: 1.6,
                }}
              >
                No products found for &ldquo;{query}&rdquo;.
                <br />
                Try a different keyword or browse our collections.
              </p>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: 15,
                  color: '#888',
                }}
              >
                Enter a search term to find products.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 响应式布局 */}
      <style>{`
        .search-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
        }
        .search-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .search-container {
            padding: 20px;
          }
          .search-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
