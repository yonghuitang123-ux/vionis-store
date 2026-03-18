'use client';

/**
 * 页面切换顶部进度条
 * ─────────────────────────────────────────────────────────────────
 * 路由变化时显示细线进度条，品牌色 #A05E46
 */

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        background: 'linear-gradient(90deg, #A05E46 0%, #A05E46 50%, transparent 100%)',
        transformOrigin: 'left',
        animation: 'nprog 0.4s ease-out forwards',
      }}
    >
      <style>{`
        @keyframes nprog {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
