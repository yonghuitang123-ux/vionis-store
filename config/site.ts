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
    手机端左图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_4.webp?v=1773731718',   // 3:4 竖版 500×667

    // 右侧图片（建议竖版，800×1200 以上）
    电脑端右图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_100-percent-merino-wool-hand-knitting-impressionist-oil-painting-desktop_3f44612e-9de7-43fb-8a78-4c05746f0cf9.webp?v=1770369606',
    手机端右图: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_4.webp?v=1773731718',   // 3:4 竖版 500×667

    标题:       'THE SPRING COLLECTION',
    副标题:     '100% ALXA CASHMERE & AUSTRALIAN MERINO',

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
    女装大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONISXY-cashmere-vest-women-french-style-beige-look-4x5.webp?v=1774341649',
    女装大图_手机端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONISXY-cashmere-vest-women-minimalist-outfit-16x9_webp.webp?v=1774341648',

    // 男装 hero 大图
    男装大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONISXY-merino-wool-blazer-men-minimalist-4x5.webp?v=1774341649',
    男装大图_手机端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONISXY-merino-wool-jacket-texture-men-16x9.webp?v=1774341648',

    // 图片下方的文字叠层
    女装标题:   'The Spring Cashmere',
    女装副标题: 'ALXA, INNER MONGOLIA · 100% CASHMERE',
    女装正文:   'Every fibre is sourced from white cashmere goats roaming the Alxa desert of Inner Mongolia. Our spring edit selects only the finest first-clip fleece at around 14.5 microns, crafted into lighter weights that preserve the natural softness and warmth cashmere is known for. Same origin, gentler touch.',
    男装标题:   'The Cashmere Structure',
    男装副标题: 'ALXA, INNER MONGOLIA · SPRING EDITION',
    男装正文:   'The Alxa white cashmere goat produces some of the world\'s finest fibres. Our spring collection carries the same structured silhouettes and uncompromising quality, re-engineered in lighter gauges for the transitional season. Less weight, nothing lost.',

    // Shopify collection handle（暂保留备用）
    女装产品系列: 'women',
    男装产品系列: 'men',

    // ── 首页产品网格：指定精确展示的产品 handle（顺序即展示顺序）──
    女装产品handles: [
      '100-merino-wool-seamless-base-layer-heather-grey',                  // 上：16µm The Seamless Merino Layer (190g) — 半身
      'the-30-cashmere-polo-vest',                                        // 上：The Cashmere-Merino Vest (210g) — 半身
      'the-signature-ribbed-midi-skirt-100-inner-mongolia-cashmere-220g', // 下：The Signature Ribbed Midi Skirt (220g) — 全身
      'the-360g-essential-cashmere-maxi-skirt',                           // 下：The 360g Essential Cashmere Maxi Skirt — 全身
    ],
    男装产品handles: [
      'the-essential-100-cashmere-v-neck-vest-180g-ultra-fine-knit',      // The Essential Cashmere Vest (180g)
      'the-signature-v-neck-100-inner-mongolia-cashmere-cardigan-280g',   // The Signature Cardigan (280g)
      'the-100-pure-cashmere-crew-280g',                                  // The Classic Cashmere Crew (280g)
      'the-heritage-cable-knit-quarter-zip-100-inner-mongolian-cashmere', // The Heritage Quarter-Zip (330g)
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 轮播看款  FeaturedLook（左侧模特大图 + 右侧产品缩图）
  // ═══════════════════════════════════════════════════════════════════
  // 说明：每条轮播完全手动填写，与 Shopify 后台无关。
  //       最多支持 8 条（前 4 条为 Women，后 4 条为 Men）。
  //       未填写的条目不显示。
  featuredLook: {

    // ── 女装 Women（轮播 1–10）─────────────────────────────────────────
    // 1. The Merino Tie-Bonnet — Cocoa
    轮播1_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/2546.webp?v=1770621760',
    轮播1_模特大图_手机端: '',
    轮播1_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_The_Merino_Tie-Bonnet_80g_100_merino_wool_cocoa9.webp?v=1770656169',
    轮播1_产品名称:         'The Merino Tie-Bonnet（80g)',
    轮播1_产品价格:         '$56.00',
    轮播1_产品链接:         '/products/the-merino-tie-bonnet-100-wool-80g',

    // 2. The Merino Tie-Bonnet — Scarlet
    轮播2_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XYTheMerinoTie-Bonnet_80g_100_merinowoolScarlet3.webp?v=1770621952',
    轮播2_模特大图_手机端: '',
    轮播2_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XYTheMerinoTie-Bonnet_80g_100_merinowoolScarlet2.webp?v=1770621974',
    轮播2_产品名称:         'The Merino Tie-Bonnet — Scarlet',
    轮播2_产品价格:         '$56.00',
    轮播2_产品链接:         '/products/the-merino-tie-bonnet-100-wool-80g',

    // 3–8. [预留 — 如需添加薄款女装轮播，填入此处]
    轮播3_模特大图_电脑端: '',
    轮播3_模特大图_手机端: '',
    轮播3_右侧小图:         '',
    轮播3_产品名称:         '',
    轮播3_产品价格:         '',
    轮播3_产品链接:         '#',

    轮播4_模特大图_电脑端: '',
    轮播4_模特大图_手机端: '',
    轮播4_右侧小图:         '',
    轮播4_产品名称:         '',
    轮播4_产品价格:         '',
    轮播4_产品链接:         '#',

    轮播5_模特大图_电脑端: '',
    轮播5_模特大图_手机端: '',
    轮播5_右侧小图:         '',
    轮播5_产品名称:         '',
    轮播5_产品价格:         '',
    轮播5_产品链接:         '#',

    轮播6_模特大图_电脑端: '',
    轮播6_模特大图_手机端: '',
    轮播6_右侧小图:         '',
    轮播6_产品名称:         '',
    轮播6_产品价格:         '',
    轮播6_产品链接:         '#',

    轮播7_模特大图_电脑端: '',
    轮播7_模特大图_手机端: '',
    轮播7_右侧小图:         '',
    轮播7_产品名称:         '',
    轮播7_产品价格:         '',
    轮播7_产品链接:         '#',

    轮播8_模特大图_电脑端: '',
    轮播8_模特大图_手机端: '',
    轮播8_右侧小图:         '',
    轮播8_产品名称:         '',
    轮播8_产品价格:         '',
    轮播8_产品链接:         '#',

    // 9. The Ribbed Midi Skirt — Camel
    轮播9_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS-XY-100-Percent-Inner-Mongolian-Cashmere-Camel-Ribbed-Midi-Skirt-220g-Lookbook.webp?v=1772030758',
    轮播9_模特大图_手机端: '',
    轮播9_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS-XY-100-Percent-Inner-Mongolian-Cashmere-Architectural-Ribbing-Detail.webp?v=1772030779',
    轮播9_产品名称:         'The Signature Ribbed Midi Skirt（220g）',
    轮播9_产品价格:         '$285.00',
    轮播9_产品链接:         '/products/the-signature-ribbed-midi-skirt-100-inner-mongolia-cashmere-220g',

    // 10. The Side-Button Midi Skirt — Heather Grey
    轮播10_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/100_InnerMongoliaCashmereButton-FrontMidiSkirt_330gPremiumKnitVIONIS_XYheathergrey5.webp?v=1772028650',
    轮播10_模特大图_手机端: '',
    轮播10_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/100_InnerMongoliaCashmereButton-FrontMidiSkirt_330gPremiumKnitVIONIS_XYheathergrey8.webp?v=1772028650',
    轮播10_产品名称:         'Cashmere Side-Button Midi Skirt',
    轮播10_产品价格:         '$267.00',
    轮播10_产品链接:         '/products/vionis-xy-ribbed-inner-mongolian-cashmere-side-button-midi-skirt',

    // ── 男装 Men（轮播 11–20）─────────────────────────────────────────
    // 11. [预留 — 如需添加薄款男装轮播，填入此处]
    轮播11_模特大图_电脑端: '',
    轮播11_模特大图_手机端: '',
    轮播11_右侧小图:         '',
    轮播11_产品名称:         '',
    轮播11_产品价格:         '',
    轮播11_产品链接:         '#',

    // 12. The Classic Cashmere Crew
    轮播12_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_premium_turtleneck_sweater_made_from_100_Inner_Mongolia_cashmere_heavyweight_393g_to_445g1_c452a3f0-5478-4442-a5af-577572f125e8.webp?v=1770801892',
    轮播12_模特大图_手机端: '',
    轮播12_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_premium_turtleneck_sweater_made_from_100_Inner_Mongolia_cashmere_heavyweight_393g_to_445g8_0e4f501b-b2bb-4470-a3cd-4f6f526ffdcf.webp?v=1770802030',
    轮播12_产品名称:         'The Classic Cashmere Crew（280g）',
    轮播12_产品价格:         '$245.00',
    轮播12_产品链接:         '/products/the-100-pure-cashmere-crew-280g',

    // 13. [预留]
    轮播13_模特大图_电脑端: '',
    轮播13_模特大图_手机端: '',
    轮播13_右侧小图:         '',
    轮播13_产品名称:         '',
    轮播13_产品价格:         '',
    轮播13_产品链接:         '#',

    // 14. The Signature Cardigan — Charcoal Grey
    轮播14_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-signature-v-neck-cashmere-cardigan-280g-charcoal-grey-model-front4.webp?v=1770629892',
    轮播14_模特大图_手机端: '',
    轮播14_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-signature-v-neck-cashmere-cardigan-280g-charcoal-grey-model-front3.webp?v=1770629892',
    轮播14_产品名称:         'The Signature Cardigan（280g）',
    轮播14_产品价格:         '$273.00',
    轮播14_产品链接:         '/products/the-signature-v-neck-100-inner-mongolia-cashmere-cardigan-280g',

    // 15. [预留]
    轮播15_模特大图_电脑端: '',
    轮播15_模特大图_手机端: '',
    轮播15_右侧小图:         '',
    轮播15_产品名称:         '',
    轮播15_产品价格:         '',
    轮播15_产品链接:         '#',

    // 16. The 16um Skipper Polo
    轮播16_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY16_mSuperfineMerinoWoolJohnnyCollarPolo9.webp?v=1770806722',
    轮播16_模特大图_手机端: '',
    轮播16_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY16_mSuperfineMerinoWoolJohnnyCollarPolo1_2.webp?v=1770806722',
    轮播16_产品名称:         'The 16um Skipper Polo（225g）',
    轮播16_产品价格:         '$117.00',
    轮播16_产品链接:         '/products/the-16um-superfine-merino-skipper-polo-spun-by-xinao-100-wool-225g',

    // 17. [预留]
    轮播17_模特大图_电脑端: '',
    轮播17_模特大图_手机端: '',
    轮播17_右侧小图:         '',
    轮播17_产品名称:         '',
    轮播17_产品价格:         '',
    轮播17_产品链接:         '#',

    // 18. The Essential Cashmere Vest — Camel
    轮播18_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionisxy-100-percent-inner-mongolia-cashmere-v-neck-vest-Camel-front1.webp?v=1770655272',
    轮播18_模特大图_手机端: '',
    轮播18_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionisxy-100-percent-inner-mongolia-cashmere-v-neck-vest-Camel-front4.webp?v=1770655290',
    轮播18_产品名称:         'The Essential Cashmere Vest（180g）',
    轮播18_产品价格:         '$221.00',
    轮播18_产品链接:         '/products/the-essential-100-cashmere-v-neck-vest-180g-ultra-fine-knit',

    // 19. The Cashmere-Merino Vest — Classic Camel
    轮播19_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_cashmere_merino_vest_made_from_70_fine_merino_wool_and_30_Grade_A_cashmere_sleeveless_knit_vest_with_polo_collar23.webp?v=1770644947',
    轮播19_模特大图_手机端: '',
    轮播19_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_cashmere_merino_vest_made_from_70_fine_merino_wool_and_30_Grade_A_cashmere_sleeveless_knit_vest_with_polo_collar3.webp?v=1770644947',
    轮播19_产品名称:         'The Cashmere-Merino Vest（210g）',
    轮播19_产品价格:         '$229.00',
    轮播19_产品链接:         '/products/the-30-cashmere-polo-vest',

    // 20. The 16um Worsted Crewneck — Camel
    轮播20_模特大图_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_16_m_100s_Worsted_Merino_Wool_Crewneck_Sweater_camel.webp?v=1770806046',
    轮播20_模特大图_手机端: '',
    轮播20_右侧小图:         'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/VIONIS_XY_16_m_100s_Worsted_Merino_Wool_Crewneck_Sweater_2.webp?v=1770805976',
    轮播20_产品名称:         'The 16um Worsted Crewneck（350g）',
    轮播20_产品价格:         '$143.00',
    轮播20_产品链接:         '/products/the-16um-superfine-merino-crewneck-100s-worsted-wool',

    // 通用文字（所有轮播条目共用）
    副标签文字:   'THE LOOK',
    查看按钮文字: 'VIEW PRODUCT',
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
    签名:   'VIONIS·XY',
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

    // 静态回退文章 — 仅当 Shopify API 不可用时显示
    // 请保持与 Shopify 最新 4 篇博客文章同步
    文章列表: [
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-alashan-cashmere-goats-inner-mongolia-source.webp?v=1773412607',
        图片_手机端: '',
        文章标题: 'Cashmere Care Guide: Everything You Need to Know',
        文章正文: 'Learn how to wash, store, and maintain your cashmere garments to keep them looking beautiful for years.',
        链接: '/blog/cashmere-care',
      },
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-merino-wool-yarn-texture-closeup.webp?v=1773412220',
        图片_手机端: '',
        文章标题: 'Merino Wool Base Layer vs Cashmere: Which Is Better?',
        文章正文: 'A detailed comparison of two luxury natural fibers — which one suits your lifestyle and wardrobe best?',
        链接: '/blog/merino-wool-base-layer',
      },
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-sgs-certified-100-percent-cashmere-lab-report.webp?v=1773412943',
        图片_手机端: '',
        文章标题: 'Is Cashmere Worth It? A Cost-Per-Wear Breakdown',
        文章正文: 'We break down the real cost of cashmere versus fast fashion — the numbers may surprise you.',
        链接: '/blog/is-cashmere-worth-it-a-brutally-honest-cost-per-wear-analysis',
      },
      {
        图片_电脑端: 'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/vionis-xy-cashmere-turtleneck-quiet-luxury_lifestyle..webp?v=1773412185',
        图片_手机端: '',
        文章标题: 'Why Is Cashmere So Expensive?',
        文章正文: 'From Inner Mongolian pastures to your wardrobe — the journey that makes cashmere one of the rarest fibers on earth.',
        链接: '/blog/why-is-cashmere-so-expensive-the-real-cost-explained',
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
      { 文字: 'CERTIFIED HIGH-QUALITY CASHMERE | Inner Mongolia Origin · Grade A Fiber',                         翻译键: 'announcement.certified'     },
      { 文字: 'SPRING/SUMMER 2026 — New Arrivals Now Available · Complimentary Worldwide Shipping on All Orders', 翻译键: 'announcement.newArrivals'   },
      { 文字: 'FROM FIBER TO FABRIC — Traceable Craftsmanship · Ethically Sourced · Naturally Sustainable',       翻译键: 'announcement.craftsmanship' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 顶部导航菜单  Navigation
  // ═══════════════════════════════════════════════════════════════════
  nav: {
    // 说明：颜色字段可选，留空默认 #1a1a1a（深色）
    菜单: [
      { 文字: 'Spring/Summer 2026', 链接: '/', 颜色: '#5C4830',         翻译键: 'nav.springSummer' },
      { 文字: 'Cashmere',           链接: '/collections/cashmere',      翻译键: 'nav.cashmere'     },
      { 文字: 'Merino Wool',        链接: '/collections/merino',        翻译键: 'nav.merinoWool'   },
      { 文字: 'New Arrivals',       链接: '/collections/new-arrivals',  翻译键: 'nav.newArrivals'  },
      { 文字: 'Journal',            链接: '/blog',                       翻译键: 'nav.journal'      },
      { 文字: 'News',               链接: '/news',                       翻译键: 'nav.news'         },
      { 文字: 'Shop All',           链接: '/collections/shop-all',      翻译键: 'nav.shopAll'      },
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
    显示延迟: 60000,      // 进入网站后延迟多少毫秒弹出（60000 = 60秒）
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
