'use client';

/**
 * PlaceholderImage
 * ─────────────────────────────────────────────────────────────────
 * 替代 next/image 的 <Image>，图片加载期间在容器内展示品牌占位效果：
 *   · 背景色 #E8DFD6（与品牌调性一致）
 *   · 中央显示 /LOGO.png（100px，仅 fill 模式下）
 *   · 加载完成后以 0.4s 渐隐动画消失，随后设为 visibility:hidden
 *     彻底移出渲染层，不再影响 z-index / 交互
 *
 * Bug fix：浏览器缓存图片在 React 挂载前已加载完成时，onLoad 不会再次触发。
 *          通过 ref + useEffect 检查 img.complete 解决此问题。
 *
 * ⚠️  使用要求：父容器必须有定位上下文（position: relative/absolute/fixed/sticky）
 */

import NextImage, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface PlaceholderImageProps extends ImageProps {
  /**
   * 传给占位遮罩层的 Tailwind className（可选）。
   * 当电脑端/手机端两张图共享同一父容器时，
   * 传入与图片相同的显隐类（如 "hidden min-[769px]:block"），
   * 防止另一尺寸的遮罩盖住已加载的图片。
   */
  overlayClassName?: string;
}

export default function PlaceholderImage({
  onLoad,
  onError,
  fill,
  width,
  height,
  overlayClassName,
  ...props
}: PlaceholderImageProps) {
  const [loaded, setLoaded] = useState(false);
  // ref 指向底层 <img> 元素，用于检查缓存图片是否已加载完成
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 若图片已从缓存加载完成（complete=true），直接标记为已加载
    // 必须在 useEffect 中执行，否则 SSR 阶段 DOM 尚不存在
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const handleLoad: ImageProps['onLoad'] = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError: ImageProps['onError'] = (e) => {
    // 加载失败也隐藏占位层，避免永久遮挡
    setLoaded(true);
    onError?.(e);
  };

  const overlayStyle: React.CSSProperties = {
    position:   'absolute',
    inset:      0,
    zIndex:     10,
    backgroundColor: '#E8DFD6',
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // 加载完成后：opacity 0（渐隐）+ visibility hidden（彻底移出渲染层，不阻挡交互/层级）
    opacity:    loaded ? 0 : 1,
    visibility: loaded ? 'hidden' : 'visible',
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
  };

  // ── fill 模式：渲染为 Fragment，overlay 锚定在最近的 positioned 祖先 ──────────
  if (fill) {
    return (
      <>
        <div aria-hidden className={overlayClassName} style={overlayStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LOGO.png"
            alt=""
            style={{ width: 100, height: 100, objectFit: 'contain' }}
          />
        </div>
        <NextImage
          ref={imgRef}
          fill
          {...props}
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    );
  }

  // ── 尺寸确定模式：包一层 relative div 锚定 overlay，不显示 LOGO ────────────
  return (
    <div style={{ position: 'relative', width, height, display: 'inline-block' }}>
      <div aria-hidden className={overlayClassName} style={overlayStyle} />
      <NextImage
        ref={imgRef}
        width={width}
        height={height}
        {...props}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
