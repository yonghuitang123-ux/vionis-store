'use client';

import Image from 'next/image';
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
          className="relative overflow-hidden bg-[#eeeeee] mb-[15px]"
          style={{ aspectRatio: '4/5' }}
        >
          <Image
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

      {/* ── 左侧：4:5 大图 + 文字叠层 ── */}
      <div
        className="relative overflow-hidden bg-[#f4f4f4] min-h-0"
        style={{ aspectRatio: '4/5', flex: '1 1 50%' }}
      >
        {hasMobile ? (
          <>
            {/* 桌面端显示 */}
            <div className="absolute inset-0 hidden min-[769px]:block">
              <Image
                src={config.imageDesktop}
                alt={config.imageAlt ?? ''}
                fill
                priority={isActive}
                sizes="50vw"
                className="object-cover"
              />
            </div>
            {/* 手机端显示 */}
            <div className="absolute inset-0 min-[769px]:hidden">
              <Image
                src={config.imageMobile!}
                alt={config.imageAlt ?? ''}
                fill
                priority={isActive}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </>
        ) : (
          <Image
            src={config.imageDesktop}
            alt={config.imageAlt ?? ''}
            fill
            priority={isActive}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}

        {/* 图片左下角文字叠层 */}
        <div className="absolute bottom-[30px] left-[30px] z-[5] text-left">
          <h3
            className="ep-hero-title"
            style={{
              fontFamily: headingFont,
              fontSize: headingSize,
              fontWeight: 300,
              color: colors.headingColor,
              letterSpacing: '0.2em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {config.title}
          </h3>
          {config.description && (
            <p
              style={{
                fontFamily: textFont,
                fontSize: `calc(${textSize}px * 0.85)`,
                color: colors.headingColor,
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                lineHeight: 1.6,
                margin: '5px 0 0',
              }}
            >
              {config.description}
            </p>
          )}
        </div>
      </div>

      {/* ── 右侧：2列产品网格 ── */}
      <div
        className="grid grid-cols-2"
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
  headingFont = '"Assistant", serif',
  textFont = '"Assistant", sans-serif',
  headingSize = 28,
  textSize = 14,
  containerWidth = 1400,
  pcGutter = 60,
  mobGutter = 20,
}: EditorialPanelProps) {
  const uid = useId();
  // useId 生成含冒号的字符串，替换为合法 CSS ID
  const scopeId = `ep${uid.replace(/:/g, '')}`;
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  const c: EditorialColors = { ...DEFAULT_COLORS, ...colorsProp };

  // Scoped CSS：仅处理无法通过 Tailwind 表达的动态/媒体查询样式
  const css = [
    // 全局去蓝（链接继承父色）
    `#${scopeId} a{color:inherit!important;text-decoration:none}`,
    // 面板默认竖排（移动端），桌面端转横排
    `#${scopeId} .ep-panel{flex-direction:column}`,
    `@media(min-width:769px){#${scopeId} .ep-panel{flex-direction:row}}`,
    // 移动端响应式
    `@media(max-width:768px){`,
    `  #${scopeId}{padding-left:${mobGutter}px;padding-right:${mobGutter}px}`,
    // !important 覆盖 inline style，实现移动端标题自动缩小
    `  #${scopeId} .ep-hero-title{font-size:calc(${headingSize}px * 0.75)!important}`,
    `  #${scopeId} .ep-card-text{font-size:calc(${textSize}px * 0.9)!important}`,
    `}`,
  ].join('\n');

  const tabs = [
    { label: tab1Label, panel: panel1 },
    { label: tab2Label, panel: panel2 },
  ] as const;

  return (
    <section
      id={scopeId}
      style={{
        maxWidth: containerWidth,
        margin: '40px auto',
        padding: `0 ${pcGutter}px`,
        boxSizing: 'border-box',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Tab 切换按钮组 ── */}
      <div className="text-center mb-[30px]">
        {tabs.map(({ label }, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i as 0 | 1)}
              className="px-[25px] py-[10px] bg-transparent border-none cursor-pointer relative transition-all duration-300"
              style={{
                fontFamily: textFont,
                fontSize: `calc(${textSize}px * 1.1)`,
                color: c.textColor,
                opacity: isActive ? 1 : 0.5,
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
    </section>
  );
}
