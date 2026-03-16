'use client';

/**
 * ProductGallery — 双图并排布局（参考 Loro Piana）
 * ─────────────────────────────────────────────────────────────────
 * 左窄右宽（1:1.8），aspectRatio 3/4，objectFit cover，objectPosition top center。
 * 颜色切换时两张图同时更换。移动端上下堆叠。
 */

import { useMemo } from 'react';
import Image from 'next/image';
import { filterImagesByColor, type MediaItem } from '@/utils/filterImages';

export interface ProductGalleryMedia extends MediaItem {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

interface ProductGalleryProps {
  media: ProductGalleryMedia[];
  selectedColor: string | null;
  productTitle: string;
}

export default function ProductGallery({
  media,
  selectedColor,
  productTitle,
}: ProductGalleryProps) {
  const filteredMedia = useMemo(
    () => filterImagesByColor(media, selectedColor),
    [media, selectedColor],
  );

  const leftImage = filteredMedia[0] ?? null;
  const rightImage = filteredMedia[1] ?? null;

  return (
    <>
      <style>{`
        .pg-grid {
          display: flex;
          gap: 4px;
          width: 100%;
        }
        .pg-left {
          flex: 1;
          min-width: 0;
        }
        .pg-right {
          flex: 1.8;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .pg-grid {
            flex-direction: column;
          }
          .pg-left,
          .pg-right {
            flex: none;
            width: 100%;
          }
        }
      `}</style>

      <div className="pg-grid">
        {/* 左图 */}
        <div className="pg-left">
          <div style={imageContainerStyle}>
            {leftImage ? (
              <Image
                src={leftImage.url}
                alt={leftImage.altText ?? productTitle}
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                style={imageStyle}
                priority
              />
            ) : (
              <div style={placeholderStyle} />
            )}
          </div>
        </div>

        {/* 右图 */}
        <div className="pg-right">
          <div style={imageContainerStyle}>
            {rightImage ? (
              <Image
                src={rightImage.url}
                alt={rightImage.altText ?? `${productTitle} - 2`}
                fill
                sizes="(max-width: 768px) 100vw, 65vw"
                style={imageStyle}
                priority
              />
            ) : (
              <div style={placeholderStyle} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const imageContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '3 / 4',
  overflow: 'hidden',
  backgroundColor: '#F5F0E8',
  cursor: 'default',
};

const imageStyle: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'top center',
};

const placeholderStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#F5F0E8',
};
