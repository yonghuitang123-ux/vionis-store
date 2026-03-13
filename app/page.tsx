'use client';

import LiquidBanner from '@/components/LiquidBanner';
import EditorialPanel from '@/components/EditorialPanel';
import MastermindShowcase from '@/components/MastermindShowcase';
import MaterialDualWall from '@/components/MaterialDualWall';
import BrandStory from '@/components/BrandStory';
import SiteFooter from '@/components/SiteFooter';

// ─── 占位图 URL ───────────────────────────────────────────────────────────────
// 生产环境替换为真实 CDN 地址；placehold.co 已加入 next.config.ts remotePatterns

const PH_TALL   = 'https://placehold.co/800x1200/1a1a1a/888888';   // 竖版模特图
const PH_SQUARE = 'https://placehold.co/600x600/f0ede6/aaaaaa';    // 方形产品图
const PH_WIDE   = 'https://placehold.co/1200x800/2a2a2a/888888';   // 横版大图
const PH_PANEL  = 'https://placehold.co/1600x900/1a1a1a/888888';   // 全幅图

export default function Home() {
  return (
    <main>

      {/* ══════════════════════════════════════════════════════
          1. LiquidBanner — 视差滚动横幅（首屏）
          向下滚动时左右图片从两侧汇聚，内容卡片渐隐
      ══════════════════════════════════════════════════════ */}
      <LiquidBanner
        leftImageDesktop="https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp?v=1770369606"
        leftImageAlt="VIONIS·XY 女装模特"
        rightImageDesktop="https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp?v=1770369606"
        rightImageAlt="VIONIS·XY 男装模特"
        heading="THE 2026 ESSENTIALS"
        description="RARE CASHMERE & SEAMLESS MERINO"
        buttons={[
          { text: 'MERINO WOOL', href: '/collections/merino' },
          { text: 'CASHMERE',    href: '/collections/cashmere' },
        ]}
        colors={{
          outerBg:    '#F5F3EF',
          contentBg:  '#FFFFFF',
          headingColor: '#1a1a1a',
          btnBg:      '#FFFFFF',
          btnText:    '#000000',
          btnBorder:  '#000000',
          btnHoverBg: '#000000',
          btnHoverText: '#FFFFFF',
        }}
        headingSize={48}
        headingWeight={300}
        headingSpacing={30}
        headingTransform="uppercase"
      />

      {/* ══════════════════════════════════════════════════════
          2. EditorialPanel — 4:5 对称画报（Women / Men Tab）
          左侧模特大图 + 右侧 2×2 产品网格
      ══════════════════════════════════════════════════════ */}
      <EditorialPanel
        tab1Label="Women"
        tab2Label="Men"
        panel1={{
          imageDesktop:  PH_TALL,
          imageAlt:      'VIONIS·XY Women Collection',
          title:         'The Cashmere Origin',
          description:   'Inner Mongolia, -30°C',
          products: [
            { imageUrl: PH_SQUARE, title: 'Cashmere Turtleneck',  price: '¥ 1,580', href: '/products/cashmere-turtleneck' },
            { imageUrl: PH_SQUARE, title: 'Merino Longline Coat', price: '¥ 2,280', href: '/products/merino-coat' },
            { imageUrl: PH_SQUARE, title: 'Ribbed Cashmere Vest', price: '¥ 980',   href: '/products/cashmere-vest' },
            { imageUrl: PH_SQUARE, title: 'Seamless Merino Set',  price: '¥ 1,280', href: '/products/merino-set' },
          ],
        }}
        panel2={{
          imageDesktop:  PH_TALL,
          imageAlt:      'VIONIS·XY Men Collection',
          title:         'The Cashmere Structure',
          description:   'Engineered for Warmth',
          products: [
            { imageUrl: PH_SQUARE, title: 'Men Cashmere Crewneck', price: '¥ 1,480', href: '/products/men-cashmere-crewneck' },
            { imageUrl: PH_SQUARE, title: 'Men Merino Hoodie',     price: '¥ 1,180', href: '/products/men-merino-hoodie' },
            { imageUrl: PH_SQUARE, title: 'Men Cashmere Cardigan', price: '¥ 1,880', href: '/products/men-cashmere-cardigan' },
            { imageUrl: PH_SQUARE, title: 'Men Seamless Base',     price: '¥ 880',   href: '/products/men-merino-base' },
          ],
        }}
        colors={{ accentColor: '#A05E46' }}
      />

      {/* ══════════════════════════════════════════════════════
          3. MastermindShowcase — Swiper 双轨轮播
          左侧模特图 + 右侧产品信息卡，自动轮播 + 导航箭头
      ══════════════════════════════════════════════════════ */}
      <MastermindShowcase
        womenSlides={[
          {
            modelImageDesktop:   PH_TALL,
            modelImageAlt:       'VIONIS·XY Women Look 01',
            productImageDesktop: PH_SQUARE,
            productImageAlt:     'Cashmere Turtleneck',
            subtitle:            'THE LOOK',
            title:               'Cashmere Turtleneck',
            material:            '¥ 1,580 · 100% Inner Mongolia Cashmere',
            linkText:            'VIEW PRODUCT',
            href:                '/products/cashmere-turtleneck',
          },
          {
            modelImageDesktop:   PH_TALL,
            modelImageAlt:       'VIONIS·XY Women Look 02',
            productImageDesktop: PH_SQUARE,
            productImageAlt:     'Merino Longline Coat',
            subtitle:            'THE LOOK',
            title:               'Merino Longline Coat',
            material:            '¥ 2,280 · Extra-fine Merino 18.5µm',
            linkText:            'VIEW PRODUCT',
            href:                '/products/merino-coat',
          },
          {
            modelImageDesktop:   PH_TALL,
            modelImageAlt:       'VIONIS·XY Women Look 03',
            productImageDesktop: PH_SQUARE,
            productImageAlt:     'Ribbed Cashmere Vest',
            subtitle:            'THE LOOK',
            title:               'Ribbed Cashmere Vest',
            material:            '¥ 980 · Grade-A Cashmere',
            linkText:            'VIEW PRODUCT',
            href:                '/products/cashmere-vest',
          },
        ]}
        menSlides={[
          {
            modelImageDesktop:   PH_TALL,
            modelImageAlt:       'VIONIS·XY Men Look 01',
            productImageDesktop: PH_SQUARE,
            productImageAlt:     'Men Cashmere Crewneck',
            subtitle:            'THE LOOK',
            title:               'Cashmere Crewneck',
            material:            '¥ 1,480 · 100% Inner Mongolia Cashmere',
            linkText:            'VIEW PRODUCT',
            href:                '/products/men-cashmere-crewneck',
          },
          {
            modelImageDesktop:   PH_TALL,
            modelImageAlt:       'VIONIS·XY Men Look 02',
            productImageDesktop: PH_SQUARE,
            productImageAlt:     'Men Merino Hoodie',
            subtitle:            'THE LOOK',
            title:               'Seamless Merino Hoodie',
            material:            '¥ 1,180 · Superfine Merino 17.5µm',
            linkText:            'VIEW PRODUCT',
            href:                '/products/men-merino-hoodie',
          },
        ]}
        colors={{ bgColor: '#F4F1EA', headingColor: '#1a1a1a', textColor: '#1a1a1a' }}
        desktopHeight={700}
        modelWidthPct={55}
      />

      {/* ══════════════════════════════════════════════════════
          4. MaterialDualWall — 材质双壁展示
          悬停时面板伸展 + 图片缩放 + 按钮滑出
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
          bgColor:      '#F4F1EA',
          headingColor: '#FFFFFF',
          textColor:    '#FFFFFF',
          btnHoverBg:   '#FFFFFF',
          btnHoverColor: '#000000',
        }}
        desktopHeight={600}
        gridGap={16}
        paddingTop={60}
        paddingBottom={60}
      />

      {/* ══════════════════════════════════════════════════════
          5. BrandStory — 品牌叙事三栏布局
          左侧主图 + 中间文字 + 右侧错落副图
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
          导航栏 + Newsletter + 社交图标 + 版权
      ══════════════════════════════════════════════════════ */}
      <SiteFooter
        shopName="VIONIS·XY"
        shopUrl="/"
        showNewsletter
        newsletterHeading="GET EARLY ACCESS"
        newsletterPlaceholder="Enter your email"
        onNewsletterSubmit={async (email) => {
          // 接入实际 API 时替换此处
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
              { title: 'Cashmere',        url: '/collections/cashmere' },
              { title: 'Merino Wool',     url: '/collections/merino' },
              { title: 'New Arrivals',    url: '/collections/new' },
              { title: 'Best Sellers',    url: '/collections/best-sellers' },
            ],
          },
          {
            type: 'link_list',
            heading: 'About',
            links: [
              { title: 'Our Story',       url: '/pages/about' },
              { title: 'Craftsmanship',   url: '/pages/craft' },
              { title: 'Sustainability',  url: '/pages/sustainability' },
              { title: 'Wholesale',       url: '/pages/wholesale' },
            ],
          },
          {
            type: 'link_list',
            heading: 'Help',
            links: [
              { title: 'Size Guide',      url: '/pages/size-guide' },
              { title: 'Shipping',        url: '/pages/shipping' },
              { title: 'Returns',         url: '/pages/returns' },
              { title: 'Contact Us',      url: '/pages/contact' },
            ],
          },
          {
            type: 'text',
            heading: 'Brand',
            content: 'VIONIS·XY — Rare Cashmere & Seamless Merino. <br/>Crafted for quiet luxury.',
          },
        ]}
        showPolicies
        policies={[
          { title: 'Privacy Policy',    url: '/policies/privacy-policy' },
          { title: 'Terms of Service',  url: '/policies/terms-of-service' },
          { title: 'Refund Policy',     url: '/policies/refund-policy' },
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
