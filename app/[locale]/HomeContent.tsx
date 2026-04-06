'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import LiquidBanner from '@/components/LiquidBanner';
import type { ProductCard } from '@/components/EditorialPanel';
import type { SlideItem } from '@/components/MastermindShowcase';
import { siteConfig, 占位图 } from '@/config/site';
import { useTranslation } from '@/lib/i18n/client';

// ─── 懒加载首屏以下组件 ─────────────────────────────────────────────────────
// EditorialPanel 紧接 hero，保留 SSR 保证 SEO
const EditorialPanel = dynamic(() => import('@/components/EditorialPanel'), { ssr: true });
// Swiper 组件不需要 SSR，延迟加载省 50KB+ JS
const MastermindShowcase = dynamic(() => import('@/components/MastermindShowcase'), { ssr: false });
// 其余折叠线以下组件
const BrandStory = dynamic(() => import('@/components/BrandStory'), { ssr: true });
const ServiceBar = dynamic(() => import('@/components/ServiceBar'), { ssr: false });
const SiteFooter = dynamic(() => import('@/components/SiteFooter'), { ssr: true });

// ─── 便捷解构 ─────────────────────────────────────────────────────────────────
const { banner, grid, featuredLook, brandStory, serviceBar, footer } = siteConfig;

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
type SlideKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

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

const womenSlidesFromConfig = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as SlideKey[])
  .map(buildSlideItem)
  .filter((s): s is SlideItem => s !== null);

