'use client';

/**
 * PlaceholderImage
 * ─────────────────────────────────────────────────────────────────
 * 替代 next/image 的 <Image>，图片加载期间展示品牌占位效果：
 *   · 纯色背景 #E8DFD6，不显示任何图标或文字
 *   · 加载完成后以 0.4s 渐隐动画消失，随后 visibility:hidden
 *     彻底移出渲染层，不再影响 z-index / 交互
 *   · color:transparent 隐藏浏览器默认 broken image 图标及 alt 文字
 *
 * Bug fix：浏览器缓存图片在 React 挂载前已加载完成时，onLoad 不会再次触发。
 *          通过 ref + useEffect 检查 img.complete 解决此问题。
 *
 * ⚠️  使用要求：父容器必须有定位上下文（position: relative/absolute/fixed/sticky）
 */

import NextImage, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

// 内联 base64 logo — 零网络请求
const LOGO_BASE64 =
  'data:image/png;base64,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';

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
  style: styleProp,
  ...props
}: PlaceholderImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

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
    visibility:      loaded ? 'hidden' : 'visible',
    transition:      'opacity 0.4s ease',
    pointerEvents:   'none',
  };

  // color:transparent → 隐藏 broken image 图标及 alt 文字
  const mergedStyle: React.CSSProperties = { color: 'transparent', ...styleProp };

  // 非首屏图片：loading lazy + placeholder blur
  const defaultBlur =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAP/Z';
  const useBlur = !props.priority && props.placeholder !== 'empty';
  const imageProps = {
    ...props,
    placeholder: useBlur ? ('blur' as const) : props.placeholder,
    blurDataURL: useBlur ? (props.blurDataURL ?? defaultBlur) : props.blurDataURL,
    loading: props.loading ?? (props.priority ? 'eager' : 'lazy'),
  };

  // ── fill 模式 ──────────────────────────────────────────────────────────────
  if (fill) {
    return (
      <>
        <div aria-hidden className={overlayClassName} style={overlayStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_BASE64} alt="" width={60} height={33} style={{ opacity: 0.3, objectFit: 'contain' }} />
        </div>
        <NextImage
          ref={imgRef}
          fill
          {...imageProps}
          style={mergedStyle}
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    );
  }

  // ── 尺寸确定模式 ────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', width, height, display: 'inline-block' }}>
      <div aria-hidden className={overlayClassName} style={overlayStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_BASE64} alt="" width={60} height={33} style={{ opacity: 0.3, objectFit: 'contain' }} />
      </div>
      <NextImage
        ref={imgRef}
        width={width}
        height={height}
        {...imageProps}
        style={mergedStyle}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
