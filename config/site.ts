/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║              VIONIS·XY  全站内容配置文件                         ║
 * ║                                                                  ║
 * ║  所有图片 URL、文字、链接，全部在这里修改，不需要动其他文件。     ║
 * ║  手机端图片留空时，自动使用电脑端图片。                           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ─── 品牌占位图（图片未配置或加载中时显示的纯色背景）─────────────────────────
// 颜色与品牌调性一致，不显示任何文字/图标
export const 占位图 = {
  方形: 'https://placehold.co/600x600/E8DFD6/E8DFD6',    // 产品卡 / 缩图
  竖版: 'https://placehold.co/800x1200/E8DFD6/E8DFD6',   // 模特大图
  横版: 'https://placehold.co/1200x800/E8DFD6/E8DFD6',   // 宽幅图
};

export const siteConfig = {

  // ═══════════════════════════════════════════════════════════════════
  // Banner  首页横幅
  // ═══════════════════════════════════════════════════════════════════
  banner: {
    // 左侧图片（建议竖版，800×1200 以上）
    电脑端左图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp?v=1770369606',
    手机端左图: '',   // 留空则自动用电脑端左图

    // 右侧图片（建议竖版，800×1200 以上）
    电脑端右图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp?v=1770369606',
    手机端右图: '',   // 留空则自动用电脑端右图

    标题:       'THE 2026 ESSENTIALS',
    副标题:     'RARE CASHMERE & SEAMLESS MERINO',

    按钮1文字:  'MERINO WOOL',
    按钮1链接:  '/collections/merino',

    按钮2文字:  'CASHMERE',
    按钮2链接:  '/collections/cashmere',
  },

  // ═══════════════════════════════════════════════════════════════════
  // 产品网格  Women / Men 切换区域
  // ═══════════════════════════════════════════════════════════════════
  grid: {
    // Tab 标签文字
    女装Tab标签: 'Women',
    男装Tab标签: 'Men',

    // 女装 hero 大图（4:5 竖版，模特从顶部展示，建议 800×1000 以上）
    女装大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/2_b5b746b0-b008-4593-9da3-f06952603f17.webp?v=1769206938',
    女装大图_手机端: '',   // 留空则自动用电脑端图片

    // 男装 hero 大图
    男装大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/1_449b9768-3f31-4671-ac0c-c5bbc73d9f2e.webp?v=1769206854',
    男装大图_手机端: '',   // 留空则自动用电脑端图片

    // 图片下方的文字叠层
    女装标题:   'The Cashmere Origin',
    女装副标题: 'Inner Mongolia, -30°C',
    男装标题:   'The Cashmere Structure',
    男装副标题: 'Engineered for Warmth',

    // Shopify collection handle（用于 API 按系列取产品，暂保留备用）
    女装产品系列: 'women',
    男装产品系列: 'men',
  },

  // ═══════════════════════════════════════════════════════════════════
  // 轮播看款  FeaturedLook（左侧模特大图 + 右侧产品缩图）
  // ═══════════════════════════════════════════════════════════════════
  // 说明：每条轮播完全手动填写，与 Shopify 后台无关。
  //       最多支持 8 条（前 4 条为 Women，后 4 条为 Men）。
  //       未填写的条目不显示。
  featuredLook: {

    // ── 女装 Women（轮播 1–4）──────────────────────────────────────────
    轮播1_模特大图_电脑端: '',
    轮播1_模特大图_手机端: '',   // 留空则自动用电脑端图片
    轮播1_右侧小图:         '',   // 右侧产品缩图（建议方形 600×600）
    轮播1_产品名称:         '',
    轮播1_产品价格:         '',   // 如 "¥ 1,580" 或 "$ 138.00"
    轮播1_产品链接:         '',   // 如 "/products/cashmere-turtleneck"

    轮播2_模特大图_电脑端: '',
    轮播2_模特大图_手机端: '',
    轮播2_右侧小图:         '',
    轮播2_产品名称:         '',
    轮播2_产品价格:         '',
    轮播2_产品链接:         '',

    轮播3_模特大图_电脑端: '',
    轮播3_模特大图_手机端: '',
    轮播3_右侧小图:         '',
    轮播3_产品名称:         '',
    轮播3_产品价格:         '',
    轮播3_产品链接:         '',

    轮播4_模特大图_电脑端: '',
    轮播4_模特大图_手机端: '',
    轮播4_右侧小图:         '',
    轮播4_产品名称:         '',
    轮播4_产品价格:         '',
    轮播4_产品链接:         '',

    // ── 男装 Men（轮播 5–8）──────────────────────────────────────────
    轮播5_模特大图_电脑端: '',
    轮播5_模特大图_手机端: '',
    轮播5_右侧小图:         '',
    轮播5_产品名称:         '',
    轮播5_产品价格:         '',
    轮播5_产品链接:         '',

    轮播6_模特大图_电脑端: '',
    轮播6_模特大图_手机端: '',
    轮播6_右侧小图:         '',
    轮播6_产品名称:         '',
    轮播6_产品价格:         '',
    轮播6_产品链接:         '',

    轮播7_模特大图_电脑端: '',
    轮播7_模特大图_手机端: '',
    轮播7_右侧小图:         '',
    轮播7_产品名称:         '',
    轮播7_产品价格:         '',
    轮播7_产品链接:         '',

    轮播8_模特大图_电脑端: '',
    轮播8_模特大图_手机端: '',
    轮播8_右侧小图:         '',
    轮播8_产品名称:         '',
    轮播8_产品价格:         '',
    轮播8_产品链接:         '',

    // 通用文字（所有轮播条目共用）
    副标签文字:   'THE LOOK',         // 产品图上方小标签
    查看按钮文字: 'VIEW PRODUCT',     // CTA 按钮
  },

  // ═══════════════════════════════════════════════════════════════════
  // 材质双墙  Merino / Cashmere
  // ═══════════════════════════════════════════════════════════════════
  materialWall: {
    // 左侧面板（美利奴羊毛）
    左侧_美利奴图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/1_859b1e77-7a55-4772-8fa8-b1e85210e23b.webp?v=1768379407',   // 替换为真实材质图片
    左侧_美利奴图_手机端: '',   // 留空则自动用电脑端图片
    左侧_小标题:  'THE ESSENTIAL',
    左侧_标题:    'Merino Wool',
    左侧_规格:    '18.5µm • Everyday Luxury',
    左侧_按钮:    'EXPLORE',
    左侧_链接:    '/collections/merino',

    // 右侧面板（羊绒）
    右侧_羊绒图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/2_d78b81f9-2104-4964-a60c-5c7503653c91.webp?v=1768379438',     // 替换为真实材质图片
    右侧_羊绒图_手机端: '',     // 留空则自动用电脑端图片
    右侧_小标题:  'THE RAREST',
    右侧_标题:    'Cashmere',
    右侧_规格:    '15.5µm • Soft Gold',
    右侧_按钮:    'DISCOVER',
    右侧_链接:    '/collections/cashmere',
  },

  // ═══════════════════════════════════════════════════════════════════
  // 品牌故事  BrandStory
  // ═══════════════════════════════════════════════════════════════════
  brandStory: {
    // 左侧主图（建议 2:3 竖版）
    主图_电脑端: '',   // 替换为真实图片
    主图_手机端: '',   // 留空则自动用电脑端图片

    // 右侧副图（建议方形，带错落偏移效果）
    副图_电脑端: '',   // 替换为真实图片
    副图_手机端: '',   // 留空则自动用电脑端图片

    小标题: 'THE PHILOSOPHY',
    标题:   'Quiet Confidence',
    正文:   'True elegance does not need to shout. At VIONIS·XY, we believe in the power of subtraction — removing the excess to reveal the essential quality of Merino and Cashmere. Each piece is crafted to outlast trends and outlive seasons.',
    签名:   'Viral Momentum',
  },

  // ═══════════════════════════════════════════════════════════════════
  // 页脚  SiteFooter
  // ═══════════════════════════════════════════════════════════════════
  footer: {
    品牌名称:         'VIONIS·XY',
    首页链接:         '/',
    订阅栏标题:       'GET EARLY ACCESS',
    订阅栏占位文字:   'Enter your email',

    // 社交媒体链接（不需要的留空字符串 ''）
    社交媒体: {
      instagram: 'https://instagram.com/vionis.xy',
      tiktok:    'https://tiktok.com/@vionis.xy',
      pinterest: 'https://pinterest.com/vionisxy',
      youtube:   'https://youtube.com/@vionisxy',
      facebook:  '',
      twitter:   '',
    },

    // 导航列（type: 'link_list' = 链接列表 | 'text' = 纯文字块）
    导航列: [
      {
        type: 'link_list' as const,
        heading: 'Shop',
        links: [
          { title: 'Cashmere',     url: '/collections/cashmere' },
          { title: 'Merino Wool',  url: '/collections/merino' },
          { title: 'New Arrivals', url: '/collections/new' },
          { title: 'Best Sellers', url: '/collections/best-sellers' },
        ],
      },
      {
        type: 'link_list' as const,
        heading: 'About',
        links: [
          { title: 'Our Story',      url: '/pages/about' },
          { title: 'Craftsmanship',  url: '/pages/craft' },
          { title: 'Sustainability', url: '/pages/sustainability' },
          { title: 'Wholesale',      url: '/pages/wholesale' },
        ],
      },
      {
        type: 'link_list' as const,
        heading: 'Help',
        links: [
          { title: 'Size Guide',  url: '/pages/size-guide' },
          { title: 'Shipping',    url: '/pages/shipping' },
          { title: 'Returns',     url: '/pages/returns' },
          { title: 'Contact Us',  url: '/pages/contact' },
        ],
      },
      {
        type: 'text' as const,
        heading: 'Brand',
        content: 'VIONIS·XY — Rare Cashmere & Seamless Merino.<br/>Crafted for quiet luxury.',
      },
    ],

    // 底部政策链接
    政策链接: [
      { title: 'Privacy Policy',   url: '/policies/privacy-policy' },
      { title: 'Terms of Service', url: '/policies/terms-of-service' },
      { title: 'Refund Policy',    url: '/policies/refund-policy' },
    ],
  },
};
