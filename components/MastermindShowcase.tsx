'use client';

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import PlaceholderImage from '@/components/PlaceholderImage';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SlideItem {
  /** 模特图（桌面端） */
  modelImageDesktop: string;
  /** 模特图（手机端，可选） */
  modelImageMobile?: string;
  modelImageAlt?: string;
  /** 产品图（桌面端） */
  productImageDesktop: string;
  /** 产品图（手机端，可选） */
  productImageMobile?: string;
  productImageAlt?: string;
  /** 信息区小标题，如 "THE LOOK" */
  subtitle?: string;
  /** 产品名称 */
  title: string;
  /** 价格或材质说明，如 "$128.00" */
  material: string;
  linkText?: string;
  href: string;
}

export interface MastermindColors {
  bgColor: string;
  headingColor: string;
  textColor: string;
}

export interface MastermindShowcaseProps {
  womenSlides: SlideItem[];
  menSlides: SlideItem[];
  /** 第一个 Tab 文字（默认 Women） */
  tab1Label?: string;
  /** 第二个 Tab 文字（默认 Men） */
  tab2Label?: string;
  /**
   * 外部性别控制。
   * - 传入时：组件作为受控组件，不渲染内置 Toggle，适合与 EditorialPanel 联动。
   * - 不传时：组件自行维护状态，内置 Toggle 可见。
   */
  activeGender?: 'women' | 'men';
  colors?: Partial<MastermindColors>;
  /** 标题字体 CSS font-family，如 `'"Cormorant Garamond", serif'` */
  headingFont?: string;
  /** 正文字体 CSS font-family，如 `'"Assistant", sans-serif'` */
  textFont?: string;
  headingSize?: number;
  textSize?: number;
  containerWidth?: number;
  pcGutter?: number;
  mobGutter?: number;
  desktopHeight?: number;
  /** 模特图宽度占比（%，剩余部分为信息区） */
  modelWidthPct?: number;
  modelFit?: 'cover' | 'contain';
  prodImgWidthPc?: number;
  prodImgHeightPc?: number;
  prodImgBottomPc?: number;
  prodImgWidthMob?: number;
  prodImgHeightMob?: number;
  prodImgBottomMob?: number;
  /** 桌面端信息区顶部内边距，控制文字距顶距离 */
  infoTopPaddingPc?: number;
  infoPaddingMob?: number;
  bottomPaddingMob?: number;
  modelHeightMob?: number;
  pagOffsetMob?: number;
  gapTitle?: number;
  gapButton?: number;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: MastermindColors = {
  bgColor: '#E8DFD6',
  headingColor: '#1a1a1a',
  textColor: '#1a1a1a',
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={24} height={24}>
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={24} height={24}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Sub: Gender Group ────────────────────────────────────────────────────────

function GenderGroup({
  slides,
  isActive,
  modelFit,
  isFirstGroup,
}: {
  slides: SlideItem[];
  isActive: boolean;
  modelFit: 'cover' | 'contain';
  /** 女装组为 true，影响首张图的加载优先级 */
  isFirstGroup: boolean;
}) {
  // useRef for left swiper instance (synced by right swiper's onSlideChange)
  const leftRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const pagRef = useRef<HTMLDivElement>(null);

  return (
    // 保持两个分组都在 DOM 中，通过 display 切换，避免 Swiper 状态丢失
    <div style={{ display: isActive ? 'block' : 'none' }}>
      <div className="mm-layout-grid">

        {/* ── 左侧：模特图轮播（fade 淡入，跟随右侧同步） ── */}
        <div className="mm-model-area">
          <Swiper
            modules={[EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            allowTouchMove={false}
            observer
            observeParents
            className="mm-model-swiper"
            onSwiper={(sw) => { leftRef.current = sw; }}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  {slide.modelImageMobile ? (
                    <>
                      {/* 桌面端模特图 */}
                      <div className="absolute inset-0 hidden min-[769px]:block">
                        <PlaceholderImage
                          src={slide.modelImageDesktop}
                          alt={slide.modelImageAlt ?? ''}
                          fill
                          priority={isFirstGroup && idx === 0}
                          sizes="55vw"
                          className={`object-${modelFit}`}
                        />
                      </div>
                      {/* 手机端模特图 */}
                      <div className="absolute inset-0 min-[769px]:hidden">
                        <PlaceholderImage
                          src={slide.modelImageMobile}
                          alt={slide.modelImageAlt ?? ''}
                          fill
                          priority={isFirstGroup && idx === 0}
                          sizes="100vw"
                          className={`object-${modelFit}`}
                        />
                      </div>
                    </>
                  ) : (
                    <PlaceholderImage
                      src={slide.modelImageDesktop}
                      alt={slide.modelImageAlt ?? ''}
                      fill
                      priority={isFirstGroup && idx === 0}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className={`object-${modelFit}`}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── 右侧：信息卡轮播（loop + autoplay + navigation + pagination） ── */}
        <div className="mm-info-area">
          {/* 自定义导航箭头；onBeforeInit 时 refs 已挂载，Swiper 可正确拿到 DOM 节点 */}
          <div ref={prevRef} className="mm-nav mm-nav-prev" role="button" aria-label="上一张">
            <ChevronLeft />
          </div>
          <div ref={nextRef} className="mm-nav mm-nav-next" role="button" aria-label="下一张">
            <ChevronRight />
          </div>

          <Swiper
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop
            speed={700}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            observer
            observeParents
            className="mm-info-swiper"
            onBeforeInit={(sw) => {
              // 在 Swiper 初始化前注入自定义导航/分页节点
              if (sw.params.navigation && typeof sw.params.navigation !== 'boolean') {
                sw.params.navigation.prevEl = prevRef.current;
                sw.params.navigation.nextEl = nextRef.current;
              }
              if (sw.params.pagination && typeof sw.params.pagination !== 'boolean') {
                sw.params.pagination.el = pagRef.current;
              }
            }}
            onSlideChange={(sw) => {
              // 右侧切换时同步左侧模特图（realIndex 解决 loop 的虚拟 index 问题）
              leftRef.current?.slideTo(sw.realIndex);
            }}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="mm-info-card">

                  {/* 小标题 + 产品图（顶部锚定组合，防止文字上浮） */}
                  <div className="mm-top-anchor">
                    {slide.subtitle && (
                      <p className="mm-subtitle">{slide.subtitle}</p>
                    )}
                    {/* mix-blend-mode: multiply 使白底产品图融入背景色 */}
                    <div
                      className="mm-prod-img-box"
                      style={{ position: 'relative', mixBlendMode: 'multiply' }}
                    >
                      {slide.productImageMobile ? (
                        <>
                          {/* 桌面端产品缩图：overlayClassName 与图片显隐保持一致，防止两个遮罩互相遮挡 */}
                          <PlaceholderImage
                            src={slide.productImageDesktop}
                            alt={slide.productImageAlt ?? slide.title}
                            fill
                            loading={isFirstGroup && idx === 0 ? 'eager' : 'lazy'}
                            sizes="350px"
                            className="object-contain hidden min-[769px]:block"
                            overlayClassName="hidden min-[769px]:block"
                          />
                          {/* 手机端产品缩图 */}
                          <PlaceholderImage
                            src={slide.productImageMobile}
                            alt={slide.productImageAlt ?? slide.title}
                            fill
                            loading={isFirstGroup && idx === 0 ? 'eager' : 'lazy'}
                            sizes="180px"
                            className="object-contain min-[769px]:hidden"
                            overlayClassName="min-[769px]:hidden"
                          />
                        </>
                      ) : (
                        <PlaceholderImage
                          src={slide.productImageDesktop}
                          alt={slide.productImageAlt ?? slide.title}
                          fill
                          loading={isFirstGroup && idx === 0 ? 'eager' : 'lazy'}
                          sizes="(max-width: 768px) 180px, 350px"
                          className="object-contain"
                        />
                      )}
                    </div>
                  </div>

                  {/* 产品文字信息 */}
                  <div className="mm-text-group">
                    <h3 className="mm-title">{slide.title}</h3>
                    <p className="mm-meta">{slide.material}</p>
                    <Link href={slide.href || '#'} className="mm-button">
                      {slide.linkText ?? 'VIEW PRODUCT'}
                    </Link>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 自定义分页条容器 */}
          <div
            ref={pagRef}
            className="mm-pag"
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 50,
            }}
          />
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MastermindShowcase({
  womenSlides,
  menSlides,
  tab1Label = 'Women',
  tab2Label = 'Men',
  activeGender: activeGenderProp,
  colors: colorsProp,
  headingFont = 'var(--font-cormorant), "Cormorant", serif',
  textFont = 'var(--font-montserrat), "Montserrat", sans-serif',
  headingSize = 32,
  textSize = 14,
  containerWidth = 1400,
  pcGutter = 40,
  mobGutter = 20,
  desktopHeight = 700,
  modelWidthPct = 55,
  modelFit = 'cover',
  prodImgWidthPc = 350,
  prodImgHeightPc = 350,
  prodImgBottomPc = 30,
  prodImgWidthMob = 220,
  prodImgHeightMob = 220,
  prodImgBottomMob = 30,
  infoTopPaddingPc = 40,
  infoPaddingMob = 40,
  bottomPaddingMob = 80,
  modelHeightMob = 450,
  pagOffsetMob = 10,
  gapTitle = 10,
  gapButton = 30,
}: MastermindShowcaseProps) {
  const uid = useId();
  const scopeId = `mm${uid.replace(/:/g, '')}`;

  const [internalGender, setInternalGender] = useState<'women' | 'men'>('women');
  const isControlled = activeGenderProp !== undefined;
  const activeGender = isControlled ? activeGenderProp! : internalGender;

  const c: MastermindColors = { ...DEFAULT_COLORS, ...colorsProp };
  const infoWidth = 100 - modelWidthPct;

  // Scoped CSS — 仅处理动态值、hover 和媒体查询（无法用 Tailwind 内联完成的部分）
  const css = [
    // 全局去蓝
    `#${scopeId} a{color:inherit!important;text-decoration:none}`,

    // 容器桌面端内边距（移动端覆盖见下）
    `#${scopeId} .mm-container{padding-left:${pcGutter}px;padding-right:${pcGutter}px}`,

    // 布局网格
    `#${scopeId} .mm-layout-grid{display:flex;width:100%}`,

    // 左侧模特 Swiper 撑满父容器高度
    `#${scopeId} .mm-model-swiper,`,
    `#${scopeId} .mm-model-swiper .swiper-wrapper,`,
    `#${scopeId} .mm-model-swiper .swiper-slide{height:100%}`,

    // ── 标题字体 ──
    `#${scopeId} .mm-title{`,
    `  font-family:${headingFont};font-weight:300;font-size:${headingSize}px;`,
    `  color:${c.headingColor};letter-spacing:0.1em;`,
    `  margin:0 0 ${gapTitle}px;line-height:1.3;text-align:center`,
    `}`,

    // ── 正文字体（副标题 / 价格 / 按钮共用） ──
    `#${scopeId} .mm-subtitle,#${scopeId} .mm-meta,#${scopeId} .mm-button{`,
    `  font-family:${textFont};font-weight:400;font-size:${textSize}px;`,
    `  color:${c.textColor};line-height:1.6;text-align:center`,
    `}`,

    // 副标题（THE LOOK）：紧贴产品图上方，防上浮
    `#${scopeId} .mm-subtitle{`,
    `  letter-spacing:3px;text-transform:uppercase;margin-bottom:5px;`,
    `  opacity:0.7;font-size:calc(${textSize}px * 0.7);line-height:1`,
    `}`,

    // 价格/材质
    `#${scopeId} .mm-meta{margin:0 0 ${gapButton}px;opacity:0.8}`,

    // CTA 按钮
    `#${scopeId} .mm-button{`,
    `  display:inline-block;padding:12px 35px;`,
    `  border:1px solid ${c.textColor};text-decoration:none;`,
    `  letter-spacing:2px;text-transform:uppercase;`,
    `  font-size:calc(${textSize}px * 0.85);transition:all 0.3s ease`,
    `}`,
    `#${scopeId} .mm-button:hover{background-color:${c.textColor};color:${c.bgColor}}`,

    // 自定义分页条（横线风格）
    `#${scopeId} .mm-pag .swiper-pagination-bullet{`,
    `  width:30px!important;height:1px!important;border-radius:0!important;`,
    `  background-color:${c.textColor}!important;opacity:0.15!important;`,
    `  margin:0 4px!important;transition:all 0.5s ease`,
    `}`,
    `#${scopeId} .mm-pag .swiper-pagination-bullet-active{opacity:1!important;width:50px!important}`,

    // 圆形导航箭头
    `#${scopeId} .mm-nav{`,
    `  position:absolute;width:44px;height:44px;top:50%;transform:translateY(-50%);`,
    `  border:1px solid rgba(0,0,0,0.1);border-radius:50%;`,
    `  display:flex;align-items:center;justify-content:center;`,
    `  z-index:10;cursor:pointer;transition:all 0.3s ease`,
    `}`,
    `#${scopeId} .mm-nav:hover{background-color:${c.textColor};border-color:${c.textColor}}`,
    `#${scopeId} .mm-nav:hover svg{stroke:${c.bgColor}}`,
    `#${scopeId} .mm-nav-prev{left:10px}`,
    `#${scopeId} .mm-nav-next{right:10px}`,

    // ── 桌面端（左侧4:5比例驱动整体高度） ──
    `@media(min-width:769px){`,
    `  #${scopeId} .mm-layout-grid{align-items:stretch}`,
    `  #${scopeId} .mm-model-area{width:${modelWidthPct}%;aspect-ratio:4/5;flex-shrink:0}`,
    `  #${scopeId} .mm-info-area{`,
    `    flex:1;position:relative;`,
    `    min-width:0;padding-top:${infoTopPaddingPc}px`,
    `  }`,
    `  #${scopeId} .mm-info-card{`,
    `    height:100%;display:flex;flex-direction:column;`,
    `    justify-content:flex-start;align-items:center;padding:0 60px;text-align:center`,
    `  }`,
    // 信息 Swiper 桌面端也撑满父容器
    `  #${scopeId} .mm-info-swiper,`,
    `  #${scopeId} .mm-info-swiper .swiper-wrapper,`,
    `  #${scopeId} .mm-info-swiper .swiper-slide{height:100%}`,
    `  #${scopeId} .mm-prod-img-box{`,
    `    width:${prodImgWidthPc}px;height:${prodImgHeightPc}px;margin-bottom:${prodImgBottomPc}px`,
    `  }`,
    `  #${scopeId} .mm-pag{bottom:25px}`,
    `}`,

    // ── 手机端（上下堆叠，修复文字上浮） ──
    `@media(max-width:768px){`,
    `  #${scopeId} .mm-container{padding-left:${mobGutter}px;padding-right:${mobGutter}px}`,
    `  #${scopeId} .mm-layout-grid{flex-direction:column}`,
    `  #${scopeId} .mm-model-area{width:100%;height:${modelHeightMob}px;min-width:0}`,
    `  #${scopeId} .mm-info-area{`,
    `    width:100%;position:relative;min-width:0;`,
    `    padding:${infoPaddingMob}px 20px ${bottomPaddingMob}px`,
    `  }`,
    `  #${scopeId} .mm-info-card{`,
    `    display:flex;flex-direction:column;align-items:center;justify-content:flex-start;width:100%`,
    `  }`,
    // THE LOOK + 产品图作为整体，统一锁定间距
    `  #${scopeId} .mm-top-anchor{margin-bottom:20px}`,
    `  #${scopeId} .mm-prod-img-box{`,
    `    width:${prodImgWidthMob}px;height:${prodImgHeightMob}px;margin-bottom:${prodImgBottomMob}px`,
    `  }`,
    `  #${scopeId} .mm-pag{bottom:${pagOffsetMob}px}`,
    `  #${scopeId} .mm-nav{display:none}`,
    // 手机端标题字号缩小至 75%
    `  #${scopeId} .mm-title{font-size:calc(${headingSize}px * 0.75)}`,
    `}`,
  ].join('\n');

  const tabs = [
    { key: 'women' as const, label: tab1Label },
    { key: 'men' as const, label: tab2Label },
  ];

  return (
    <section
      id={scopeId}
      className="relative overflow-hidden w-full"
      style={{ backgroundColor: c.bgColor }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        className="mm-container"
        style={{ maxWidth: containerWidth, margin: '0 auto', boxSizing: 'border-box' }}
      >
        {/* 内置 Toggle — 仅在非受控模式下显示（受控时由外部 EditorialPanel 等组件驱动） */}
        {!isControlled && (
          <div className="flex justify-center gap-8 py-6">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setInternalGender(key)}
                className="bg-transparent border-none cursor-pointer px-6 py-2 uppercase tracking-widest transition-all duration-300"
                style={{
                  fontFamily: textFont,
                  fontSize: textSize,
                  color: c.textColor,
                  opacity: activeGender === key ? 1 : 0.5,
                  fontWeight: activeGender === key ? 600 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* 两个分组始终在 DOM — display 切换，保留 Swiper 状态和已加载的图片 */}
        <GenderGroup
          slides={womenSlides}
          isActive={activeGender === 'women'}
          modelFit={modelFit}
          isFirstGroup
        />
        <GenderGroup
          slides={menSlides}
          isActive={activeGender === 'men'}
          modelFit={modelFit}
          isFirstGroup={false}
        />
      </div>
    </section>
  );
}
