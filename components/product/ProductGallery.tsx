'use client'

/**
 * ProductGallery — 双图并排行布局（参考 Loro Piana）
 * 每两张图为一行：左窄右宽（1:1.8），间距 4px，行间距 4px。
 * 所有图片垂直排列可滚动浏览。移动端单列堆叠。
 */

import { useMemo } from 'react'
import Image from 'next/image'
import { filterImagesByColor } from '@/utils/filterImages'

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

export default function ProductGallery({ media, selectedColor, productTitle }: ProductGalleryProps) {
  const filtered = useMemo(
    () => filterImagesByColor(media, selectedColor),
    [media, selectedColor]
  )

  // 每两张图分为一行
  const rows: Array<[MediaItem | null, MediaItem | null]> = []
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push([filtered[i] ?? null, filtered[i + 1] ?? null])
  }

  // 如果没有图片，显示一个空占位
  if (rows.length === 0) {
    rows.push([null, null])
  }

  return (
    <>
      <style>{`
        .pg-rows {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }
        .pg-row {
          display: flex;
          gap: 4px;
          width: 100%;
        }
        .pg-left {
          flex: 1;
          min-width: 0;
        }
        .pg-right {
          flex: 1;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .pg-row {
            flex-direction: column;
          }
          .pg-left,
          .pg-right {
            flex: none;
            width: 100%;
          }
        }
      `}</style>

      <div className="pg-rows">
        {rows.map((pair, rowIdx) => {
          const leftUrl = pair[0]?.image?.url ?? pair[0]?.url ?? null
          const rightUrl = pair[1]?.image?.url ?? pair[1]?.url ?? null

          return (
            <div className="pg-row" key={rowIdx}>
              {/* 左图 */}
              <div className="pg-left">
                <div style={imageContainerStyle}>
                  {leftUrl ? (
                    <Image
                      src={leftUrl}
                      alt={pair[0]?.alt ?? productTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={imageStyle}
                      priority={rowIdx === 0}
                      draggable={false}
                    />
                  ) : (
                    <div style={placeholderStyle} />
                  )}
                </div>
              </div>

              {/* 右图 */}
              <div className="pg-right">
                <div style={imageContainerStyle}>
                  {rightUrl ? (
                    <Image
                      src={rightUrl}
                      alt={pair[1]?.alt ?? `${productTitle} - ${rowIdx * 2 + 2}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={imageStyle}
                      priority={rowIdx === 0}
                      draggable={false}
                    />
                  ) : (
                    <div style={placeholderStyle} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
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

const imageStyle: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'top center',
}

const placeholderStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#E8DFD6',
}
