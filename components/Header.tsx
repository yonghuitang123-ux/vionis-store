'use client';

import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

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
          style={{ backgroundColor: '#1a1a1a', color: '#fff' }}
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

function IconX({ size = 14 }: { size?: number }) {
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
  const slides = announcement.轮播列表 ?? [];

  // ── 公告轮播 ────────────────────────────────────────────────────────────────
  const [slideIdx, setSlideIdx] = useState(0);
  const [slideVisible, setSlideVisible] = useState(true);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideVisible(false);
      setTimeout(() => {
        setSlideIdx((i) => (i + 1) % slides.length);
        setSlideVisible(true);
      }, 380);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // ── 公告栏显隐 ──────────────────────────────────────────────────────────────
  const [announcementVisible, setAnnouncementVisible] = useState(announcement.显示);

  // ── 滚动收起 / 展开（向下收起，向上展开） ──────────────────────────────────
  const [headerHidden, setHeaderHidden] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 12) {
        setHeaderHidden(false);
      } else if (y > prevScrollY.current + 3) {
        setHeaderHidden(true);   // 向下滚动 → 收起
      } else if (y < prevScrollY.current - 3) {
        setHeaderHidden(false);  // 向上滚动 → 展开
      }
      prevScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerRef = useRef<HTMLDivElement>(null);

  // ── 手机菜单 ────────────────────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* 菜单下划线动画 */}
      <style>{`
        .hdr-link {
          position: relative;
          display: inline-block;
        }
        .hdr-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0%;
          height: 1px;
          background: currentColor;
          transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .hdr-link:hover::after { width: 100%; }
      `}</style>

      {/* ── 固定 header（整体 translateY 收起/展开） ── */}
      <div
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          transform: headerHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.4s ease',
        }}
      >

        {/* ═══ 第一行：公告栏 ═══════════════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: '#E8DFD6',
            maxHeight: announcementVisible ? '44px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
          }}
        >
          <div
            className="flex items-center justify-center relative px-10"
            style={{ height: 44, borderBottom: '1px solid #A05E46' }}
          >
            <span
              style={{
                color: '#1a1a1a',
                fontFamily: '"Assistant", sans-serif',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: slideVisible ? 1 : 0,
                transition: 'opacity 0.35s ease',
                display: 'inline-block',
              }}
            >
              {slides[slideIdx] ?? ''}
            </span>

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

        {/* ═══ 第二行：Logo 居中大图 ════════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: '#E8DFD6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '14px 0',
          }}
        >
          <Link href="/" aria-label="VIONIS·XY 首页" style={{ lineHeight: 0, display: 'block' }}>
            <NextImage
              src="/主页顶部标签.png"
              alt="VIONIS·XY"
              width={220}
              height={80}
              priority
              style={{ height: 80, width: 'auto', objectFit: 'contain', color: 'transparent', mixBlendMode: 'multiply' }}
            />
          </Link>
        </div>

        {/* ═══ 第三行：导航菜单 ════════════════════════════════════════════════ */}
        <div style={{ backgroundColor: '#E8DFD6' }}>

          {/* 桌面端：search 左 | 菜单居中 | 图标右 */}
          <div
            className="hidden md:flex items-center px-10"
            style={{ height: 52, position: 'relative' }}
          >
            {/* 左：搜索 */}
            <div style={{ position: 'absolute', left: 40, display: 'flex', alignItems: 'center' }}>
              <button
                className="p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label="搜索"
              >
                <IconSearch />
              </button>
            </div>

            {/* 中：导航链接（严格居中） */}
            <nav
              className="flex items-center"
              style={{ flex: 1, justifyContent: 'center', display: 'flex', gap: 40 }}
            >
              {nav.菜单.map((item) => (
                <Link
                  key={item.链接 + item.文字}
                  href={item.链接}
                  className="hdr-link"
                  style={{
                    color: item.颜色 ?? '#1a1a1a',
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
              ))}
            </nav>

            {/* 右：图标组 */}
            <div
              style={{ position: 'absolute', right: 40, display: 'flex', alignItems: 'center', gap: 20 }}
            >
              <button
                className="p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label="收藏夹"
              >
                <IconHeart />
              </button>
              <Link
                href="/account"
                className="p-1 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0 }}
                aria-label="账户"
              >
                <IconUser />
              </Link>
              <Link
                href="/cart"
                className="p-1 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0 }}
                aria-label="购物车"
              >
                <IconBag count={0} />
              </Link>
            </div>
          </div>

          {/* 手机端：汉堡左 | 空中 | 购物车右 */}
          <div className="flex md:hidden items-center justify-between px-5" style={{ height: 52 }}>
            <button
              className="p-1 transition-opacity hover:opacity-60"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            >
              {mobileOpen ? <IconX size={18} /> : <IconMenu />}
            </button>

            <div className="flex items-center" style={{ gap: 18 }}>
              <button
                className="p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label="搜索"
              >
                <IconSearch />
              </button>
              <Link
                href="/cart"
                className="p-1 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0 }}
                aria-label="购物车"
              >
                <IconBag count={0} />
              </Link>
            </div>
          </div>
        </div>

        {/* ═══ 手机端菜单抽屉 ═══════════════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: '#E8DFD6',
            maxHeight: mobileOpen ? '520px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <nav className="flex flex-col px-8 pt-5 pb-7">
            {nav.菜单.map((item, idx) => (
              <Link
                key={item.链接 + item.文字}
                href={item.链接}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: item.颜色 ?? '#1a1a1a',
                  fontFamily: '"Assistant", sans-serif',
                  fontSize: 13,
                  fontWeight: 300,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '15px 0',
                  display: 'block',
                }}
              >
                {item.文字}
              </Link>
            ))}

            <div className="flex items-center gap-6 mt-5 pt-5">
              {[
                { icon: <IconHeart />, label: 'Wishlist' },
                { icon: <IconUser />,  label: 'Account'  },
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
            </div>
          </nav>
        </div>

      </div>

      {/* Spacer 已移除：header 以 position:fixed 悬浮，页面内容从顶部开始渲染 */}
    </>
  );
}
