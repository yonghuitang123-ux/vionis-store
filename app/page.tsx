'use client';

import { useEffect, useState } from 'react';
import LiquidBanner from '@/components/LiquidBanner';
import EditorialPanel from '@/components/EditorialPanel';
import type { ProductCard } from '@/components/EditorialPanel';
import MastermindShowcase from '@/components/MastermindShowcase';
import type { SlideItem } from '@/components/MastermindShowcase';
import BlogScroll from '@/components/BlogScroll';
import BrandStory from '@/components/BrandStory';
import ServiceBar from '@/components/ServiceBar';
import SiteFooter from '@/components/SiteFooter';
import { getProducts } from '@/lib/shopify';
import { siteConfig, 占位图 } from '@/config/site';

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

// ─── 骨架占位（产品加载前，保持布局稳定，无文字） ───────────────────────────
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
// 将 config 中编号式字段（轮播1_xxx ~ 轮播N_xxx）转换为组件所需的 SlideItem 数组
// 模特大图/右侧小图留空时，回落到品牌占位图
type SlideKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

function buildSlideItem(n: SlideKey): SlideItem | null {
  const modelPc  = featuredLook[`轮播${n}_模特大图_电脑端`];
  const modelMob = featuredLook[`轮播${n}_模特大图_手机端`];
  const prodImg  = featuredLook[`轮播${n}_右侧小图`];
  const title    = featuredLook[`轮播${n}_产品名称`];
  const price    = featuredLook[`轮播${n}_产品价格`];
  const href     = featuredLook[`轮播${n}_产品链接`];

  // 模特大图和产品名称都为空时，跳过此条
  if (!modelPc && !title) return null;

  return {
    modelImageDesktop:  modelPc  || 占位图.竖版,
    modelImageMobile:   modelMob || undefined,   // 留空则 Swiper 自动用 desktop 图
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

export default function Home() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  // ─── 全局 Women / Men 切换状态（0 = Women，1 = Men） ────────────────────────
  // EditorialPanel、MastermindShowcase 等所有需要性别切换的组件共享同一份状态
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  useEffect(() => {
    // EditorialPanel 产品卡片仍从 Shopify API 获取
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error('Shopify product fetch failed:', err));
  }, []);

  // 产品卡片（EditorialPanel 网格）
  const cards       = products.length >= 4 ? products.map(toProductCard) : SKELETON_PRODUCTS;
  const panel1Cards = cards.slice(0, 4);
  const panel2Cards = cards.slice(4, 8).length === 4 ? cards.slice(4, 8) : SKELETON_PRODUCTS;

  // 页脚社交链接：过滤掉空字符串
  const activeSocial = Object.fromEntries(
    Object.entries(footer.社交媒体).filter(([, v]) => Boolean(v)),
  ) as typeof footer.社交媒体;

  return (
    <main>

      {/* ══════════════════════════════════════════════════════
          1. LiquidBanner — 首屏横幅
      ══════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════
          2. EditorialPanel — Women / Men 产品网格
          hero 图来自 config；产品卡片来自 Shopify API
      ══════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════
          3. MastermindShowcase — 轮播看款
          所有数据来自 config/site.ts，与 API 无关
      ══════════════════════════════════════════════════════ */}
      <MastermindShowcase
        womenSlides={womenSlidesFromConfig.length > 0 ? womenSlidesFromConfig : [SKELETON_SLIDE]}
        menSlides={menSlidesFromConfig.length > 0 ? menSlidesFromConfig : [SKELETON_SLIDE]}
        activeGender={activeTab === 0 ? 'women' : 'men'}
        colors={{ bgColor: '#E8DFD6', headingColor: '#1a1a1a', textColor: '#1a1a1a' }}
        desktopHeight={700}
        modelWidthPct={55}
      />

      {/* ══════════════════════════════════════════════════════
          4. BrandStory — 品牌叙事
      ══════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════
          5. BlogScroll — 博客横向滚动
      ══════════════════════════════════════════════════════ */}
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
        mutedColor="#888888"
      />

      {/* ══════════════════════════════════════════════════════
          6. ServiceBar — 服务承诺栏
      ══════════════════════════════════════════════════════ */}
      <ServiceBar
        items={serviceBar.服务列表.map((s) => ({
          icon:     s.图标,
          title:    s.标题,
          subtitle: s.副标题,
        }))}
        bgColor="#E8DFD6"
        textColor="#1a1a1a"
        mutedColor="#888888"
        borderColor="rgba(0,0,0,0.1)"
      />

      {/* ══════════════════════════════════════════════════════
          7. SiteFooter — 页脚
      ══════════════════════════════════════════════════════ */}
      <SiteFooter
        shopName={footer.品牌名称}
        shopUrl={footer.首页链接}
        showNewsletter
        newsletterHeading={footer.订阅栏标题}
        newsletterPlaceholder={footer.订阅栏占位文字}
        onNewsletterSubmit={async (email) => {
          // 接入实际 Newsletter API 时在此替换
          console.log('Newsletter subscribe:', email);
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
          mutedColor:       '#888888',
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
