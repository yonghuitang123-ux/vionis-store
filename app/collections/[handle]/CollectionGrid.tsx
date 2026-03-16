'use client';

/**
 * CollectionGrid — 客户端排序 + 产品网格
 * ─────────────────────────────────────────────────────────────────
 * 接收服务端传入的产品数组，提供纯客户端排序（不重新请求 API）。
 * 排序选项：推荐 / 价格升序 / 价格降序 / 最新
 */

import { useState, useMemo, type CSSProperties } from 'react';
import ProductCard from '@/components/ProductCard';
import type { ShopifyProduct } from '@/components/ProductCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

interface CollectionGridProps {
  products: ShopifyProduct[];
}

// ─── 排序逻辑 ────────────────────────────────────────────────────────────────

function sortProducts(products: ShopifyProduct[], key: SortKey): ShopifyProduct[] {
  const arr = [...products];
  switch (key) {
    case 'price-asc':
      return arr.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount),
      );
    case 'price-desc':
      return arr.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount),
      );
    case 'newest':
      // Shopify 默认排序通常按创建时间正序，反转即为最新在前
      return arr.reverse();
    default:
      return arr;
  }
}

// ─── 样式 ────────────────────────────────────────────────────────────────────

const toolbarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 24,
  gap: 10,
};

const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#666',
};

const selectStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 400,
  color: '#1a1a1a',
  backgroundColor: 'transparent',
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: 0,
  padding: '8px 28px 8px 12px',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%23666\' stroke-width=\'1.2\' fill=\'none\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  cursor: 'pointer',
  outline: 'none',
};

// ─── 组件 ────────────────────────────────────────────────────────────────────

export default function CollectionGrid({ products }: CollectionGridProps) {
  const [sortKey, setSortKey] = useState<SortKey>('featured');

  const sorted = useMemo(() => sortProducts(products, sortKey), [products, sortKey]);

  return (
    <>
      {/* 排序工具栏 */}
      <div style={toolbarStyle}>
        <span style={labelStyle}>Sort by</span>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          style={selectStyle}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* 产品网格 */}
      <div className="collection-grid">
        {sorted.map((product, i) => (
          <ProductCard key={product.handle} product={product} priority={i < 4} />
        ))}
      </div>

      {/* 无产品提示 */}
      {sorted.length === 0 && (
        <p
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 15,
            color: '#666',
            textAlign: 'center',
            padding: '60px 0',
          }}
        >
          No products in this collection yet.
        </p>
      )}

      {/* 响应式网格 */}
      <style>{`
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .collection-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
