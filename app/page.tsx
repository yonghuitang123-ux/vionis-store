'use client';

import { useEffect, useState } from 'react';
import LiquidBanner from '@/components/LiquidBanner';
import EditorialPanel from '@/components/EditorialPanel';
import type { ProductCard } from '@/components/EditorialPanel';
import MastermindShowcase from '@/components/MastermindShowcase';
import type { SlideItem } from '@/components/MastermindShowcase';
import MaterialDualWall from '@/components/MaterialDualWall';
import BrandStory from '@/components/BrandStory';
import SiteFooter from '@/components/SiteFooter';
import { getProducts } from '@/lib/shopify';

// ─── 占位图 ────────────────────────────────────────────────────────────────────
// 使用与品牌一致的暖米色 #E8DFD6，不显示任何文字/图标
const PH_SQUARE = 'https://placehold.co/600x600/E8DFD6/E8DFD6';
const PH_TALL   = 'https://placehold.co/800x1200/E8DFD6/E8DFD6';
const PH_WIDE   = 'https://placehold.co/1200x800/E8DFD6/E8DFD6';

// ─── Hero 图（真实 Shopify CDN） ────────────────────────────────────────────────
const HERO_WOMEN = 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/2_b5b746b0-b008-4593-9da3-f06952603f17.webp?v=1769206938';
const HERO_MEN   = 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/1_449b9768-3f31-4671-ac0c-c5bbc73d9f2e.webp?v=1769206854';
const HERO_BANNER = 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp?v=1770369606';

// ─── Shopify 产品原始类型 ───────────────────────────────────────────────────────
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: { node: { url: string; altText: string | null } }[] };
}

/** 将 Shopify 货币格式化为展示字符串 */
function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  if (currencyCode === 'CNY') return `¥ ${num.toLocaleString('zh-CN', { minimumFractionDigits: 0 })}`;
  if (currencyCode === 'USD') return `$ ${num.toFixed(2)}`;
  return `${currencyCode} ${num.toFixed(2)}`;
}

/** Shopify product → EditorialPanel ProductCard */
function toProductCard(p: ShopifyProduct): ProductCard {
  const img = p.images.edges[0]?.node;
  const { amount, currencyCode } = p.priceRange.minVariantPrice;
  return {
    imageUrl:  img?.url    ?? PH_SQUARE,
    imageAlt:  img?.altText ?? p.title,
    title:     p.title,
    price:     formatPrice(amount, currencyCode),
    href:      `/products/${p.handle}`,
  };
}

/**
 * Shopify product → MastermindShowcase SlideItem
 * - modelImageDesktop : 来自 API 的产品主图（左侧大图）
 * - productImageDesktop: 独立传入的产品缩图（右侧小图），不从 API 自动获取
 */
function toSlideItem(p: ShopifyProduct, productImg: string): SlideItem {
  const img = p.images.edges[0]?.node;
  const { amount, currencyCode } = p.priceRange.minVariantPrice;
  return {
    modelImageDesktop:   img?.url ?? PH_TALL,
    modelImageAlt:       p.title,
    productImageDesktop: productImg,
    productImageAlt:     p.title,
    subtitle:            'THE LOOK',
    title:               p.title,
    material:            formatPrice(amount, currencyCode),
    linkText:            'VIEW PRODUCT',
    href:                `/products/${p.handle}`,
  };
}

// ─── 加载骨架（纯色占位，无文字，保持布局稳定） ──────────────────────────────
const SKELETON_PRODUCTS: ProductCard[] = Array.from({ length: 4 }, () => ({
  imageUrl: PH_SQUARE,
  imageAlt: '',
  title:    '',
  price:    '',
  href:     '#',
}));

const SKELETON_SLIDE: SlideItem = {
  modelImageDesktop:   PH_TALL,
  modelImageAlt:       '',
  productImageDesktop: PH_SQUARE,
  productImageAlt:     '',
  subtitle:            '',
  title:               '',
  material:            '',
  linkText:            '',
  href:                '#',
};

