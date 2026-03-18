import Image from 'next/image';
import Link from 'next/link';
import BannerScrollEffect from './BannerScrollEffect';

/* Warm beige LQIP placeholder — matches #E8DFD6 outer bg, tiny SVG avoids extra request */
const BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 40 40%27%3E%3Cfilter id=%27b%27%3E%3CfeGaussianBlur stdDeviation=%2712%27/%3E%3C/filter%3E%3Crect width=%2740%27 height=%2740%27 fill=%27%23E8DFD6%27 filter=%27url(%23b)%27/%3E%3C/svg%3E';

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

  colors?: Partial<LiquidBannerColors>;

  headingFont?: string;
  headingSize?: number;
  headingWeight?: number;
  headingSpacing?: number;
  headingTransform?: 'none' | 'uppercase';
  useSystemFont?: boolean;

  btnFontSize?: number;
  desktopPadding?: number;
  mobilePadding?: number;

  animationRange?: number;
  dampingFactor?: number;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: LiquidBannerColors = {
  outerBg: '#E8DFD6',
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

const SCOPE_ID = 'lb-hero';

// ─── Sub-component: image slot inside each half ──────────────────────────────

function ImageSlot({
  src,
  alt,
  align,
  bg,
  visibility,
  loadMode = 'priority' as 'priority' | 'eager' | 'lazy',
}: {
  src: string;
  alt: string;
  align: 'left' | 'right';
  bg: string;
  visibility?: string;
  /** 'priority' = preload+eager+high (LCP), 'eager' = eager without preload, 'lazy' = lazy */
  loadMode?: 'priority' | 'eager' | 'lazy';
}) {
  const pos = align === 'left' ? 'left-0' : 'right-0';
  const loadProps =
    loadMode === 'priority'
      ? { priority: true, loading: 'eager' as const, fetchPriority: 'high' as const }
      : loadMode === 'eager'
        ? { loading: 'eager' as const }
        : { loading: 'lazy' as const };
  return (
    <div
      className={`absolute top-0 ${pos} w-[200%] h-full pointer-events-none select-none ${visibility ?? ''}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="50vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          {...loadProps}
          className="object-cover lb-img-fade"
          style={{ color: 'transparent', background: bg }}
        />
      </div>
    </div>
  );
}

// ─── Main Component (Server Component) ───────────────────────────────────────

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
  headingFont = 'Cormorant',
  headingSize = 48,
  headingWeight = 300,
  headingSpacing = 30,
  headingTransform = 'uppercase',
  useSystemFont = false,
  btnFontSize = 11,
  desktopPadding = 0,
  mobilePadding = 0,
  animationRange = 600,
  dampingFactor = 0.08,
}: LiquidBannerProps) {
  const c = { ...DEFAULT_COLORS, ...colorsProp };
  const fontFamily = useSystemFont
    ? SYSTEM_FONT_STACK
    : `var(--font-cormorant), "${headingFont}", serif`;

  const css = [
    /* 淡入过渡：模糊色块 → 缓缓显现油画 */
    `#${SCOPE_ID} .lb-img-fade{animation:lbReveal 1.2s ease-out both}`,
    `@keyframes lbReveal{from{opacity:0;filter:blur(8px)}to{opacity:1;filter:blur(0)}}`,
    `#${SCOPE_ID} a{color:inherit;text-decoration:none;-webkit-tap-highlight-color:transparent}`,
    `#${SCOPE_ID} .lb-overlay{top:65%;max-width:600px}`,
    `#${SCOPE_ID} .lb-box{`,
    `  background-color:${c.contentBg};padding:70px 60px;`,
    `  box-shadow:0 20px 80px rgba(0,0,0,0.05);`,
    `  transition:background-color .2s ease,box-shadow .2s ease}`,
    `#${SCOPE_ID} .lb-heading{`,
    `  font-family:${fontFamily};font-size:${headingSize}px;font-weight:${headingWeight};`,
    `  letter-spacing:${headingSpacing / 100}em;line-height:1.15;margin:0 0 30px;`,
    `  color:${c.headingColor};text-transform:${headingTransform}}`,
    `#${SCOPE_ID} .lb-text{font-size:14px;line-height:1.6;color:${c.textColor};margin:0 0 30px}`,
    `#${SCOPE_ID} .lb-btn{`,
    `  display:inline-block;padding:12px 30px;min-width:180px;text-align:center;`,
    `  border:1px solid ${c.btnBorder};background:${c.btnBg};color:${c.btnText};`,
    `  font-size:${btnFontSize}px;letter-spacing:2px;text-transform:uppercase;`,
    `  transition:all .2s ease;white-space:nowrap;cursor:pointer}`,
    `#${SCOPE_ID} .lb-btn:hover{`,
    `  background:${c.btnHoverBg};color:${c.btnHoverText}!important;`,
    `  border-color:${c.btnHoverBorder}}`,
    `@media(max-width:749px){`,
    `  #${SCOPE_ID} .lb-overlay{top:55%;max-width:94%}`,
    `  #${SCOPE_ID} .lb-box{padding:30px 15px;max-height:85vh;overflow-y:auto}`,
    `  #${SCOPE_ID} .lb-heading{font-size:clamp(24px,7vw,36px);margin-bottom:20px}`,
    `  #${SCOPE_ID} .lb-btn{font-size:10px;padding:10px 18px}}`,
    `@media(min-width:750px){`,
    `  #${SCOPE_ID}{padding-left:${desktopPadding}px;padding-right:${desktopPadding}px}}`,
  ].join('\n');

  const hasLeftMobile = leftImageMobile && leftImageMobile !== leftImageDesktop;
  const hasRightMobile = rightImageMobile && rightImageMobile !== rightImageDesktop;

  return (
    <section
      id={SCOPE_ID}
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

      <BannerScrollEffect
        scopeId={SCOPE_ID}
        contentBg={c.contentBg}
        animationRange={animationRange}
        dampingFactor={dampingFactor}
      />

      <div
        className="relative w-full h-full"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
      >
        <div className="relative w-full h-full flex">
          {/* ── Left ── */}
          <div
            data-lb-left=""
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
                  loadMode="eager"
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
            data-lb-right=""
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
                  loadMode="eager"
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
          data-lb-overlay=""
          className="lb-overlay absolute left-1/2 w-full z-10 pointer-events-none"
          style={{
            transform: 'translate3d(-50%,-50%,0)',
            willChange: 'transform',
          }}
        >
          <div
            data-lb-box=""
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
