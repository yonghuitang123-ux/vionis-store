'use client';

/**
 * PlaceholderImage
 * ─────────────────────────────────────────────────────────────────
 * 替代 next/image 的 <Image>，图片加载期间在容器内展示品牌占位效果：
 *   · 背景色 #E8DFD6（与品牌调性一致）
 *   · 中央显示 /LOGO.png（100px，仅 fill 模式下，容器够大时）
 *   · 加载完成后以 0.4s 渐隐动画消失
 *   · onError 时也隐藏占位层，避免永久遮挡
 *   · overlayClassName 用于电脑/手机双图共享同一容器时，
 *     令占位层与图片保持相同的响应式显隐逻辑
 *
 * ⚠️  使用要求：父容器必须有定位上下文（position: relative/absolute/fixed/sticky），
 *              fill 模式下尤其重要。
 */

import NextImage, { type ImageProps } from 'next/image';
import { useState } from 'react';

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

  const handleLoad: ImageProps['onLoad'] = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError: ImageProps['onError'] = (e) => {
    setLoaded(true);
    onError?.(e);
  };

  const overlayStyle: React.CSSProperties = {
    position:        'absolute',
    inset:           0,
    zIndex:          10,
    backgroundColor: '#E8DFD6',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    opacity:         loaded ? 0 : 1,
    transition:      'opacity 0.4s ease',
    pointerEvents:   'none',
  };

  // ── fill 模式（占满父容器）：渲染为 Fragment，overlay 锚定在最近的 positioned 祖先上
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
          fill
          {...props}
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    );
  }

  // ── 尺寸确定模式（width + height 固定）：包一层 relative div 锚定 overlay
  // 不显示 LOGO（容器尺寸不确定，避免溢出）
  return (
    <div style={{ position: 'relative', width, height, display: 'inline-block' }}>
      <div aria-hidden className={overlayClassName} style={overlayStyle} />
      <NextImage
        width={width}
        height={height}
        {...props}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
