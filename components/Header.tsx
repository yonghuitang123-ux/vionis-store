'use client';

import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

// ─── SVG Icons（极简线条风格） ────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 20.9l7.84-7.84a5.5 5.5 0 0 0 0-7.45z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconBag({ count }: { count: number }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] rounded-full text-[9px] flex items-center justify-center px-0.5"
          style={{ backgroundColor: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}
        >
          {count}
        </span>
      )}
    </span>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <line x1="3" y1="7"  x2="21" y2="7"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Header() {
  const { announcement, nav } = siteConfig;

  const [announcementVisible, setAnnouncementVisible] = useState(announcement.显示);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 整个 header 的不透明度（滚动 > 80px → 淡出）
  const [headerOpacity, setHeaderOpacity] = useState(1);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(124);

  // 滚动淡出
  useEffect(() => {
    const onScroll = () => {
      setHeaderOpacity(window.scrollY > 80 ? 0 : 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ResizeObserver 追踪 header 真实高度 → spacer
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 宽屏时自动关闭手机菜单
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* ── 下划线 hover 动画 CSS ── */}
      <style>{`
        .hdr-nav-link {
          position: relative;
          display: inline-block;
        }
        .hdr-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 1px;
          background-color: currentColor;
          transition: width 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .hdr-nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      {/* ── 固定顶部 header ── */}
      <div
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          opacity: headerOpacity,
          transition: 'opacity 0.6s ease',
          // 透明时禁止点击，避免不可见按钮拦截事件
          pointerEvents: headerOpacity === 0 ? 'none' : 'auto',
        }}
      >

        {/* ── 公告栏（背景 #E8DFD6，深色文字） ── */}
        <div
          style={{
            backgroundColor: '#E8DFD6',
            maxHeight: announcementVisible ? '44px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
            borderBottom: announcementVisible ? '1px solid #d4c9be' : 'none',
          }}
        >
          <div
            className="flex items-center justify-center relative px-10"
            style={{ height: 44 }}
          >
            {announcement.链接 ? (
              <Link
                href={announcement.链接}
                className="hdr-nav-link hover:opacity-70 transition-opacity"
                style={{
                  color: '#1a1a1a',
                  fontFamily: '"Assistant", sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                {announcement.文字}
              </Link>
            ) : (
              <p style={{
                color: '#1a1a1a',
                fontFamily: '"Assistant", sans-serif',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                {announcement.文字}
              </p>
            )}

            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
              style={{ color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 0 }}
              onClick={() => setAnnouncementVisible(false)}
              aria-label="关闭公告"
            >
              <IconX size={11} />
            </button>
          </div>
        </div>

        {/* ── 主导航栏 ── */}
        <div
          style={{
            backgroundColor: '#E8DFD6',
            borderBottom: '1px solid #d4c9be',
          }}
        >
          <div
            className="px-6 md:px-12"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              height: 80,
            }}
          >

            {/* ── 左侧：汉堡（手机）/ 搜索 + 导航链接（桌面） ── */}
            <div className="flex items-center" style={{ gap: 20 }}>

              {/* 汉堡（手机端） */}
              <button
                className="md:hidden p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
              >
                {mobileOpen ? <IconX size={18} /> : <IconMenu />}
              </button>

              {/* 搜索（桌面端） */}
              <button
                className="hidden md:flex p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label="搜索"
              >
                <IconSearch />
              </button>

              {/* 导航链接（桌面端，间距 48px） */}
              <nav className="hidden md:flex items-center" style={{ gap: 48 }}>
                {nav.菜单.map((item) => {
                  const color = item.颜色 ?? '#1a1a1a';
                  return (
                    <Link
                      key={item.链接 + item.文字}
                      href={item.链接}
                      className="hdr-nav-link"
                      style={{
                        color,
                        fontFamily: '"Assistant", sans-serif',
                        fontSize: 11,
                        fontWeight: 400,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                      }}
                    >
                      {item.文字}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* ── 中间 Logo ── */}
            <div className="flex justify-center">
              <Link href="/" aria-label="VIONIS·XY 首页" style={{ lineHeight: 0 }}>
                <NextImage
                  src="/主页顶部标签.png"
                  alt="VIONIS·XY"
                  width={180}
                  height={60}
                  priority
                  style={{ height: 60, width: 'auto', objectFit: 'contain' }}
                />
              </Link>
            </div>

            {/* ── 右侧图标 ── */}
            <div className="flex items-center justify-end" style={{ gap: 20 }}>

              {/* 收藏（桌面端） */}
              <button
                className="hidden md:flex p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label="收藏夹"
              >
                <IconHeart />
              </button>

              {/* 账户（桌面端） */}
              <Link
                href="/account"
                className="hidden md:flex p-1 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0 }}
                aria-label="账户"
              >
                <IconUser />
              </Link>

              {/* 购物车（始终显示） */}
              <Link
                href="/cart"
                className="flex p-1 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0 }}
                aria-label="购物车"
              >
                <IconBag count={0} />
              </Link>
            </div>

          </div>
        </div>

        {/* ── 手机端菜单抽屉 ── */}
        <div
          style={{
            backgroundColor: '#E8DFD6',
            maxHeight: mobileOpen ? '520px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
            borderBottom: mobileOpen ? '1px solid #d4c9be' : 'none',
          }}
        >
          <nav className="flex flex-col px-8 pt-6 pb-8">

            {nav.菜单.map((item, idx) => {
              const color = item.颜色 ?? '#1a1a1a';
              return (
                <Link
                  key={item.链接 + item.文字}
                  href={item.链接}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color,
                    fontFamily: '"Assistant", sans-serif',
                    fontSize: 13,
                    fontWeight: 300,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '15px 0',
                    borderBottom: idx < nav.菜单.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    display: 'block',
                  }}
                >
                  {item.文字}
                </Link>
              );
            })}

            {/* 辅助操作行 */}
            <div className="flex items-center gap-6 mt-6 pt-5" style={{ borderTop: '1px solid #d4c9be' }}>
              {[
                { icon: <IconSearch />, label: 'Search'   },
                { icon: <IconHeart />,  label: 'Wishlist'  },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-2 transition-opacity hover:opacity-60"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#1a1a1a', fontFamily: '"Assistant", sans-serif',
                    fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', padding: 0,
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 transition-opacity hover:opacity-60"
                style={{
                  color: '#1a1a1a', fontFamily: '"Assistant", sans-serif',
                  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none',
                }}
              >
                <IconUser />
                <span>Account</span>
              </Link>
            </div>
          </nav>
        </div>

      </div>

      {/* Spacer — 与 fixed header 高度同步 */}
      <div style={{ height: headerHeight }} aria-hidden />
    </>
  );
}
