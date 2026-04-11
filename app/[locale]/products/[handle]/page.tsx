/**
 * 产品详情页 — Server Component
 * ─────────────────────────────────────────────────────────────────
 * 路由：/products/[handle]
 * 功能：动态 SEO metadata、JSON-LD 结构化数据、面包屑导航、
 *       产品交互区（委托给客户端组件）、推荐产品网格。
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProductByHandle, getProductRecommendations } from '@/lib/shopify';
import { getApprovedReviews } from '@/lib/reviews';
import ProductCard from '@/components/ProductCard';
import ProductDetail from './ProductDetail';
import ServiceBar from '@/components/ServiceBar';
import { siteConfig } from '@/config/site';
import type { CSSProperties } from 'react';
import { buildAlternates, defaultOgImage } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

// ─── 类型 ──────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ locale: string; handle: string }>;
}

// ─── 数据规范化 ────────────────────────────────────────────────────────────────

/** 推荐产品只需展平 images（ProductCard 需要 images[].url） */
function normalizeCardProduct(raw: any) {
  return {
    ...raw,
    images: raw.images?.edges?.map((e: any) => e.node) ?? raw.images ?? [],
  };
}

// ─── SEO: generateMetadata ─────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: 'Product Not Found — VIONIS·XY' };
  }

  const image = Array.isArray(product.images) ? product.images[0] : product.images?.edges?.[0]?.node;
  const description =
    product.seo?.description ||
    product.descriptionHtml?.replace(/<[^>]*>/g, '').slice(0, 160) ||
    '';

  return {
    title: `${product.title} — VIONIS·XY`,
    description,
    alternates: buildAlternates(`/products/${handle}`, locale),
    openGraph: {
      title: `${product.title} — VIONIS·XY`,
      description,
      type: 'website',
      siteName: 'VIONIS·XY',
      locale,
      alternateLocale: ['en','fr','de','ja','it','es','pt','nl','pl','cs','da','fi','no','sv'].filter(l => l !== locale),
      images: image
        ? [{ url: image.url, width: image.width, height: image.height }]
        : [defaultOgImage],
    },
  };
}

// ─── 样式 ──────────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  backgroundColor: '#E8DFD6',
  minHeight: '100vh',
};

const innerStyle: CSSProperties = {
  maxWidth: 1400,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
};

const breadcrumbStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: '#666',
  padding: '28px 0 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const breadcrumbLinkStyle: CSSProperties = {
  color: '#666',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

const breadcrumbCurrentStyle: CSSProperties = {
  color: '#1a1a1a',
};

const recsWrapperStyle: CSSProperties = {
  marginTop: 80,
  paddingBottom: 100,
};

const recsTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 28,
  fontWeight: 300,
  color: '#1a1a1a',
  textAlign: 'center',
  margin: '0 0 48px',
};

const recsGridStyle: CSSProperties = {
  display: 'grid',
  gap: 20,
};

// ─── 页面组件 ──────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: PageProps) {
  const { handle, locale } = await params;
  const dict = await getDictionary((locale || 'en') as Locale);

  // 获取产品数据（getProductByHandle 已返回规范化结构，含 media）
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  // 获取推荐产品
  let recommendations: any[] = [];
  try {
    const recs = await getProductRecommendations(product.id);
    recommendations = recs.slice(0, 4).map(normalizeCardProduct);
  } catch {
    // 推荐获取失败不影响页面渲染
  }

  // 获取已审核通过的评论（用于 JSON-LD 结构化数据）
  let approvedReviews: Awaited<ReturnType<typeof getApprovedReviews>> = [];
  try {
    approvedReviews = await getApprovedReviews(product.id);
  } catch {
    // 评论获取失败不影响页面渲染
  }

  // JSON-LD 结构化数据
  const firstImage = Array.isArray(product.images) ? product.images[0] : product.images?.[0];
  const price = product.priceRange?.minVariantPrice;
  const hasVariantsInStock = (product.variants ?? []).some(
    (v: any) => v.availableForSale,
  );

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vionisxy.com').replace(/\/+$/, '');

  // 计算评论聚合数据
  const reviewCount = approvedReviews.length;
  const avgRating = reviewCount > 0
    ? Math.round((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
    : 0;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: firstImage?.url ?? '',
    description:
      product.descriptionHtml?.replace(/<[^>]*>/g, '').slice(0, 500) ?? '',
    brand: {
      '@type': 'Brand',
      name: 'VIONIS·XY',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/${locale}/products/${handle}`,
      priceCurrency: price?.currencyCode ?? 'USD',
      price: price?.amount ?? '0',
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: hasVariantsInStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };

  // 有评论时添加 aggregateRating 和 review 数组
  if (reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
    // 最多展示最近 10 条评论的结构化数据
    jsonLd.review = approvedReviews.slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.displayName,
      },
      datePublished: r.createdAt,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      name: r.title || undefined,
      reviewBody: r.body || undefined,
    }));
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.common?.home || 'Home',
        item: `${siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.common?.shop || 'Shop',
        item: `${siteUrl}/${locale}/collections`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `${siteUrl}/${locale}/products/${handle}`,
      },
    ],
  };

  return (
    <div style={pageStyle}>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div style={innerStyle} className="max-w-full min-w-0 px-4 sm:px-6">
        {/* 面包屑导航 */}
        <nav aria-label="Breadcrumb" style={breadcrumbStyle}>
          <Link href="/" style={breadcrumbLinkStyle}>
            {dict.common?.home || 'Home'}
          </Link>
          <span aria-hidden>／</span>
          <Link href="/collections" style={breadcrumbLinkStyle}>
            {dict.common?.shop || 'Shop'}
          </Link>
          <span aria-hidden>／</span>
          <span style={breadcrumbCurrentStyle}>{product.title}</span>
        </nav>

        {/* 产品详情交互区 — 客户端组件 */}
        <ProductDetail product={product} />

        {/* 推荐产品 */}
        {recommendations.length > 0 && (
          <section style={recsWrapperStyle}>
            <h2 style={recsTitleStyle}>{dict.product?.youMayAlsoLike || 'You May Also Like'}</h2>
            <div style={recsGridStyle} className="!grid-cols-2 md:!grid-cols-4">
              {recommendations.map((rec: any) => (
                <ProductCard key={rec.id || rec.handle} product={rec} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 服务保障栏 */}
      <ServiceBar
        items={siteConfig.serviceBar.服务列表.map((s) => ({
          icon:     s.图标 as 'shipping' | 'return' | 'quality' | 'contact',
          title:    s.标题,
          subtitle: s.副标题,
        }))}
        bgColor="#E8DFD6"
        textColor="#1a1a1a"
        mutedColor="#555555"
        borderColor="rgba(0,0,0,0.1)"
      />
    </div>
  );
}
