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
    手机端左图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_12.webp?v=1770369630',   // 留空则自动用电脑端左图

    // 右侧图片（建议竖版，800×1200 以上）
    电脑端右图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp?v=1770369606',
    手机端右图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_12.webp?v=1770369630',   // 留空则自动用电脑端右图

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
    轮播1_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/2546.webp?v=1770621760',
    轮播1_模特大图_手机端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/2546.webp?v=1770621760',   // 留空则自动用电脑端图片
    轮播1_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_The_Merino_Tie-Bonnet_80g_100_merino_wool_cocoa9.webp?v=1770656169',   // 右侧产品缩图（建议方形 600×600）
    轮播1_产品名称:         'The Merino Tie-Bonnet（80g)',
    轮播1_产品价格:         '$56.00',   // 如 "¥ 1,580" 或 "$ 138.00"
    轮播1_产品链接:         'https://vionisxy.com/products/the-merino-tie-bonnet-100-wool-80g',   // 如 "/products/cashmere-turtleneck"

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
    主图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/d2d364e9304d84eac1f3f4037b6f3638.webp?v=1768383731',   // 替换为真实图片
    主图_手机端: '',   // 留空则自动用电脑端图片

    // 右侧副图（建议方形，带错落偏移效果）
    副图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/d2d364e9304d84eac1f3f4037b6f3638_e7c22bb2-b732-49d9-a737-4bd6398e51e8.webp?v=1768383759',   // 替换为真实图片
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
          { title: 'New Arrivals', url: '/collections/new-arrivals' },
          { title: 'Best Sellers', url: '/collections/best-sellers' },
        ],
      },
      {
        type: 'link_list' as const,
        heading: 'About',
        links: [
          { title: 'Our Story',      url: '/pages/about' },
          { title: 'Craftsmanship',  url: '/pages/craftsmanship' },
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
          { title: 'Contact',     url: '/pages/contact-1' },
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

  // ═══════════════════════════════════════════════════════════════════
  // 博客板块  横向滚动
  // ═══════════════════════════════════════════════════════════════════
  // 说明：每篇文章手动填写。图片留空时显示品牌占位色。
  //       文章列表可以增减，不限数量。
  blog: {
    标题: 'INSIDE VIONIS·XY',

    文章列表: [
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-alashan-cashmere-goats-inner-mongolia-source.webp?v=1773412607',              // 建议上传 3:4 竖图，宽 680px 以上
        图片_手机端: '',              // 不填则自动使用电脑端图片
        文章标题: 'The Origin of Cashmere',
        文章正文: 'Inner Mongolia, -30°C. The world\'s finest cashmere is born from extreme cold.',
        链接: '/blog/cashmere-origin',
      },
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-merino-wool-yarn-texture-closeup.webp?v=1773412220',
        图片_手机端: '',
        文章标题: 'The Secret of Merino',
        文章正文: '18.5 microns — three times finer than human hair. Every fibre chosen with precision.',
        链接: '/blog/merino-secret',
      },
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-sgs-certified-100-percent-cashmere-lab-report.webp?v=1773412943',
        图片_手机端: '',
        文章标题: 'Independently Certified Purity',
        文章正文: ' Every VIONIS·XY piece undergoes SGS laboratory testing to confirm 100% natural fiber composition. No blends. No shortcuts.',
        链接: '/blog/handcraft',
      },
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-cashmere-turtleneck-quiet-luxury_lifestyle..webp?v=1773412185',
        图片_手机端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-cashmere-turtleneck-quiet-luxury_lifestyle..webp?v=1773412185',
        文章标题: 'Quiet Luxury, Defined',
        文章正文: 'True luxury whispers. VIONIS·XY is for those who know the difference.',
        链接: '/blog/quiet-luxury',
      },
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-natural-cashmere-merino-yarn-cones-premium-mill.webp?v=1773413116',
        图片_手机端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-natural-cashmere-merino-yarn-cones-premium-mill.webp?v=1773413116',
        文章标题: 'Precision Knit Engineering',
        文章正文: 'Every VIONIS·XY garment is constructed with tension-balanced knitting — engineered for durability, designed for longevity.',
        链接: '/blog/knit-engineering',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 公告栏  Announcement Bar
  // ═══════════════════════════════════════════════════════════════════
  announcement: {
    显示: true,          // false = 永久关闭公告栏
    // 说明：3条文字每5秒自动轮播，淡入淡出切换
    轮播列表: [
      'Complimentary Shipping on Orders Over $300',
      'Free 30-Day Returns — No Questions Asked',
      'SGS Certified 100% Natural Fibres',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 顶部导航菜单  Navigation
  // ═══════════════════════════════════════════════════════════════════
  nav: {
    // 说明：颜色字段可选，留空默认 #1a1a1a（深色）
    菜单: [
      { 文字: 'Cashmere',           链接: '/collections/cashmere'                       },
      { 文字: 'Merino Wool',        链接: '/collections/merino'                         },
      { 文字: 'New Arrivals',       链接: '/collections/new-arrivals'                   },
      { 文字: 'Spring/Summer 2026', 链接: '/', 颜色: '#C8B69E' },
      { 文字: 'Our Story',          链接: '/pages/our-story'                            },
      { 文字: 'Craftsmanship',      链接: '/pages/craftsmanship'                        },
      { 文字: 'Journal',            链接: '/blog'                                       },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 服务承诺栏  ServiceBar
  // ═══════════════════════════════════════════════════════════════════
  serviceBar: {
    服务列表: [
      { 图标: 'shipping' as const, 标题: 'Free Shipping',    副标题: 'Complimentary worldwide delivery' },
      { 图标: 'return'   as const, 标题: 'Free Returns',     副标题: '30-day hassle-free returns'       },
      { 图标: 'quality'  as const, 标题: 'Quality Guarantee',副标题: '100% natural fibres, certified'   },
      { 图标: 'contact'  as const, 标题: 'Contact',          副标题: 'support@vionisxy.com'              },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 订阅弹窗  Newsletter Popup
  // ═══════════════════════════════════════════════════════════════════
  newsletter: {
    标题:     'Join the Inner Circle',
    副标题:   'Be the first to know about new arrivals and exclusive offers.',
    按钮:     'Subscribe',
    占位文字: 'Enter your email',
    显示延迟: 5000,       // 进入网站后延迟多少毫秒弹出（5000 = 5秒）
  },

  // ═══════════════════════════════════════════════════════════════════
  // 尺寸指南  Size Guide
  // ═══════════════════════════════════════════════════════════════════
  sizeGuide: {
    单位: 'cm',
    尺码表: {
      XS: { 胸围: '80-84',  腰围: '60-64',  臀围: '86-90'  },
      S:  { 胸围: '84-88',  腰围: '64-68',  臀围: '90-94'  },
      M:  { 胸围: '88-92',  腰围: '68-72',  臀围: '94-98'  },
      L:  { 胸围: '92-96',  腰围: '72-76',  臀围: '98-102' },
      XL: { 胸围: '96-100', 腰围: '76-80',  臀围: '102-106'},
    },
  },
};
