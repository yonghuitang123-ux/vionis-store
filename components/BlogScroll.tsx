'use client';

import { useCallback, useId, useRef, useState } from 'react';
import PlaceholderImage from '@/components/PlaceholderImage';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  imageDesktop: string;
  imageMobile?: string;
  imageAlt?: string;
  title: string;
  body: string;
  href: string;
}

export interface BlogScrollProps {
  heading?: string;
  posts: BlogPost[];
  bgColor?: string;
  headingColor?: string;
  textColor?: string;
  mutedColor?: string;
  headingFont?: string;
  textFont?: string;
  /** 单张卡片宽度（桌面端，px） */
  cardWidth?: number;
  /** 单张卡片宽度（手机端，px） */
  cardWidthMob?: number;
  gap?: number;
  paddingTop?: number;
  paddingBottom?: number;
  /** 轨道左右内边距（桌面端，px） */
  paddingSide?: number;
  /** 轨道左右内边距（手机端，px） */
  paddingSideMob?: number;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogScroll({
  heading = 'INSIDE VIONIS·XY',
  posts = [],
  bgColor = '#E8DFD6',
  headingColor = '#1a1a1a',
  textColor = '#555555',
  mutedColor = '#666666',
  headingFont = 'var(--font-cormorant), "Cormorant", serif',
  textFont = 'var(--font-montserrat), "Montserrat", sans-serif',
  cardWidth = 340,
  cardWidthMob = 272,
  gap = 28,
  paddingTop = 80,
  paddingBottom = 90,
  paddingSide = 60,
  paddingSideMob = 24,
}: BlogScrollProps) {
  const uid = useId();
  const scopeId = `bsc${uid.replace(/:/g, '')}`;

  // ── 拖拽滚动 ──────────────────────────────────────────────────────────────
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    trackRef.current?.classList.add('is-dragging');
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    const walk = x - startX.current;
    if (Math.abs(walk) > 4) hasDragged.current = true;
    if (trackRef.current) trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    trackRef.current?.classList.remove('is-dragging');
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX;
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    hasDragged.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const walk = e.touches[0].pageX - startX.current;
    if (Math.abs(walk) > 4) hasDragged.current = true;
    if (trackRef.current) trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  // ── 灯箱 ──────────────────────────────────────────────────────────────────
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    if (hasDragged.current) return;
    if (!src) return;
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  // ── 阻止拖拽时的 Link 点击跳转 ────────────────────────────────────────────
  const guardClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) e.preventDefault();
  }, []);

  // ── Scoped CSS ────────────────────────────────────────────────────────────
  const css = [
    // 隐藏滚动条
    `#${scopeId} .bsc-track{scrollbar-width:none;-ms-overflow-style:none}`,
    `#${scopeId} .bsc-track::-webkit-scrollbar{display:none}`,

    // 抓手光标
    `#${scopeId} .bsc-track{cursor:grab}`,
    `#${scopeId} .bsc-track.is-dragging{cursor:grabbing}`,

    // 卡片宽度（桌面端）
    `#${scopeId} .bsc-card{width:${cardWidth}px;flex-shrink:0}`,

    // 图片容器 3:4 比例
    `#${scopeId} .bsc-img{position:relative;aspect-ratio:3/4;overflow:hidden;cursor:zoom-in}`,

    // 图片 hover 微缩放（目标 next/image 渲染的 img 元素）
    `#${scopeId} .bsc-img img{transition:transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)!important}`,
    `#${scopeId} .bsc-card:hover .bsc-img img{transform:scale(1.04)!important}`,

    // 文字全部禁止划选
    `#${scopeId} .bsc-track *{user-select:none;-webkit-user-select:none}`,

    // 文字区截断
    `#${scopeId} .bsc-body{line-height:1.75;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}`,

    // 手机端
    `@media(max-width:768px){`,
    `  #${scopeId} .bsc-card{width:${cardWidthMob}px}`,
    `  #${scopeId} .bsc-track{padding-left:${paddingSideMob}px!important;padding-right:${paddingSideMob}px!important}`,
    `}`,
  ].join('\n');

  return (
    <section
      id={scopeId}
      style={{ backgroundColor: bgColor, paddingTop, paddingBottom }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── 板块标题 ── */}
      {heading && (
        <div className="flex flex-col items-center mb-10 md:mb-14 px-6">
          <p
            className="uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: textFont, fontSize: 11, color: mutedColor, letterSpacing: '0.3em' }}
          >
            EDITORIAL
          </p>
          <h2
            className="uppercase tracking-[0.15em] text-center"
            style={{ fontFamily: headingFont, fontWeight: 300, fontSize: 22, color: headingColor }}
          >
            {heading}
          </h2>
          <div
            className="mt-5"
            style={{ width: 40, height: 1, backgroundColor: headingColor, opacity: 0.25 }}
          />
        </div>
      )}

      {/* ── 横向滚动轨道 ── */}
      <div
        ref={trackRef}
        className="bsc-track flex overflow-x-auto select-none"
        style={{ gap, paddingLeft: paddingSide, paddingRight: paddingSide }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onDragStart={(e) => e.preventDefault()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {posts.map((post, idx) => (
          <article key={idx} className="bsc-card">

            {/* 3:4 图片 — 点击放大 */}
            <div
              className="bsc-img mb-5"
              onClick={() => openLightbox(post.imageDesktop, post.imageAlt ?? post.title)}
            >
              <PlaceholderImage
                src={post.imageDesktop}
                alt={post.imageAlt ?? post.title}
                fill
                sizes={`(max-width: 768px) ${cardWidthMob}px, ${cardWidth}px`}
                className="object-cover object-top"
                loading={idx === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>

            {/* 文字信息 */}
            <Link
              href={post.href}
              onClick={guardClick}
              className="block group"
              style={{ textDecoration: 'none' }}
            >
              <h3
                className="mb-2 transition-opacity duration-200 group-hover:opacity-60"
                style={{
                  fontFamily: headingFont,
                  fontWeight: 300,
                  fontSize: 17,
                  color: headingColor,
                  letterSpacing: '0.04em',
                  lineHeight: 1.4,
                }}
              >
                {post.title}
              </h3>
              <p
                className="bsc-body mb-4"
                style={{ fontFamily: textFont, fontWeight: 400, fontSize: 13, color: textColor }}
              >
                {post.body}
              </p>
              <span
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-opacity duration-200 group-hover:opacity-60"
                style={{ fontFamily: textFont, color: mutedColor }}
              >
                Read More
                <span style={{ display: 'inline-block', width: 20, height: 1, backgroundColor: mutedColor, verticalAlign: 'middle' }} />
              </span>
            </Link>

          </article>
        ))}
      </div>

      {/* ── 灯箱 ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(6px)' }}
          onClick={closeLightbox}
        >
          {/* 关闭按钮 */}
          <button
            className="absolute top-6 right-8 text-white opacity-60 hover:opacity-100 transition-opacity"
            style={{ fontSize: 28, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={closeLightbox}
            aria-label="关闭"
          >
            ✕
          </button>

          {/* 图片容器 — 阻止冒泡，防止点图片本身关闭灯箱 */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '88vw', maxHeight: '88vh', position: 'relative' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              style={{
                maxWidth: '88vw',
                maxHeight: '88vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