export default function Home() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error('Shopify product fetch failed:', err));
  }, []);

  // 将产品按顺序分配给各区块（不足时回落到占位）
  const cards       = products.length >= 4 ? products.map(toProductCard) : SKELETON_PRODUCTS;
  const panel1Cards = cards.slice(0, 4);
  const panel2Cards = cards.slice(4, 8).length === 4 ? cards.slice(4, 8) : SKELETON_PRODUCTS;

  // MastermindShowcase：右侧小图（productImg）通过 props 显式传入
  // 生产环境请替换为各产品的专属缩图 URL；暂用品牌占位色块
  const womenSlides = products.slice(0, 4).map((p) => toSlideItem(p, PH_SQUARE));
  const menSlides   = products.slice(4, 8).map((p) => toSlideItem(p, PH_SQUARE));

  return (
    <main>

      {/* ══════════════════════════════════════════════════════
          1. LiquidBanner — 视差滚动横幅（首屏）
      ══════════════════════════════════════════════════════ */}
      <LiquidBanner
        leftImageDesktop={HERO_BANNER}
        leftImageAlt="VIONIS·XY 女装模特"
        rightImageDesktop={HERO_BANNER}
        rightImageAlt="VIONIS·XY 男装模特"
        heading="THE 2026 ESSENTIALS"
        description="RARE CASHMERE & SEAMLESS MERINO"
        buttons={[
          { text: 'MERINO WOOL', href: '/collections/merino' },
          { text: 'CASHMERE',    href: '/collections/cashmere' },
        ]}
        colors={{
          outerBg:      '#E8DFD6',
          contentBg:    '#E8DFD6',
          headingColor: '#1a1a1a',
          btnBg:        '#FFFFFF',
          btnText:      '#000000',
          btnBorder:    '#000000',
          btnHoverBg:   '#000000',
          btnHoverText: '#FFFFFF',
        }}
        headingSize={48}
        headingWeight={300}
        headingSpacing={30}
        headingTransform="uppercase"
      />

      {/* ══════════════════════════════════════════════════════
          2. EditorialPanel — 4:5 对称画报（Women / Men Tab）
          hero 图已替换为真实 Shopify CDN；产品卡片来自 API
      ══════════════════════════════════════════════════════ */}
      <EditorialPanel
        tab1Label="Women"
        tab2Label="Men"
        panel1={{
          imageDesktop: HERO_WOMEN,
          imageAlt:     'VIONIS·XY Women Collection',
          title:        'The Cashmere Origin',
          description:  'Inner Mongolia, -30°C',
          products:     panel1Cards,
        }}
        panel2={{
          imageDesktop: HERO_MEN,
          imageAlt:     'VIONIS·XY Men Collection',
          title:        'The Cashmere Structure',
          description:  'Engineered for Warmth',
          products:     panel2Cards,
        }}
        colors={{ accentColor: '#A05E46' }}
      />

      {/* ══════════════════════════════════════════════════════
          3. MastermindShowcase — Swiper 双轨轮播
          产品数据来自 Shopify API（加载中显示骨架轮播）
      ══════════════════════════════════════════════════════ */}
      <MastermindShowcase
        womenSlides={womenSlides.length > 0 ? womenSlides : [SKELETON_SLIDE]}
        menSlides={menSlides.length > 0 ? menSlides : [SKELETON_SLIDE]}
        colors={{ bgColor: '#F4F1EA', headingColor: '#1a1a1a', textColor: '#1a1a1a' }}
        desktopHeight={700}
        modelWidthPct={55}
      />

      {/* ══════════════════════════════════════════════════════
          4. MaterialDualWall — 材质双壁展示
      ══════════════════════════════════════════════════════ */}
      <MaterialDualWall
        leftPanel={{
          imageDesktop: PH_WIDE,
          imageAlt:     'Merino Wool — VIONIS·XY',
          href:         '/collections/merino',
          subtitle:     'THE ESSENTIAL',
          title:        'Merino Wool',
          specs:        '18.5µm • Everyday Luxury',
          btnText:      'EXPLORE',
        }}
        rightPanel={{
          imageDesktop: PH_WIDE,
          imageAlt:     'Cashmere — VIONIS·XY',
          href:         '/collections/cashmere',
          subtitle:     'THE RAREST',
          title:        'Cashmere',
          specs:        '15.5µm • Soft Gold',
          btnText:      'DISCOVER',
        }}
        colors={{
          bgColor:       '#F4F1EA',
          headingColor:  '#FFFFFF',
          textColor:     '#FFFFFF',
          btnHoverBg:    '#FFFFFF',
          btnHoverColor: '#000000',
        }}
        desktopHeight={600}
        gridGap={16}
        paddingTop={60}
        paddingBottom={60}
      />

      {/* ══════════════════════════════════════════════════════
          5. BrandStory — 品牌叙事三栏布局
      ══════════════════════════════════════════════════════ */}
      <BrandStory
        mainImage={PH_TALL}
        mainImageAlt="VIONIS·XY Brand Story — Model"
        subImage={PH_SQUARE}
        subImageAlt="VIONIS·XY Cashmere Detail"
        subtitle="THE PHILOSOPHY"
        title="Quiet Confidence"
        text="True elegance does not need to shout. At VIONIS·XY, we believe in the power of subtraction — removing the excess to reveal the essential quality of Merino and Cashmere. Each piece is crafted to outlast trends and outlive seasons."
        signature="Viral Momentum"
        colors={{
          bgColor:      '#FFFFFF',
          headingColor: '#1a1a1a',
          textColor:    '#555555',
        }}
        headingSize={48}
        mainImgHeight={650}
        subImgHeight={400}
        subImgOffset={50}
      />

      {/* ══════════════════════════════════════════════════════
          6. SiteFooter — 站点底部
      ══════════════════════════════════════════════════════ */}
      <SiteFooter
        shopName="VIONIS·XY"
        shopUrl="/"
        showNewsletter
        newsletterHeading="GET EARLY ACCESS"
        newsletterPlaceholder="Enter your email"
        onNewsletterSubmit={async (email) => {
          console.log('Newsletter subscribe:', email);
        }}
        showSocial
        socialLinks={{
          instagram: 'https://instagram.com/vionis.xy',
          tiktok:    'https://tiktok.com/@vionis.xy',
          pinterest: 'https://pinterest.com/vionisxy',
          youtube:   'https://youtube.com/@vionisxy',
        }}
        blocks={[
          {
            type: 'link_list',
            heading: 'Shop',
            links: [
              { title: 'Cashmere',     url: '/collections/cashmere' },
              { title: 'Merino Wool',  url: '/collections/merino' },
              { title: 'New Arrivals', url: '/collections/new' },
              { title: 'Best Sellers', url: '/collections/best-sellers' },
            ],
          },
          {
            type: 'link_list',
            heading: 'About',
            links: [
              { title: 'Our Story',      url: '/pages/about' },
              { title: 'Craftsmanship',  url: '/pages/craft' },
              { title: 'Sustainability', url: '/pages/sustainability' },
              { title: 'Wholesale',      url: '/pages/wholesale' },
            ],
          },
          {
            type: 'link_list',
            heading: 'Help',
            links: [
              { title: 'Size Guide',  url: '/pages/size-guide' },
              { title: 'Shipping',    url: '/pages/shipping' },
              { title: 'Returns',     url: '/pages/returns' },
              { title: 'Contact Us',  url: '/pages/contact' },
            ],
          },
          {
            type: 'text',
            heading: 'Brand',
            content: 'VIONIS·XY — Rare Cashmere & Seamless Merino.<br/>Crafted for quiet luxury.',
          },
        ]}
        showPolicies
        policies={[
          { title: 'Privacy Policy',   url: '/policies/privacy-policy' },
          { title: 'Terms of Service', url: '/policies/terms-of-service' },
          { title: 'Refund Policy',    url: '/policies/refund-policy' },
        ]}
        colors={{
          bgColor:      '#0f0f0f',
          textColor:    '#aaaaaa',
          headingColor: '#ffffff',
          mutedColor:   '#666666',
          borderColor:  'rgba(255,255,255,0.1)',
          linkColor:    '#bbbbbb',
          btnBg:        '#ffffff',
          btnColor:     '#0f0f0f',
        }}
        paddingTop={80}
        paddingBottom={40}
      />

    </main>
  );
}
