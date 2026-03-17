'use client';

import PlaceholderImage from '@/components/PlaceholderImage';
import Link from 'next/link';
import { useId, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductCard {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  /** 已格式化的价格字符串，如 "¥ 1,280.00" */
  price: string;
  href: string;
}

export interface PanelConfig {
  /** 桌面端大图 URL */
  imageDesktop: string;
  /** 手机端大图 URL（可选，默认复用 desktop） */
  imageMobile?: string;
  imageAlt?: string;
  /** 大图上的主标题 */
  title: string;
  /** 大图上的副标题 */
  description?: string;
  /** 大图下方的正文段落 */
  body?: string;
  /** 右侧产品卡片列表（最多4张，2列×2行） */
  products: ProductCard[];
}

export interface EditorialColors {
  /** 大图上叠加的标题/副标题颜色（建议白色） */
  headingColor: string;
  /** 产品名称、价格、切换按钮文字颜色 */
  textColor: string;
  /** 激活标签下划线颜色 */
  accentColor: string;
}

export interface EditorialPanelProps {
  tab1Label?: string;
  tab2Label?: string;
  /** 第一个面板数据（Women） */
  panel1: PanelConfig;
  /** 第二个面板数据（Men） */
  panel2: PanelConfig;
  colors?: Partial<EditorialColors>;
  /** 标题字体 CSS font-family 值，如 `'"Cormorant Garamond", serif'` */
  headingFont?: string;
  /** 正文字体 CSS font-family 值，如 `'"Assistant", sans-serif'` */
  textFont?: string;
  /** 桌面端标题字号（px） */
  headingSize?: number;
  /** 正文基础字号（px） */
  textSize?: number;
  /** 容器最大宽度（px） */
  containerWidth?: number;
  /** 桌面端左右内边距（px） */
  pcGutter?: number;
  /** 手机端左右内边距（px） */
  mobGutter?: number;
  /**
   * 外部 Tab 控制（受控模式）。
   * - 传入时：组件不渲染内置 Tab，由外部驱动（适合与页面级 Women/Men 联动）。
   * - 不传时：组件自行维护内置 Tab 状态。
   */
  activeTab?: 0 | 1;
  /** 受控模式下，用户点击 Tab 时的回调 */
  onTabChange?: (tab: 0 | 1) => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: EditorialColors = {
  headingColor: '#FFFFFF',
  textColor: '#1a1a1a',
  accentColor: '#A05E46',
};

// ─── Sub: Product Card ────────────────────────────────────────────────────────

function ProductCardItem({
  card,
  textFont,
  textSize,
  textColor,
}: {
  card: ProductCard;
  textFont: string;
  textSize: number;
  textColor: string;
}) {
  return (
    <div className="text-center group">
      <Link href={card.href || '#'}>
        {/* 4:5 比例图片容器，悬停时内图缩放 */}
        <div
          className="relative overflow-hidden bg-[#E8DFD6] mb-[15px]"
          style={{ aspectRatio: '4/5' }}
        >
          <PlaceholderImage
            src={card.imageUrl}
            alt={card.imageAlt ?? card.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            className="object-cover transition-transform duration-[600ms] ease-in-out group-hover:scale-105"
          />
        </div>
        <p
          className="ep-card-text mb-[5px]"
          style={{ fontFamily: textFont, fontSize: textSize, color: textColor, lineHeight: 1.6 }}
        >
          {card.title}
        </p>
        <p
          className="ep-card-text opacity-80"
          style={{ fontFamily: textFont, fontSize: textSize, color: textColor, lineHeight: 1.6 }}
        >
          {card.price}
        </p>
      </Link>
    </div>
  );
}

// ─── Sub: Content Panel ───────────────────────────────────────────────────────

function ContentPanel({
  config,
  headingFont,
  headingSize,
  textFont,
  textSize,
  colors,
  isActive,
}: {
  config: PanelConfig;
  headingFont: string;
  headingSize: number;
  textFont: string;
  textSize: number;
  colors: EditorialColors;
  isActive: boolean;
}) {
  const hasMobile = Boolean(
    config.imageMobile && config.imageMobile !== config.imageDesktop,
  );

  return (
    // display 用 inline style 控制（flex/none），flex 方向由 scoped CSS 媒体查询控制
    <div className="ep-panel gap-[25px]" style={{ display: isActive ? 'flex' : 'none' }}>

      {/* ── 左侧：大图 + 文字在下方 ── */}
      <div className="ep-hero-wrapper" style={{ flex: '1 1 50%' }}>
        {/* 图片容器 */}
        <div
          className="ep-hero-col relative overflow-hidden bg-[#E8DFD6] min-h-0"
          style={{ aspectRatio: '4/5' }}
        >
          {hasMobile ? (
            <>
              <div className="absolute inset-0 hidden min-[769px]:block">
                <PlaceholderImage
                  src={config.imageDesktop}
                  alt={config.imageAlt ?? ''}
                  fill
                  sizes="50vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute inset-0 min-[769px]:hidden">
                <PlaceholderImage
                  src={config.imageMobile!}
                  alt={config.imageAlt ?? ''}
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                />
              </div>
            </>
          ) : (
            <PlaceholderImage
              src={config.imageDesktop}
              alt={config.imageAlt ?? ''}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
          )}
        </div>

        {/* 标题文字（图片下方，居中，统一文字颜色） */}
        <div style={{ textAlign: 'center', padding: '18px 0 0' }}>
          <h2
            className="ep-hero-title"
            style={{
              fontFamily: headingFont,
              fontSize: headingSize,
              fontWeight: 300,
              color: colors.textColor,
              letterSpacing: '0.15em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {config.title}
          </h2>
          {config.description && (
            <p
              style={{
                fontFamily: textFont,
                fontSize: `calc(${textSize}px * 0.85)`,
                color: '#555555',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                lineHeight: 1.6,
                margin: '6px 0 0',
              }}
            >
              {config.description}
            </p>
          )}
          {config.body && (
            <p
              style={{
                fontFamily: textFont,
                fontSize: `${textSize}px`,
                color: '#555555',
                lineHeight: 1.8,
                margin: '12px auto 0',
                maxWidth: '520px',
                padding: '0 16px',
              }}
            >
              {config.body}
            </p>
          )}
        </div>
      </div>

      {/* ── 右侧：2列产品网格 ── */}
      <div
        className="ep-product-grid grid grid-cols-2"
        style={{ flex: '1 1 45%', gap: '25px 15px' }}
      >
        {config.products.map((card, idx) => (
          <ProductCardItem
            key={idx}
            card={card}
            textFont={textFont}
            textSize={textSize}
            textColor={colors.textColor}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EditorialPanel({
  tab1Label = 'Women',
  tab2Label = 'Men',
  panel1,
  panel2,
  colors: colorsProp,
  headingFont = 'var(--font-cormorant), "Cormorant", serif',
  textFont = 'var(--font-montserrat), "Montserrat", sans-serif',
  headingSize = 28,
  textSize = 14,
  containerWidth = 1400,
  pcGutter = 30,
  mobGutter = 20,
  activeTab: activeTabProp,
  onTabChange,
}: EditorialPanelProps) {
  const uid = useId();
  // useId 生成含冒号的字符串，替换为合法 CSS ID
  const scopeId = `ep${uid.replace(/:/g, '')}`;
  const [internalTab, setInternalTab] = useState<0 | 1>(0);
  const isControlled = activeTabProp !== undefined;
  const activeTab = isControlled ? activeTabProp! : internalTab;

  function handleTabClick(tab: 0 | 1) {
    if (isControlled) {
      onTabChange?.(tab);
    } else {
      setInternalTab(tab);
    }
  }

  const c: EditorialColors = { ...DEFAULT_COLORS, ...colorsProp };

  // Scoped CSS：仅处理无法通过 Tailwind 表达的动态/媒体查询样式
  const css = [
    // 全局去蓝（链接继承父色）
    `#${scopeId} a{color:inherit!important;text-decoration:none}`,
    // 面板默认竖排（移动端），桌面端转横排
    `#${scopeId} .ep-panel{flex-direction:column;gap:20px}`,
    `@media(min-width:769px){#${scopeId} .ep-panel{flex-direction:row;gap:25px}}`,
    // 移动端响应式
    `@media(max-width:768px){`,
    `  #${scopeId} .ep-inner{padding-left:0!important;padding-right:0!important}`,
    `  #${scopeId} .ep-hero-wrapper{flex:none!important;width:100%}`,
    `  #${scopeId} .ep-hero-col{aspect-ratio:3/2!important}`,
    // 手机端2列并排，列间距8px
    `  #${scopeId} .ep-product-grid{flex:none!important;width:100%;grid-template-columns:repeat(2,1fr)!important;gap:12px 8px!important}`,
    `  #${scopeId} .ep-hero-title{font-size:calc(${headingSize}px * 0.75)!important}`,
    `  #${scopeId} .ep-card-text{font-size:calc(${textSize}px * 0.9)!important}`,
    `}`,
  ].join('\n');

  const tabs = [
    { label: tab1Label, panel: panel1 },
    { label: tab2Label, panel: panel2 },
  ] as const;

  return (
    // 外层 section 全宽，承载背景色
    <section
      id={scopeId}
      style={{ backgroundColor: '#E8DFD6', padding: '40px 0' }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 内层容器限制最大宽度 */}
      <div
        className="ep-inner"
        style={{
          maxWidth: containerWidth,
          margin: '0 auto',
          padding: `0 ${pcGutter}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* ── Tab 切换按钮组（受控模式下仍渲染，允许外部感知点击） ── */}
        <div className="text-center mb-[30px]">
          {tabs.map(({ label }, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleTabClick(i as 0 | 1)}
                className="px-[25px] py-[10px] bg-transparent border-none cursor-pointer relative transition-all duration-300"
                style={{
                  fontFamily: textFont,
                  fontSize: `calc(${textSize}px * 1.1)`,
                  color: isActive ? c.textColor : '#555555',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '1px',
                  lineHeight: 1.6,
                }}
              >
                {label}
                {/* 激活下划线（替代 CSS ::after 伪元素，方便用 JS/State 驱动颜色） */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-[10%] w-[80%] h-[1.5px] block transition-colors duration-300"
                  style={{ backgroundColor: isActive ? c.accentColor : 'transparent' }}
                />
              </button>
            );
          })}
        </div>

        {/* ── 内容面板（两个都渲染，display 切换，切换瞬时无闪烁） ── */}
        {tabs.map(({ panel }, i) => (
          <ContentPanel
            key={i}
            config={panel}
            headingFont={headingFont}
            headingSize={headingSize}
            textFont={textFont}
            textSize={textSize}
            colors={c}
            isActive={activeTab === i}
          />
        ))}
      </div>
    </section>
  );
}
