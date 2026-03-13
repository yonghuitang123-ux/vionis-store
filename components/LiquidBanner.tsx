'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LiquidBannerColors {
  outerBg: string;
  contentBg: string;
  headingColor: string;
  textColor: string;
  btnBg: string;
  btnText: string;
  btnBorder: string;
  btnHoverBg: string;
  btnHoverText: string;
  btnHoverBorder: string;
}

export interface BannerButton {
  text: string;
  href: string;
}

export interface LiquidBannerProps {
  /** PC 左侧图（必填） */
  leftImageDesktop: string;
  /** 手机端左侧图（可选，默认复用 desktop） */
  leftImageMobile?: string;
  leftImageAlt?: string;

  /** PC 右侧图（必填） */
  rightImageDesktop: string;
  /** 手机端右侧图（可选，默认复用 desktop） */
  rightImageMobile?: string;
  rightImageAlt?: string;

  heading?: string;
  description?: string;
  buttons?: BannerButton[];

  /**
   * 颜色主题，所有字段可选，未传的使用默认值。
   * 使用外部 Image URL 时需在 next.config.ts 配置 remotePatterns。
   */
  colors?: Partial<LiquidBannerColors>;

  headingFont?: string;
  headingSize?: number;
  headingWeight?: number;
  /** 字间距，会除以 100 转为 em 单位（30 → 0.3em） */
  headingSpacing?: number;
  headingTransform?: 'none' | 'uppercase';
  useSystemFont?: boolean;

  btnFontSize?: number;
  desktopPadding?: number;
  mobilePadding?: number;

