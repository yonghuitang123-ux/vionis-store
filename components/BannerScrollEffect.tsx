'use client';

import { useEffect, useRef } from 'react';

interface BannerScrollEffectProps {
  /** 用于 querySelector 定位 DOM 元素的 scope ID */
  scopeId: string;
  /** 内容框背景色 */
  contentBg?: string;
  /** 滚动动画完成所需的滚动距离（px） */
  animationRange?: number;
  /** 电脑端惯性阻尼系数（0.01–0.1，越小越滑） */
  dampingFactor?: number;
}

export default function BannerScrollEffect({
  scopeId,
  contentBg = '#FFFFFF',
  animationRange = 600,
  dampingFactor = 0.08,
}: BannerScrollEffectProps) {
  const anim = useRef({
    target: 0,
    current: 0,
    running: false,
    mobile: false,
  });

  useEffect(() => {
    const root = document.getElementById(scopeId);
    if (!root) return;

    const leftEl = root.querySelector<HTMLDivElement>('[data-lb-left]');
    const rightEl = root.querySelector<HTMLDivElement>('[data-lb-right]');
    const overlayEl = root.querySelector<HTMLDivElement>('[data-lb-overlay]');
    const boxEl = root.querySelector<HTMLDivElement>('[data-lb-box]');

    const st = anim.current;
    const STOP_THRESHOLD = 0.1;

    st.mobile = window.innerWidth <= 750;

    function onResize() {
      st.mobile = window.innerWidth <= 750;
    }

    function render() {
      if (st.mobile) {
        st.current = st.target;
      } else {
        st.current += (st.target - st.current) * dampingFactor;
      }

      const p = Math.max(0, Math.min(1, st.current / animationRange));
      const offset = 15 * (1 - p);

      if (leftEl)
        leftEl.style.transform = `translate3d(-${offset}%,0,0)`;
      if (rightEl)
        rightEl.style.transform = `translate3d(${offset}%,0,0)`;

      if (overlayEl) {
        const startTop = st.mobile ? 55 : 65;
        overlayEl.style.top = `${startTop - 10 * p}%`;
      }

      if (boxEl) {
        if (p > 0.8) {
          boxEl.style.backgroundColor = 'rgba(255,255,255,0)';
          boxEl.style.boxShadow = 'none';
        } else {
          boxEl.style.backgroundColor = contentBg;
          boxEl.style.boxShadow = '0 20px 80px rgba(0,0,0,0.05)';
        }
      }

      if (!st.mobile && Math.abs(st.target - st.current) > STOP_THRESHOLD) {
        requestAnimationFrame(render);
      } else {
        st.running = false;
      }
    }

    function onScroll() {
      st.target = window.scrollY || document.documentElement.scrollTop;

      if (!st.running) {
        st.running = true;
        requestAnimationFrame(render);
      }
      if (st.mobile) requestAnimationFrame(render);
    }

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [scopeId, animationRange, dampingFactor, contentBg]);

  // 纯逻辑组件，不渲染额外 DOM
  return null;
}
