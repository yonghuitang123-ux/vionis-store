'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import LiquidBanner from '@/components/LiquidBanner';
import type { ProductCard } from '@/components/EditorialPanel';
import type { SlideItem } from '@/components/MastermindShowcase';
import { siteConfig, 占位图 } from '@/config/site';

// ─── 懒加载首屏以下组件（减少初始 JS ~500KB） ────────────────────────────────
const EditorialPanel = dynamic(() => import('@/components/EditorialPanel'), { ssr: true });
const MastermindShowcase = dynamic(() => import('@/components/MastermindShowcase'), { ssr: true });
const BlogScroll = dynamic(() => import('@/components/BlogScroll'), { ssr: true });
const BrandStory = dynamic(() => import('@/components/BrandStory'), { ssr: true });
const ServiceBar = dynamic(() => import('@/components/ServiceBar'), { ssr: true });
const SiteFooter = dynamic(() => import('@/components/SiteFooter'), { ssr: true });

// ─── 便捷解构 ─────────────────────────────────────────────────────────────────
const { banner, grid, featuredLook, blog, brandStory, serviceBar, footer } = siteConfig;

// ─── Shopify 产品原始类型 ─────────────────────────────────────────────────────
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: { node: { url: string; altText: string | null } }[] };
}

/** 货币格式化 */
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
    imageUrl: img?.url     ?? 占位图.方形,
    imageAlt: img?.altText ?? p.title,
    title:    p.title,
    price:    formatPrice(amount, currencyCode),
    href:     `/products/${p.handle}`,
  };
}

// ─── 骨架占位 ─────────────────────────────────────────────────────────────────
const SKELETON_PRODUCTS: ProductCard[] = Array.from({ length: 4 }, () => ({
  imageUrl: 占位图.方形,
  imageAlt: '',
  title:    '',
  price:    '',
  href:     '#',
}));

const SKELETON_SLIDE: SlideItem = {
  modelImageDesktop:   占位图.竖版,
  productImageDesktop: 占位图.方形,
  modelImageAlt:       '',
  productImageAlt:     '',
  subtitle:            '',
  title:               '',
  material:            '',
  linkText:            '',
  href:                '#',
};

// ─── featuredLook config → SlideItem 数组 ─────────────────────────────────────
type SlideKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

function buildSlideItem(n: SlideKey): SlideItem | null {
  const modelPc  = featuredLook[`轮播${n}_模特大图_电脑端`];
  const modelMob = featuredLook[`轮播${n}_模特大图_手机端`];
  const prodImg  = featuredLook[`轮播${n}_右侧小图`];
  const title    = featuredLook[`轮播${n}_产品名称`];
  const price    = featuredLook[`轮播${n}_产品价格`];
  const href     = featuredLook[`轮播${n}_产品链接`];

  if (!modelPc && !title) return null;

  return {
    modelImageDesktop:  modelPc  || 占位图.竖版,
    modelImageMobile:   modelMob || undefined,
    modelImageAlt:      title    || '',
    productImageDesktop: prodImg || 占位图.方形,
    productImageAlt:    title    || '',
    subtitle:           featuredLook.副标签文字,
    title:              title    || '',
    material:           price    || '',
    linkText:           featuredLook.查看按钮文字,
    href:               href     || '#',
  };
}

const womenSlidesFromConfig = ([1, 2, 3, 4] as SlideKey[])
  .map(buildSlideItem)
  .filter((s): s is SlideItem => s !== null);

const menSlidesFromConfig = ([5, 6, 7, 8] as SlideKey[])
  .map(buildSlideItem)
  .filter((s): s is SlideItem => s !== null);

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeContentProps {
  initialProducts: ShopifyProduct[];
}

