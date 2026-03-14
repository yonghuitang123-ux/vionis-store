'use client';

/**
 * ProductGallery — 产品图片画廊（按颜色过滤）
 * ─────────────────────────────────────────────────────────────────
 * 根据 selectedColor 过滤图片，主图 + 缩略图横排，点击切换，无放大镜。
 */

import { useMemo, useState } from 'react';
import PlaceholderImage from '@/components/PlaceholderImage';
import { filterImagesByColor, type MediaItem } from '@/utils/filterImages';
import type { CSSProperties } from 'react';

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
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredMedia = useMemo(
    () => filterImagesByColor(media, selectedColor),
    [media, selectedColor],
  );

  const displayIndex =
    filteredMedia.length > 0
      ? Math.min(activeIndex, filteredMedia.length - 1)
      : 0;
  const displayImage = filteredMedia[displayIndex] ?? filteredMedia[0];

  return (
    <div style={galleryWrapperStyle}>
      <style>{`
        .product-gallery-thumbs::-webkit-scrollbar { display: none; }
        @keyframes productGalleryFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .product-gallery-main img {
          animation: productGalleryFadeIn 0.3s ease;
        }
      `}</style>
      {/* 主图 */}
      <div
        className="product-gallery-main"
        style={{
          ...mainImageStyle,
          cursor: 'default',
        }}
      >
        {displayImage?.url && (
          <PlaceholderImage
            src={displayImage.url}
            alt={displayImage.altText ?? productTitle}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            style={{
              objectFit: 'cover',
              transition: 'opacity 0.3s ease',
            }}
            priority
          />
        )}
      </div>

      {/* 缩略图条 */}
      {filteredMedia.length > 1 && (
        <div className="product-gallery-thumbs" style={thumbStripStyle}>
          {filteredMedia.map((img, idx) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`查看图片 ${idx + 1}`}
              style={{
                ...thumbBtnStyle,
                border:
                  idx === displayIndex
                    ? '2px solid #1a1a1a'
                    : '2px solid transparent',
              }}
            >
              <PlaceholderImage
                src={img.url}
                alt={img.altText ?? `${productTitle} - ${idx + 1}`}
                fill
                sizes="60px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const galleryWrapperStyle: CSSProperties = {
  width: '100%',
};

const mainImageStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 5',
  overflow: 'hidden',
  backgroundColor: '#f0ebe4',
};

const thumbStripStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 12,
  overflowX: 'auto',
  scrollbarWidth: 'none',
};

const thumbBtnStyle: CSSProperties = {
  position: 'relative',
  width: 60,
  height: 75,
  flexShrink: 0,
  overflow: 'hidden',
  padding: 0,
  background: '#f0ebe4',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease',
};
