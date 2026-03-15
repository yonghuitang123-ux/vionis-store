'use client'

/**
 * ProductGallery — 双图并排行布局（参考 Loro Piana）
 * 桌面端：每两张图为一行，等宽并排，间距 4px，行间距 4px。
 * 手机端：横滑 Swiper，一次一张，底部圆点指示器。
 * 加载时居中显示品牌 logo，图片加载完后淡入覆盖。
 */

import { useMemo, useState, useCallback, useRef, useId } from 'react'
import Image from 'next/image'
import { filterImagesByColor } from '@/utils/filterImages'

// 内联 base64 logo — 零网络请求，随 JS 包一起到达
const LOGO_BASE64 =
  'data:image/png;base64,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'

interface MediaItem {
  alt?: string | null
  url?: string
  image?: { url: string; width?: number; height?: number }
}

interface ProductGalleryProps {
  media: MediaItem[]
  selectedColor: string
  productTitle: string
}

function GalleryImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string
  alt: string
  sizes: string
  priority: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const onLoad = useCallback(() => setLoaded(true), [])

  return (
    <div style={imageContainerStyle}>
      {/* Logo 占位符 — 图片加载前显示 */}
      <div
        style={{
          ...logoPlaceholderStyle,
          opacity: loaded ? 0 : 1,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_BASE64}
          alt=""
          width={60}
          height={60}
          style={logoImgStyle}
        />
      </div>

      {/* 实际产品图 */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{
          ...imageStyle,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        priority={priority}
        draggable={false}
        onLoad={onLoad}
      />
    </div>
  )
}

// ─── Mobile Swiper ───────────────────────────────────────────────────────────

function MobileSwiper({
  images,
  productTitle,
}: {
  images: { src: string; alt: string }[]
  productTitle: string
}) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
  const swiping = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    swiping.current = true
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping.current) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!swiping.current) return
    swiping.current = false
    const threshold = 50
    if (touchDeltaX.current < -threshold) {
      setCurrent((c) => Math.min(c + 1, images.length - 1))
    } else if (touchDeltaX.current > threshold) {
      setCurrent((c) => Math.max(c - 1, 0))
    }
  }, [images.length])

  if (images.length === 0) {
    return (
      <div style={{ ...imageContainerStyle, width: '100%' }}>
        <div style={placeholderStyle} />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Slides track */}
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform 0.3s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, i) => (
          <div key={i} style={{ flex: '0 0 100%', width: '100%' }}>
            <GalleryImage
              src={img.src}
              alt={img.alt}
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            paddingTop: 12,
            paddingBottom: 4,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: i === current ? '#1a1a1a' : 'rgba(0,0,0,0.2)',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProductGallery({ media, selectedColor, productTitle }: ProductGalleryProps) {
  const scopeId = `pg${useId().replace(/:/g, '')}`

  const filtered = useMemo(
    () => filterImagesByColor(media, selectedColor),
    [media, selectedColor]
  )

  // Flat list of image URLs for mobile swiper
  const allImages = useMemo(
    () =>
      filtered
        .map((m, i) => {
          const url = m.image?.url ?? m.url
          return url ? { src: url, alt: m.alt ?? `${productTitle} - ${i + 1}` } : null
        })
        .filter((x): x is { src: string; alt: string } => x !== null),
    [filtered, productTitle]
  )

  // 每两张图分为一行 (desktop)
  const rows: Array<[MediaItem | null, MediaItem | null]> = []
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push([filtered[i] ?? null, filtered[i + 1] ?? null])
  }

  // 如果没有图片，显示一个空占位
  if (rows.length === 0) {
    rows.push([null, null])
  }

  const css = [
    /* Desktop: paired rows */
    `#${scopeId} .pg-desktop{display:flex;flex-direction:column;gap:4px;width:100%}`,
    `#${scopeId} .pg-row{display:flex;gap:4px;width:100%}`,
    `#${scopeId} .pg-left,#${scopeId} .pg-right{flex:1;min-width:0}`,
    `#${scopeId} .pg-mobile{display:none}`,

    /* Mobile: hide desktop, show swiper */
    `@media(max-width:768px){`,
    `  #${scopeId} .pg-desktop{display:none}`,
    `  #${scopeId} .pg-mobile{display:block}`,
    `}`,
  ].join('\n')

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Desktop layout */}
      <div className="pg-desktop">
        {rows.map((pair, rowIdx) => {
          const leftUrl = pair[0]?.image?.url ?? pair[0]?.url ?? null
          const rightUrl = pair[1]?.image?.url ?? pair[1]?.url ?? null

          return (
            <div className="pg-row" key={rowIdx}>
              {/* 左图 */}
              <div className="pg-left">
                {leftUrl ? (
                  <GalleryImage
                    src={leftUrl}
                    alt={pair[0]?.alt ?? productTitle}
                    sizes="50vw"
                    priority={rowIdx === 0}
                  />
                ) : (
                  <div style={imageContainerStyle}>
                    <div style={placeholderStyle} />
                  </div>
                )}
              </div>

              {/* 右图 */}
              <div className="pg-right">
                {rightUrl ? (
                  <GalleryImage
                    src={rightUrl}
                    alt={pair[1]?.alt ?? `${productTitle} - ${rowIdx * 2 + 2}`}
                    sizes="50vw"
                    priority={rowIdx === 0}
                  />
                ) : (
                  <div style={imageContainerStyle}>
                    <div style={placeholderStyle} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile swiper */}
      <div className="pg-mobile">
        <MobileSwiper images={allImages} productTitle={productTitle} />
      </div>
    </div>
  )
}

const imageContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 5',
  overflow: 'hidden',
  backgroundColor: '#E8DFD6',
  cursor: 'default',
}

const logoPlaceholderStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.4s ease',
  pointerEvents: 'none',
  zIndex: 1,
}

const logoImgStyle: React.CSSProperties = {
  opacity: 0.3,
  objectFit: 'contain',
}

const imageStyle: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'top center',
}

const placeholderStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#E8DFD6',
}