export default function HomeContent({ initialProducts }: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  // 产品卡片（服务端预取）
  const cards       = initialProducts.length >= 4 ? initialProducts.map(toProductCard) : SKELETON_PRODUCTS;
  const panel1Cards = cards.slice(0, 4);
  const panel2Cards = cards.slice(4, 8).length === 4 ? cards.slice(4, 8) : SKELETON_PRODUCTS;

  // 页脚社交链接
  const activeSocial = Object.fromEntries(
    Object.entries(footer.社交媒体).filter(([, v]) => Boolean(v)),
  ) as typeof footer.社交媒体;

  return (
    <main>

      {/* 1. LiquidBanner — 首屏横幅（直接加载，不懒加载） */}
      <LiquidBanner
        leftImageDesktop={banner.电脑端左图}
        leftImageMobile={banner.手机端左图 || undefined}
        leftImageAlt="VIONIS·XY"
        rightImageDesktop={banner.电脑端右图}
        rightImageMobile={banner.手机端右图 || undefined}
        rightImageAlt="VIONIS·XY"
        heading={banner.标题}
        description={banner.副标题}
        buttons={[
          { text: banner.按钮1文字, href: banner.按钮1链接 },
          { text: banner.按钮2文字, href: banner.按钮2链接 },
        ]}
        colors={{
          outerBg:      '#E8DFD6',
          contentBg:    '#FFFFFF',
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

      {/* 2. EditorialPanel — Women / Men 产品网格 */}
      <EditorialPanel
        tab1Label={grid.女装Tab标签}
        tab2Label={grid.男装Tab标签}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        panel1={{
          imageDesktop: grid.女装大图_电脑端,
          imageMobile:  grid.女装大图_手机端 || undefined,
          imageAlt:     'VIONIS·XY Women Collection',
          title:        grid.女装标题,
          description:  grid.女装副标题,
          products:     panel1Cards,
        }}
        panel2={{
          imageDesktop: grid.男装大图_电脑端,
          imageMobile:  grid.男装大图_手机端 || undefined,
          imageAlt:     'VIONIS·XY Men Collection',
          title:        grid.男装标题,
          description:  grid.男装副标题,
          products:     panel2Cards,
        }}
        colors={{ accentColor: '#A05E46' }}
      />

      {/* 3. MastermindShowcase — 轮播看款 */}
      <MastermindShowcase
        womenSlides={womenSlidesFromConfig.length > 0 ? womenSlidesFromConfig : [SKELETON_SLIDE]}
        menSlides={menSlidesFromConfig.length > 0 ? menSlidesFromConfig : [SKELETON_SLIDE]}
        activeGender={activeTab === 0 ? 'women' : 'men'}
        colors={{ bgColor: '#E8DFD6', headingColor: '#1a1a1a', textColor: '#1a1a1a' }}
        desktopHeight={700}
        modelWidthPct={55}
      />

      {/* 4. BrandStory — 品牌叙事 */}
      <BrandStory
        mainImage={brandStory.主图_电脑端 || 占位图.竖版}
        mainImageAlt="VIONIS·XY Brand Story"
        subImage={brandStory.副图_电脑端 || 占位图.方形}
        subImageAlt="VIONIS·XY Cashmere Detail"
        subtitle={brandStory.小标题}
        title={brandStory.标题}
        text={brandStory.正文}
        signature={brandStory.签名}
        colors={{
          bgColor:      '#E8DFD6',
          headingColor: '#1a1a1a',
          textColor:    '#555555',
        }}
        headingSize={48}
        mainImgHeight={650}
        subImgHeight={400}
        subImgOffset={50}
      />

      {/* 5. BlogScroll — 博客横向滚动 */}
      <BlogScroll
        heading={blog.标题}
        posts={blog.文章列表.map((a) => ({
          imageDesktop: a.图片_电脑端 || 占位图.竖版,
          imageMobile:  a.图片_手机端 || undefined,
          title:        a.文章标题,
          body:         a.文章正文,
          href:         a.链接,
        }))}
        bgColor="#E8DFD6"
        headingColor="#1a1a1a"
        textColor="#555555"
        mutedColor="#555555"
      />

      {/* 6. ServiceBar — 服务承诺栏 */}
      <ServiceBar
        items={serviceBar.服务列表.map((s) => ({
          icon:     s.图标,
          title:    s.标题,
          subtitle: s.副标题,
        }))}
        bgColor="#E8DFD6"
        textColor="#1a1a1a"
        mutedColor="#555555"
        borderColor="rgba(0,0,0,0.1)"
      />

      {/* 7. SiteFooter — 页脚 */}
      <SiteFooter
        shopName={footer.品牌名称}
        shopUrl={footer.首页链接}
        showNewsletter
        newsletterHeading={footer.订阅栏标题}
        newsletterPlaceholder={footer.订阅栏占位文字}
        onNewsletterSubmit={async (email) => {
          const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? 'Subscription failed');
          }
        }}
        showSocial
        socialLinks={activeSocial}
        blocks={footer.导航列}
        showPolicies
        policies={footer.政策链接}
        colors={{
          bgColor:          '#E8DFD6',
          textColor:        '#555555',
          headingColor:     '#1a1a1a',
          mutedColor:       '#555555',
          borderColor:      'rgba(0,0,0,0.1)',
          linkColor:        '#333333',
          inputBorderColor: 'rgba(0,0,0,0.2)',
          btnBg:            '#1a1a1a',
          btnColor:         '#FFFFFF',
        }}
        paddingTop={80}
        paddingBottom={40}
      />

    </main>
  );
}
