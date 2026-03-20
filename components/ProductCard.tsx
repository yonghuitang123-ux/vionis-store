'use client';

/**
 * ProductCard
 * ─────────────────────────────────────────────────────────────────
 * 产品卡片组件 — 用于集合页 / 搜索结果 / 推荐列表等场景。
 *
 * 特性：
 *   · 4:5 宽高比图片容器，悬停时 scale(1.04) 放大过渡
 *   · 使用 PlaceholderImage 实现品牌占位色 + 渐隐加载
 *   · 如有原价高于现价，展示划线价
 *   · 整体无边框、极简风格，符合 VIONIS·XY 品牌调性
 */

import Link from 'next/link';
import { type CSSProperties } from 'react';
import PlaceholderImage from '@/components/PlaceholderImage';
import WishlistButton from '@/components/WishlistButton';
import { useTranslation } from '@/lib/i18n/client';

// ─── 类型定义 ────────────────────────────────────────────────────────────────

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProduct {
  handle: string;
  title: string;
  images: { url: string; altText?: string | null }[];
  priceRange: { minVariantPrice: MoneyV2 };
  compareAtPriceRange?: { minVariantPrice: MoneyV2 } | null;
  vendor?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: ShopifyProduct;
  className?: string;
  /** 首屏可见卡片设为 true，触发 priority 加载 */
  priority?: boolean;
}

// ─── 工具函数 ────────────────────────────────────────────────────────────────

/** Locale → Intl locale 映射 */
const INTL_LOCALE_MAP: Record<string, string> = {
  en: 'en-US', fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP', it: 'it-IT',
  es: 'es-ES', pt: 'pt-PT', nl: 'nl-NL', pl: 'pl-PL', cs: 'cs-CZ',
  da: 'da-DK', fi: 'fi-FI', no: 'nb-NO', sv: 'sv-SE',
};

/** 将 Shopify MoneyV2 格式化为本地化货币字符串 */
function formatMoney({ amount, currencyCode }: MoneyV2, locale = 'en'): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  return new Intl.NumberFormat(INTL_LOCALE_MAP[locale] || 'en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

// ─── 样式常量 ────────────────────────────────────────────────────────────────

const cardStyle: CSSProperties = {
  display: 'block',
  textDecoration: 'none',
  color: '#1a1a1a',
};

const imageWrapperStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 5',
  overflow: 'hidden',
  backgroundColor: '#E8DFD6',
};

const imageStyle: CSSProperties = {
  objectFit: 'cover',
  transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 15,
  fontWeight: 400,
  lineHeight: 1.4,
  margin: '10px 0 0',
  transition: 'opacity 0.3s ease',
};

const priceWrapperStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 400,
  margin: '4px 0 0',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'opacity 0.3s ease',
};

const compareAtStyle: CSSProperties = {
  textDecoration: 'line-through',
  color: '#767676',
};

const salePriceStyle: CSSProperties = {
  color: '#A05E46',
};

// ─── 组件 ────────────────────────────────────────────────────────────────────

export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { locale } = useTranslation();
  const { handle, title, images, priceRange, compareAtPriceRange } = product;

  const imgSrc = images[0]?.url ?? '';
  const imgAlt = images[0]?.altText ?? title;

  const price = priceRange.minVariantPrice;
  const compareAt = compareAtPriceRange?.minVariantPrice;

  // 判断是否有折扣：原价存在且大于现价
  const hasDiscount =
    compareAt &&
    parseFloat(compareAt.amount) > 0 &&
    parseFloat(compareAt.amount) > parseFloat(price.amount);

  return (
    <div style={{ position: 'relative' }} className={className}>
      <Link href={`/products/${handle}`} style={cardStyle}>
        {/* 图片容器 — 4:5 比例 */}
        <div
          style={imageWrapperStyle}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
          }}
        >
          {imgSrc && (
            <PlaceholderImage
              src={imgSrc}
              alt={imgAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={imageStyle}
              priority={priority}
            />
          )}
        </div>

        {/* 产品标题 */}
        <p style={titleStyle}>{title}</p>

        {/* 价格行 */}
        <div style={priceWrapperStyle}>
          {hasDiscount ? (
            <>
              <span style={salePriceStyle}>{formatMoney(price, locale)}</span>
              <span style={compareAtStyle}>{formatMoney(compareAt, locale)}</span>
            </>
          ) : (
            <span>{formatMoney(price, locale)}</span>
          )}
        </div>
      </Link>

      {/* 收藏按钮（浮在图片右上角） */}
      <WishlistButton
        product={{
          productId: `gid://shopify/Product/${handle}`,
          handle,
          title,
          price: price.amount,
          currencyCode: price.currencyCode,
          compareAtPrice: compareAt?.amount,
          image: imgSrc,
          imageAlt: imgAlt,
        }}
        variant="floating"
        size={16}
      />
    </div>
  );
}