  /** 滚动动画完成所需的滚动距离（px） */
  animationRange?: number;
  /** 电脑端惯性阻尼系数（0.01–0.1，越小越滑） */
  dampingFactor?: number;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: LiquidBannerColors = {
  outerBg: '#F5F3EF',
  contentBg: '#FFFFFF',
  headingColor: '#1a1a1a',
  textColor: '#555555',
  btnBg: '#FFFFFF',
  btnText: '#000000',
  btnBorder: '#000000',
  btnHoverBg: '#000000',
  btnHoverText: '#FFFFFF',
  btnHoverBorder: '#000000',
};

const SYSTEM_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// ─── Sub-component: image slot inside each half ──────────────────────────────

function ImageSlot({
  src,
  alt,
  align,
  bg,
  visibility,
}: {
  src: string;
  alt: string;
  align: 'left' | 'right';
  bg: string;
  visibility?: string;
}) {
  const pos = align === 'left' ? 'left-0' : 'right-0';
  return (
    <div
      className={`absolute top-0 ${pos} w-[200%] h-full pointer-events-none select-none ${visibility ?? ''}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{ background: bg }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LiquidBanner({
  leftImageDesktop,
  leftImageMobile,
  leftImageAlt = '',
  rightImageDesktop,
  rightImageMobile,
  rightImageAlt = '',
  heading,
  description,
  buttons = [],
  colors: colorsProp,
  headingFont = 'Cormorant Garamond',
  headingSize = 48,
  headingWeight = 300,
  headingSpacing = 30,
  headingTransform = 'uppercase',
  useSystemFont = false,
  btnFontSize = 11,
  desktopPadding = 60,
  mobilePadding = 20,
  animationRange = 600,
  dampingFactor = 0.08,
}: LiquidBannerProps) {
  const uid = useId();
  const scopeId = `lb${uid.replace(/:/g, '')}`;

  const c = { ...DEFAULT_COLORS, ...colorsProp };
  const contentBg = c.contentBg;
  const fontFamily = useSystemFont
    ? SYSTEM_FONT_STACK
    : `"${headingFont}", serif`;

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const anim = useRef({
    target: 0,
    current: 0,
    running: false,
    mobile: false,
  });

  // ── Scroll animation (mobile: direct drive / desktop: inertia damping) ──
  useEffect(() => {
    const st = anim.current;
    const STOP_THRESHOLD = 0.1;

    st.mobile = window.innerWidth <= 750;

    function onResize() {
      st.mobile = window.innerWidth <= 750;
    }

    function render() {
      // Mobile: Current = Target (zero latency)
      // Desktop: Current += (Target - Current) * damping (silk-smooth lerp)
      if (st.mobile) {
        st.current = st.target;
      } else {
        st.current += (st.target - st.current) * dampingFactor;
      }

      const p = Math.max(0, Math.min(1, st.current / animationRange));
      const offset = 15 * (1 - p);

      if (leftRef.current)
        leftRef.current.style.transform = `translate3d(-${offset}%,0,0)`;
      if (rightRef.current)
        rightRef.current.style.transform = `translate3d(${offset}%,0,0)`;

      if (overlayRef.current) {
        const startTop = st.mobile ? 60 : 65;
        overlayRef.current.style.top = `${startTop - 10 * p}%`;
      }

      if (boxRef.current) {
        if (p > 0.8) {
          boxRef.current.style.backgroundColor = 'rgba(255,255,255,0)';
          boxRef.current.style.boxShadow = 'none';
        } else {
          boxRef.current.style.backgroundColor = contentBg;
          boxRef.current.style.boxShadow = '0 20px 80px rgba(0,0,0,0.05)';
        }
      }

      // Smart sleep: stop RAF loop when animation settles
      if (!st.mobile && Math.abs(st.target - st.current) > STOP_THRESHOLD) {
        requestAnimationFrame(render);
      } else {
        st.running = false;
      }
    }

    function onScroll() {
      st.target = window.scrollY || document.documentElement.scrollTop;

      if (!st.running) {
        st.running = true;
        requestAnimationFrame(render);
      }
      // Mobile needs every frame driven (no inertia → no self-sustaining loop)
      if (st.mobile) requestAnimationFrame(render);
    }

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [animationRange, dampingFactor, contentBg]);

  // ── Scoped CSS: hover states + responsive overrides ──
  const css = [
    `#${scopeId} a{color:inherit;text-decoration:none;-webkit-tap-highlight-color:transparent}`,
    `#${scopeId} .lb-overlay{top:65%;max-width:600px}`,
    `#${scopeId} .lb-box{`,
    `  background-color:${c.contentBg};padding:70px 60px;`,
    `  box-shadow:0 20px 80px rgba(0,0,0,0.05);`,
    `  transition:background-color .2s ease,box-shadow .2s ease}`,
    `#${scopeId} .lb-heading{`,
    `  font-family:${fontFamily};font-size:${headingSize}px;font-weight:${headingWeight};`,
    `  letter-spacing:${headingSpacing / 100}em;line-height:1.15;margin:0 0 30px;`,
    `  color:${c.headingColor};text-transform:${headingTransform}}`,
    `#${scopeId} .lb-text{font-size:14px;line-height:1.6;color:${c.textColor};margin:0 0 30px}`,
    `#${scopeId} .lb-btn{`,
    `  display:inline-block;padding:12px 30px;`,
    `  border:1px solid ${c.btnBorder};background:${c.btnBg};color:${c.btnText};`,
    `  font-size:${btnFontSize}px;letter-spacing:2px;text-transform:uppercase;`,
    `  transition:all .2s ease;white-space:nowrap;cursor:pointer}`,
    `#${scopeId} .lb-btn:hover{`,
    `  background:${c.btnHoverBg};color:${c.btnHoverText}!important;`,
    `  border-color:${c.btnHoverBorder}}`,
    `@media(max-width:749px){`,
    `  #${scopeId} .lb-overlay{top:60%;max-width:94%}`,
    `  #${scopeId} .lb-box{padding:30px 15px;max-height:85vh;overflow-y:auto}`,
    `  #${scopeId} .lb-heading{font-size:clamp(24px,7vw,36px);margin-bottom:20px}`,
    `  #${scopeId} .lb-btn{font-size:10px;padding:10px 18px}}`,
    `@media(min-width:750px){`,
    `  #${scopeId}{padding-left:${desktopPadding}px;padding-right:${desktopPadding}px}}`,
  ].join('\n');

  const hasLeftMobile = leftImageMobile && leftImageMobile !== leftImageDesktop;
  const hasRightMobile =
    rightImageMobile && rightImageMobile !== rightImageDesktop;

  return (
    <section
      id={scopeId}
      className="relative overflow-hidden h-screen"
      style={{
        height: '100dvh',
        background: c.outerBg,
        padding: `0 ${mobilePadding}px`,
        contain: 'paint',
        touchAction: 'pan-y',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 3D stage wrapper */}
      <div
        className="relative w-full h-full"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
      >
        {/* Image halves */}
        <div className="relative w-full h-full flex">
          {/* ── Left ── */}
          <div
            ref={leftRef}
            className="flex-1 h-full relative overflow-hidden z-[1]"
            style={{
              transform: 'translate3d(-15%,0,0)',
              willChange: 'transform',
            }}
          >
            {hasLeftMobile ? (
              <>
                <ImageSlot
                  src={leftImageDesktop}
                  alt={leftImageAlt}
                  align="left"
                  bg={c.outerBg}
                  visibility="hidden min-[750px]:block"
                />
                <ImageSlot
                  src={leftImageMobile!}
                  alt={leftImageAlt}
                  align="left"
                  bg={c.outerBg}
                  visibility="min-[750px]:hidden"
                />
              </>
            ) : (
              <ImageSlot
                src={leftImageDesktop}
                alt={leftImageAlt}
                align="left"
                bg={c.outerBg}
              />
            )}
          </div>

          {/* ── Right ── */}
          <div
            ref={rightRef}
            className="flex-1 h-full relative overflow-hidden z-[1]"
            style={{
              transform: 'translate3d(15%,0,0)',
              willChange: 'transform',
            }}
          >
            {hasRightMobile ? (
              <>
                <ImageSlot
                  src={rightImageDesktop}
                  alt={rightImageAlt}
                  align="right"
                  bg={c.outerBg}
                  visibility="hidden min-[750px]:block"
                />
                <ImageSlot
                  src={rightImageMobile!}
                  alt={rightImageAlt}
                  align="right"
                  bg={c.outerBg}
                  visibility="min-[750px]:hidden"
                />
              </>
            ) : (
              <ImageSlot
                src={rightImageDesktop}
                alt={rightImageAlt}
                align="right"
                bg={c.outerBg}
              />
            )}
          </div>
        </div>

        {/* ── Content overlay ── */}
        <div
          ref={overlayRef}
          className="lb-overlay absolute left-1/2 w-full z-10 pointer-events-none"
          style={{
            transform: 'translate3d(-50%,-50%,0)',
            willChange: 'transform',
          }}
        >
          <div
            ref={boxRef}
            className="lb-box text-center pointer-events-auto"
          >
            {heading && <h1 className="lb-heading">{heading}</h1>}
            {description && <p className="lb-text">{description}</p>}
            {buttons.length > 0 && (
              <div className="flex gap-[15px] justify-center flex-wrap">
                {buttons.map((btn) => (
                  <Link
                    key={btn.text}
                    href={btn.href || '#'}
                    className="lb-btn"
                  >
                    {btn.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