const menSlidesFromConfig = ([11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as SlideKey[])
  .map(buildSlideItem)
  .filter((s): s is SlideItem => s !== null);

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeContentProps {
  womenProducts: ShopifyProduct[];
  menProducts: ShopifyProduct[];
  children?: React.ReactNode;
}

export default function HomeContent({ womenProducts, menProducts, children }: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const { t } = useTranslation();

  // 轮播文字翻译
  const translatedWomenSlides = womenSlidesFromConfig.map((s) => ({
    ...s,
    subtitle: t('home.theLook'),
    linkText: t('home.viewProduct'),
  }));
  const translatedMenSlides = menSlidesFromConfig.map((s) => ({
    ...s,
    subtitle: t('home.theLook'),
    linkText: t('home.viewProduct'),
  }));

  // 产品卡片（按指定 handle 精准取货）
  const panel1Cards = womenProducts.length > 0 ? womenProducts.map(toProductCard) : SKELETON_PRODUCTS;
  const panel2Cards = menProducts.length   > 0 ? menProducts.map(toProductCard)   : SKELETON_PRODUCTS;

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
        heading={t('home.bannerHeading')}
        description={t('home.bannerSubtitle')}
        buttons={[
          { text: t('home.bannerBtn1'), href: banner.按钮1链接 },
          { text: t('home.bannerBtn2'), href: banner.按钮2链接 },
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
        tab1Label={t('home.womenTab')}
        tab2Label={t('home.menTab')}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        panel1={{
          imageDesktop: grid.女装大图_电脑端,
          imageMobile:  grid.女装大图_手机端 || undefined,
          imageAlt:     'VIONIS·XY Women Collection',
          title:        t('home.womenTitle'),
          description:  t('home.womenSubtitle'),
          body:         t('home.womenBody'),
          products:     panel1Cards,
        }}
        panel2={{
          imageDesktop: grid.男装大图_电脑端,
          imageMobile:  grid.男装大图_手机端 || undefined,
          imageAlt:     'VIONIS·XY Men Collection',
          title:        t('home.menTitle'),
          description:  t('home.menSubtitle'),
          body:         t('home.menBody'),
          products:     panel2Cards,
        }}
        colors={{ accentColor: '#A05E46' }}
      />

      {/* 3. MastermindShowcase — 轮播看款 */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 700px' }}>
      <MastermindShowcase
        womenSlides={translatedWomenSlides.length > 0 ? translatedWomenSlides : [SKELETON_SLIDE]}
        menSlides={translatedMenSlides.length > 0 ? translatedMenSlides : [SKELETON_SLIDE]}
        activeGender={activeTab === 0 ? 'women' : 'men'}
        colors={{ bgColor: '#E8DFD6', headingColor: '#1a1a1a', textColor: '#1a1a1a' }}
        desktopHeight={700}
        modelWidthPct={55}
      />
      </div>

      {/* 4. BrandStory — 品牌叙事 */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
      <BrandStory
        mainImage={brandStory.主图_电脑端 || 占位图.竖版}
        mainImageAlt="VIONIS·XY Brand Story"
        subImage={brandStory.副图_电脑端 || 占位图.方形}
        subImageAlt="VIONIS·XY Cashmere Detail"
        subtitle={t('home.storySubtitle')}
        title={t('home.storyTitle')}
        text={t('home.storyBody')}
        signature={t('home.storySignature')}
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
      </div>

      {/* 5. 博客 + 新闻 — 服务端渲染网格（SEO 可见） */}
      {children}

      {/* 6. ServiceBar — 服务承诺栏 */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 100px' }}>
      <ServiceBar
        items={serviceBar.服务列表.map((s) => {
          const keyMap: Record<string, [string, string]> = {
            shipping: ['serviceBar.freeShipping', 'serviceBar.freeShippingDesc'],
            return:   ['serviceBar.freeReturns',  'serviceBar.freeReturnsDesc'],
            quality:  ['serviceBar.quality',      'serviceBar.qualityDesc'],
            contact:  ['serviceBar.contact',      'serviceBar.contactDesc'],
          };
          const keys = keyMap[s.图标];
          return {
            icon:     s.图标,
            title:    keys ? t(keys[0]) : s.标题,
            subtitle: keys ? t(keys[1]) : s.副标题,
          };
        })}
        bgColor="#E8DFD6"
        textColor="#1a1a1a"
        mutedColor="#555555"
        borderColor="rgba(0,0,0,0.1)"
      />
      </div>

      {/* 7. SiteFooter — 页脚 */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
      <SiteFooter
        shopName={footer.品牌名称}
        shopUrl={footer.首页链接}
        showNewsletter
        newsletterHeading={t('footer.newsletter') !== 'footer.newsletter' ? t('footer.newsletter') : footer.订阅栏标题}
        newsletterSubtitle={t('footer.newsletterText') !== 'footer.newsletterText' ? t('footer.newsletterText') : 'First look at every new drop. No spam, just cashmere.'}
        newsletterPlaceholder={t('footer.emailPlaceholder') !== 'footer.emailPlaceholder' ? t('footer.emailPlaceholder') : footer.订阅栏占位文字}
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
        blocks={footer.导航列.map((block) => {
          const headingKeyMap: Record<string, string> = {
            Shop: 'footer.shop', About: 'footer.about', Help: 'footer.help', Brand: 'footer.brand',
          };
          const tKey = headingKeyMap[block.heading];
          const translatedBlock = { ...block, heading: tKey ? t(tKey) : block.heading };
          // Translate link titles within blocks
          if ('links' in translatedBlock && translatedBlock.links) {
            const linkKeyMap: Record<string, string> = {
              'Cashmere': 'footer.cashmere', 'Merino Wool': 'footer.merinoWool',
              'New Arrivals': 'nav.newArrivals', 'Best Sellers': 'footer.bestSellers',
              'Our Story': 'footer.ourStory', 'Craftsmanship': 'nav.craftsmanship',
              'Sustainability': 'footer.sustainability', 'Wholesale': 'footer.wholesale',
              'Size Guide': 'footer.sizeGuide', 'Shipping': 'footer.shipping',
              'Returns': 'footer.returns', 'Contact': 'footer.contact',
            };
            translatedBlock.links = translatedBlock.links.map((link: any) => {
              const lKey = linkKeyMap[link.title];
              return lKey ? { ...link, title: t(lKey) } : link;
            });
          }
          if ('content' in translatedBlock && translatedBlock.content) {
            translatedBlock.content = t('footer.brandDesc');
          }
          return translatedBlock;
        })}
        showPolicies
        policies={footer.政策链接.map((p) => {
          const policyKeyMap: Record<string, string> = {
            'Privacy Policy': 'footer.privacyPolicy',
            'Terms of Service': 'footer.termsOfService',
            'Refund Policy': 'footer.refundPolicy',
          };
          const tKey = policyKeyMap[p.title];
          return { ...p, title: tKey ? t(tKey) : p.title };
        })}
        blocksBgColor="#C4A882"
        colors={{
          bgColor:          '#E8DFD6',
          textColor:        '#3d3d3d',
          headingColor:     '#1a1a1a',
          mutedColor:       '#3d3d3d',
          borderColor:      'rgba(0,0,0,0.1)',
          linkColor:        '#333333',
          inputBorderColor: 'rgba(0,0,0,0.2)',
          btnBg:            '#1a1a1a',
          btnColor:         '#FFFFFF',
        }}
        paddingTop={80}
        paddingBottom={40}
      />
      </div>

    </main>
  );
}
