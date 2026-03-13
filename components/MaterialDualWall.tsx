'use client';

import PlaceholderImage from '@/components/PlaceholderImage';
import Link from 'next/link';
import { useId } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DualWallPanel {
  imageDesktop: string;
  /** 手机端独立图片（可选，默认复用 desktop） */
  imageMobile?: string;
  imageAlt?: string;
  href: string;
  /** 小标题，如 "THE ESSENTIAL" */
  subtitle?: string;
  /** 大标题，如 "Merino Wool" */
  title: string;
  /** 规格说明，如 "18.5µm • Everyday Luxury" */
  specs?: string;
  /** CTA 按钮文字，默认 "EXPLORE" */
  btnText?: string;
}

export interface DualWallColors {
  bgColor: string;
  headingColor: string;
  textColor: string;
  btnColor: string;
  btnBorderColor: string;
  /** 面板 hover 时按钮的背景色 */
  btnHoverBg: string;
  /** 面板 hover 时按钮的文字颜色 */
  btnHoverColor: string;
}

export interface MaterialDualWallProps {
  /** 左侧面板（Merino Wool） */
  leftPanel: DualWallPanel;
  /** 右侧面板（Cashmere） */
  rightPanel: DualWallPanel;
  colors?: Partial<DualWallColors>;
  /** 标题字体 CSS font-family */
  headingFont?: string;
  /** 正文字体 CSS font-family */
  textFont?: string;
  headingSize?: number;
  textSize?: number;
  btnSize?: number;
  containerWidth?: number;
  gridGap?: number;
  paddingSide?: number;
  desktopHeight?: number;
  mobilePaddingSide?: number;
  mobileGridGap?: number;
  paddingTop?: number;
  paddingBottom?: number;
  /** 两栏中间徽章文字，默认 "&" */
  badgeText?: string;
  /** 是否显示中间圆形徽章，默认 true */
  showBadge?: boolean;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: DualWallColors = {
  bgColor: '#E8DFD6',
  headingColor: '#FFFFFF',
  textColor: '#FFFFFF',
  btnColor: '#FFFFFF',
  btnBorderColor: '#FFFFFF',
  btnHoverBg: '#FFFFFF',
  btnHoverColor: '#000000',
};

// ─── Sub: Single Panel ────────────────────────────────────────────────────────

function Panel({ panel }: { panel: DualWallPanel }) {
  const hasMobile = Boolean(panel.imageMobile && panel.imageMobile !== panel.imageDesktop);

  return (
    <div className="dw-panel">
      {/* ── 背景图层 ── */}
      <div className="absolute inset-0 z-[1]">
        {hasMobile ? (
          <>
            {/* 桌面端图 */}
            <div className="absolute inset-0 hidden min-[769px]:block">
              <PlaceholderImage
                src={panel.imageDesktop}
                alt={panel.imageAlt ?? ''}
                fill
                loading="lazy"
                sizes="50vw"
                className="dw-img object-cover"
              />
            </div>
            {/* 手机端图 */}
            <div className="absolute inset-0 min-[769px]:hidden">
              <PlaceholderImage
                src={panel.imageMobile!}
                alt={panel.imageAlt ?? ''}
                fill
                loading="lazy"
                sizes="100vw"
                className="dw-img object-cover"
              />
            </div>
          </>
        ) : (
          <PlaceholderImage
            src={panel.imageDesktop}
            alt={panel.imageAlt ?? ''}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="dw-img object-cover"
          />
        )}
      </div>

      {/* ── 遮罩层（hover 时加深） ── */}
      <div className="dw-overlay absolute inset-0 z-[2]" />

      {/* ── 文字内容（hover 时上移出现） ── */}
      <div className="dw-content relative z-[3] text-center px-5">
        {panel.subtitle && (
          <span className="dw-subtitle">{panel.subtitle}</span>
        )}
        <h2 className="dw-title">{panel.title}</h2>
        {panel.specs && (
          <div className="dw-specs">
            <span>{panel.specs}</span>
          </div>
        )}
        {/* 按钮：hover 前不可见，panel hover 后滑入 */}
        <Link href={panel.href || '#'} className="dw-btn">
          {panel.btnText ?? 'EXPLORE'}
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MaterialDualWall({
  leftPanel,
  rightPanel,
  colors: colorsProp,
  headingFont = '"Assistant", serif',
  textFont = '"Assistant", sans-serif',
  headingSize = 36,
  textSize = 10,
  btnSize = 10,
  containerWidth = 1400,
  gridGap = 20,
  paddingSide = 0,
  desktopHeight = 600,
  mobilePaddingSide = 0,
  mobileGridGap = 5,
  paddingTop = 40,
  paddingBottom = 40,
  badgeText = '&',
  showBadge = true,
}: MaterialDualWallProps) {
  const uid = useId();
  const scopeId = `dw${uid.replace(/:/g, '')}`;

  const c: DualWallColors = { ...DEFAULT_COLORS, ...colorsProp };

  // Scoped CSS — 所有动态值（颜色/尺寸）和无法用 Tailwind 静态表达的 hover 效果
  const css = [
    // 全局去蓝
    `#${scopeId} a{color:inherit;text-decoration:none}`,

    // ── Section padding（桌面端，移动端见下） ──
    `#${scopeId}{`,
    `  padding-top:${paddingTop}px;padding-bottom:${paddingBottom}px;`,
    `  padding-left:${paddingSide}px;padding-right:${paddingSide}px`,
    `}`,

    // ── Panel 基础布局 + 伸缩动画 ──
    `#${scopeId} .dw-panel{`,
    `  position:relative;flex:1;overflow:hidden;`,
    `  display:flex;align-items:center;justify-content:center;cursor:pointer;`,
    `  transition:flex 0.6s ease`,
    `}`,
    `#${scopeId} .dw-panel:hover{flex:1.5}`,

    // 图片：hover 时轻微放大
    `#${scopeId} .dw-img{transition:transform 1.2s ease}`,
    `#${scopeId} .dw-panel:hover .dw-img{transform:scale(1.05)}`,

    // 遮罩：hover 时加深
    `#${scopeId} .dw-overlay{background:rgba(0,0,0,0.25);transition:background 0.5s ease}`,
    `#${scopeId} .dw-panel:hover .dw-overlay{background:rgba(0,0,0,0.4)}`,

    // 内容：默认偏下，hover 时复位
    `#${scopeId} .dw-content{transform:translateY(10px);transition:transform 0.5s ease}`,
    `#${scopeId} .dw-panel:hover .dw-content{transform:translateY(0)}`,

    // ── 标题 ──
    `#${scopeId} .dw-title{`,
    `  font-family:${headingFont};font-weight:300;font-size:${headingSize}px;`,
    `  color:${c.headingColor};letter-spacing:0.2em;`,
    `  margin-bottom:15px;text-shadow:0 2px 10px rgba(0,0,0,0.2)`,
    `}`,

    // ── 副标题 ──
    `#${scopeId} .dw-subtitle{`,
    `  display:block;font-family:${textFont};font-weight:400;font-size:${textSize}px;`,
    `  color:${c.textColor};letter-spacing:2px;text-transform:uppercase;`,
    `  margin-bottom:10px;opacity:0.9;line-height:1.6`,
    `}`,

    // ── 规格文字（加边框横线） ──
    `#${scopeId} .dw-specs{`,
    `  font-family:${textFont};font-weight:400;font-size:${textSize}px;`,
    `  color:${c.textColor};letter-spacing:1px;opacity:0.8;line-height:1.6;`,
    `  display:inline-block;padding:8px 0;margin-bottom:25px;`,
    `  border-top:1px solid rgba(255,255,255,0.4);border-bottom:1px solid rgba(255,255,255,0.4)`,
    `}`,

    // ── CTA 按钮：默认隐藏，panel hover 时滑入并显示颜色 ──
    `#${scopeId} .dw-btn{`,
    `  font-family:${textFont};font-weight:400;font-size:${btnSize}px;`,
    `  color:${c.btnColor};border:1px solid ${c.btnBorderColor};`,
    `  display:inline-block;padding:10px 25px;`,
    `  letter-spacing:2px;text-transform:uppercase;background:transparent;`,
    `  transition:all 0.3s ease;opacity:0;transform:translateY(10px)`,
    `}`,
    // panel hover → 按钮出现 + 切换为 hover 配色
    `#${scopeId} .dw-panel:hover .dw-btn{`,
    `  opacity:1;transform:translateY(0);`,
    `  background:${c.btnHoverBg};color:${c.btnHoverColor}`,
    `}`,

    // ── 手机端 ──
    `@media(max-width:768px){`,
    `  #${scopeId}{padding-left:${mobilePaddingSide}px;padding-right:${mobilePaddingSide}px}`,
    `  #${scopeId} .dw-container{flex-direction:column;height:auto;gap:${mobileGridGap}px}`,
    `  #${scopeId} .dw-panel{height:400px;width:100%;flex:none}`,
    // 手机无 hover → flex 不变
    `  #${scopeId} .dw-panel:hover{flex:none}`,
    // 手机端按钮始终可见
    `  #${scopeId} .dw-btn{opacity:1;transform:none}`,
    `  #${scopeId} .dw-badge{display:none}`,
    `}`,
  ].join('\n');

  return (
    <section
      id={scopeId}
      className="w-full flex justify-center"
      style={{ backgroundColor: c.bgColor }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 两列容器 */}
      <div
        className="dw-container relative flex w-full"
        style={{ maxWidth: containerWidth, height: desktopHeight, gap: gridGap }}
      >
        <Panel panel={leftPanel} />

        {/* 中间圆形徽章（桌面端可见，手机端隐藏） */}
        {showBadge && (
          <div
            className="dw-badge absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[60px] h-[60px] bg-white rounded-full flex items-center justify-content-center"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: 24, color: '#1a1a1a' }}>
              {badgeText}
            </span>
          </div>
        )}

        <Panel panel={rightPanel} />
      </div>
    </section>
  );
}
