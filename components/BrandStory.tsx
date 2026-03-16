'use client';

import PlaceholderImage from '@/components/PlaceholderImage';
import { useId } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BrandStoryColors {
  bgColor: string;
  headingColor: string;
  textColor: string;
}

export interface BrandStoryProps {
  /** 左侧竖构图主图 URL */
  mainImage: string;
  mainImageAlt?: string;
  /** 右侧方形副图 URL */
  subImage: string;
  subImageAlt?: string;

  /** 小标题，如 "THE PHILOSOPHY" */
  subtitle?: string;
  /** 主标题，如 "Quiet Confidence" */
  title: string;
  /** 正文段落 */
  text?: string;
  /** 签名 / 品牌标语（渲染为手写体风格） */
  signature?: string;

  colors?: Partial<BrandStoryColors>;

  /** 主标题字体 CSS font-family */
  headingFont?: string;
  /** 正文字体 CSS font-family */
  textFont?: string;
  headingSize?: number;
  textSize?: number;

  containerWidth?: number;
  /** 左侧主图高度（px） */
  mainImgHeight?: number;
  /** 右侧副图高度（px） */
  subImgHeight?: number;
  /** 副图向下偏移（px），制造错落感 */
  subImgOffset?: number;

  pcGutter?: number;
  mobGutter?: number;
  paddingTop?: number;
  paddingBottom?: number;
  mobilePaddingTop?: number;
  mobilePaddingBottom?: number;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: BrandStoryColors = {
  bgColor: '#E8DFD6',
  headingColor: '#1a1a1a',
  textColor: '#555555',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BrandStory({
  mainImage,
  mainImageAlt = '',
  subImage,
  subImageAlt = '',
  subtitle,
  title,
  text,
  signature,
  colors: colorsProp,
  headingFont = 'var(--font-cormorant), "Cormorant", serif',
  textFont = 'var(--font-montserrat), "Montserrat", sans-serif',
  headingSize = 48,
  textSize = 14,
  containerWidth = 1400,
  mainImgHeight = 650,
  subImgHeight = 400,
  subImgOffset = 50,
  pcGutter = 30,
  mobGutter = 20,
  paddingTop = 100,
  paddingBottom = 100,
  mobilePaddingTop = 60,
  mobilePaddingBottom = 60,
}: BrandStoryProps) {
  const uid = useId();
  const scopeId = `bs${uid.replace(/:/g, '')}`;
  const c: BrandStoryColors = { ...DEFAULT_COLORS, ...colorsProp };

  // Scoped CSS — 动态颜色/尺寸 + 无法用 Tailwind 静态表达的 hover 过渡
  const css = [
    // ── Section 上下留白 ──
    `#${scopeId}{padding-top:${paddingTop}px;padding-bottom:${paddingBottom}px;overflow:hidden}`,

    // ── 三栏容器 ──
    `#${scopeId} .bs-container{`,
    `  max-width:${containerWidth}px;margin:0 auto;`,
    `  display:flex;align-items:center;justify-content:space-between;`,
    `  gap:60px;padding:0 ${pcGutter}px`,
    `}`,

    // ── 列比例 ──
    `#${scopeId} .bs-col-left{flex:1.2}`,
    `#${scopeId} .bs-col-center{flex:1;padding:0 20px;text-align:left}`,
    // 副图整体下沉，制造错落感
    `#${scopeId} .bs-col-right{flex:0.8;transform:translateY(${subImgOffset}px)}`,

    // ── 图片容器（固定高度 + overflow hidden 实现裁切） ──
    `#${scopeId} .bs-main-img{width:100%;height:${mainImgHeight}px;overflow:hidden;position:relative}`,
    `#${scopeId} .bs-sub-img{width:100%;height:${subImgHeight}px;overflow:hidden;position:relative}`,

    // ── 图片过渡（hover 时轻微放大） ──
    `#${scopeId} .bs-img{transition:transform 1.5s cubic-bezier(0.25,1,0.5,1)}`,
    `#${scopeId}:hover .bs-main-img .bs-img{transform:scale(1.03)}`,
    `#${scopeId}:hover .bs-sub-img .bs-img{transform:scale(1.05)}`,

    // ── 标题字体 ──
    `#${scopeId} .bs-heading{`,
    `  font-family:${headingFont};font-weight:300;font-size:${headingSize}px;`,
    `  color:${c.headingColor};letter-spacing:0.2em;line-height:1.1;margin-bottom:30px`,
    `}`,

    // ── 正文字体（overline / text / sign 共用基础） ──
    `#${scopeId} .bs-overline,#${scopeId} .bs-text,#${scopeId} .bs-sign{`,
    `  font-family:${textFont};font-weight:400;font-size:${textSize}px;`,
    `  color:${c.textColor};line-height:1.6`,
    `}`,

    // ── 小标题 overline ──
    `#${scopeId} .bs-overline{`,
    `  display:block;letter-spacing:3px;text-transform:uppercase;`,
    `  margin-bottom:20px;font-size:calc(${textSize}px * 0.85)`,
    `}`,

    // ── 正文 ──
    `#${scopeId} .bs-text{margin-bottom:40px;letter-spacing:0.5px}`,

    // ── 分割线 ──
    `#${scopeId} .bs-divider{`,
    `  width:60px;height:1px;background:${c.headingColor};margin-bottom:30px;opacity:0.3`,
    `}`,

    // ── 签名（手写体风格） ──
    `#${scopeId} .bs-sign{`,
    `  font-family:cursive,${textFont},serif;`,
    `  font-size:calc(${textSize}px * 1.8);opacity:0.8`,
    `}`,

    // ── 手机端（≤900px）堆叠布局 ──
    `@media(max-width:900px){`,
    `  #${scopeId}{padding-top:${mobilePaddingTop}px;padding-bottom:${mobilePaddingBottom}px}`,
    `  #${scopeId} .bs-container{flex-direction:column;gap:40px;padding:0 ${mobGutter}px}`,
    `  #${scopeId} .bs-col-left,`,
    `  #${scopeId} .bs-col-center,`,
    `  #${scopeId} .bs-col-right{width:100%;flex:auto;transform:none}`,
    `  #${scopeId} .bs-main-img{height:500px}`,
    // 副图在手机端偏右，制造错落感替代
    `  #${scopeId} .bs-sub-img{height:350px;margin-top:-20px;width:80%;margin-left:auto}`,
    // 移动端标题字号缩小 75%
    `  #${scopeId} .bs-heading{font-size:calc(${headingSize}px * 0.75)}`,
    `}`,
  ].join('\n');

  return (
    <section
      id={scopeId}
      style={{ backgroundColor: c.bgColor }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="bs-container">

        {/* ── 左列：主图（竖构图） ── */}
        <div className="bs-col-left">
          <div className="bs-main-img">
            <PlaceholderImage
              src={mainImage}
              alt={mainImageAlt}
              fill
              loading="lazy"
              sizes="(max-width: 900px) 90vw, 500px"
              className="bs-img object-cover"
            />
          </div>
        </div>

        {/* ── 中列：文字内容 ── */}
        <div className="bs-col-center">
          {subtitle && (
            <span className="bs-overline">{subtitle}</span>
          )}
          <h2 className="bs-heading">{title}</h2>
          <div className="bs-divider" />
          {text && (
            <p className="bs-text">{text}</p>
          )}
          {signature && (
            <div className="bs-sign">{signature}</div>
          )}
        </div>

        {/* ── 右列：副图（方形，向下错落） ── */}
        <div className="bs-col-right">
          <div className="bs-sub-img">
            <PlaceholderImage
              src={subImage}
              alt={subImageAlt}
              fill
              loading="lazy"
              sizes="(max-width: 900px) 80vw, 350px"
              className="bs-img object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
