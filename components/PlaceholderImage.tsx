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
        <div aria-hidden className={overlayClassName} style={overlayStyle} />
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
      <div aria-hidden className={overlayClassName} style={overlayStyle} />
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
