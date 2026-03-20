'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import SearchModal from '@/components/SearchModal';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useTranslation } from '@/lib/i18n/client';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconSearch({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </svg>
  );
}

function IconHeart({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 20.9l7.84-7.84a5.5 5.5 0 0 0 0-7.45z" />
    </svg>
  );
}

function IconUser({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconBag({ count, size = 17 }: { count: number; size?: number }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] rounded-full text-[9px] font-medium flex items-center justify-center px-0.5"
          style={{ backgroundColor: '#A05E46', color: '#fff' }}
        >
          {count}
        </span>
      )}
    </span>
  );
}

function IconMenu({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
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
  const { totalQuantity, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);

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
    const onResize = () => { if (window.innerWidth >= 1280) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* 菜单下划线动画 + 响应式导航 */}
      <style>{`
        .hdr-link {
          position: relative;
          display: inline-block;
          white-space: nowrap;
          padding: 8px 0;
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
        .hdr-nav-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 36px;
          white-space: nowrap;
          max-width: calc(100% - 480px);
        }
        @media (max-width: 1400px) {
          .hdr-nav-center { gap: 28px; }
        }
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
            maxHeight: announcementVisible ? '36px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
          }}
        >
          <div
            className="flex items-center justify-center relative px-10"
            style={{ height: 36, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          >
            <span
              className="announcement-slide-text"
              style={{
                color: '#1a1a1a',
                fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                fontSize: 10.5,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                opacity: slideVisible ? 1 : 0,
                transition: 'opacity 0.35s ease',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 40px)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {(() => {
                const slide = slides[slideIdx];
                if (!slide) return '';
                if (typeof slide === 'string') return slide;
                return slide.翻译键 ? t(slide.翻译键) : slide.文字;
              })()}
            </span>

            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
              style={{ color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 0 }}
              onClick={() => setAnnouncementVisible(false)}
              aria-label={t('common.close') || 'Close announcement'}
            >
              <IconX size={11} />
            </button>
          </div>
        </div>

        {/* ═══ 第二行：Logo 居中大图（仅桌面端显示独立行） ═════════════════════ */}
        <div
          className="hidden xl:flex"
          style={{
            backgroundColor: '#E8DFD6',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '14px 0',
          }}
        >
          <Link href="/" aria-label="VIONIS·XY 首页" style={{ lineHeight: 0, display: 'block' }}>
            <Image
              src="/logo1.png"
              alt="VIONIS·XY"
              width={120}
              height={68}
              sizes="120px"
              priority
            />
          </Link>
        </div>

        {/* ═══ 第三行：导航菜单 ════════════════════════════════════════════════ */}
        <div style={{ backgroundColor: '#E8DFD6', borderTop: '1px solid rgba(0,0,0,0.06)' }}>

          {/* 桌面端：search 左 | 菜单居中 | 图标右 */}
          <div
            className="hidden xl:flex items-center px-[30px]"
            style={{ height: 52, position: 'relative' }}
          >
            {/* 左：搜索 + 收藏 */}
            <div style={{ position: 'absolute', left: 30, display: 'flex', alignItems: 'center', gap: 18, zIndex: 1 }}>
              <button
                className="p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label={t('nav.search') || 'Search'}
                onClick={() => setSearchOpen(true)}
              >
                <IconSearch />
              </button>
              <Link
                href="/wishlist"
                className="p-1 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0, position: 'relative', display: 'inline-flex' }}
                aria-label={t('nav.wishlist') || 'Wishlist'}
              >
                <IconHeart />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] rounded-full text-[9px] font-medium flex items-center justify-center px-0.5"
                    style={{ backgroundColor: '#C8B69E', color: '#fff' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>

            {/* 中：导航链接 */}
            <nav className="hdr-nav-center">
              {nav.菜单.map((item) => (
                <Link
                  key={item.链接 + item.文字}
                  href={item.链接}
                  prefetch
                  className="hdr-link"
                  style={{
                    color: item.颜色 ?? '#1a1a1a',
                    fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  {item.翻译键 ? t(item.翻译键) : item.文字}
                </Link>
              ))}
            </nav>

            {/* 右：图标组 */}
            <div
              className="hdr-icons-right"
              style={{ position: 'absolute', right: 30, display: 'flex', alignItems: 'center', gap: 20, zIndex: 1 }}
            >
              <Link
                href="/account"
                className="p-1 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0 }}
                aria-label={t('nav.account') || 'Account'}
              >
                <IconUser />
              </Link>
              <button
                className="p-1 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label={t('nav.cart') || 'Cart'}
                onClick={openDrawer}
              >
                <IconBag count={totalQuantity} />
              </button>
              <LocaleSwitcher variant="compact" />
            </div>
          </div>

          {/* 手机端：[汉堡 搜索] — Logo居中 — [账户 购物车] */}
          <div className="flex xl:hidden items-center justify-between px-4" style={{ height: 56, position: 'relative' }}>
            {/* 左：汉堡 + 搜索 */}
            <div className="flex items-center" style={{ gap: 14, zIndex: 1 }}>
              <button
                className="p-2 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? (t('common.close') || 'Close menu') : 'Open menu'}
              >
                {mobileOpen ? <IconX size={22} /> : <IconMenu size={26} />}
              </button>
              <button
                className="p-2 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label={t('nav.search') || 'Search'}
                onClick={() => setSearchOpen(true)}
              >
                <IconSearch size={22} />
              </button>
            </div>

            {/* 中：Logo（绝对居中） */}
            <Link
              href="/"
              aria-label="VIONIS·XY 首页"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                lineHeight: 0,
              }}
            >
              <Image
                src="/logo1.png"
                alt="VIONIS·XY"
                width={88}
                height={49}
                sizes="88px"
                priority
              />
            </Link>

            {/* 右：账户 + 购物车 */}
            <div className="flex items-center" style={{ gap: 14, zIndex: 1 }}>
              <Link
                href="/account"
                className="p-2 transition-opacity hover:opacity-60"
                style={{ color: '#1a1a1a', lineHeight: 0 }}
                aria-label={t('nav.account') || 'Account'}
              >
                <IconUser size={22} />
              </Link>
              <button
                className="p-2 transition-opacity hover:opacity-60"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', lineHeight: 0 }}
                aria-label={t('nav.cart') || 'Cart'}
                onClick={openDrawer}
              >
                <IconBag count={totalQuantity} size={22} />
              </button>
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
                prefetch
                onClick={() => setMobileOpen(false)}
                style={{
                  color: item.颜色 ?? '#1a1a1a',
                  fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                  fontSize: 13,
                  fontWeight: 300,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '15px 0',
                  display: 'block',
                }}
              >
                {item.翻译键 ? t(item.翻译键) : item.文字}
              </Link>
            ))}

            <div className="flex items-center gap-6 mt-5 pt-5">
              {[
                { icon: <IconHeart />, label: t('nav.wishlist'), href: '/wishlist' },
                { icon: <IconUser />,  label: t('nav.account'),  href: '/account' },
              ].map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 transition-opacity hover:opacity-60"
                  style={{
                    color: '#1a1a1a', fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                    fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  {icon}
                  <span>{label}{href === '/wishlist' && wishlistCount > 0 ? ` (${wishlistCount})` : ''}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

      </div>

      {/* 搜索弹窗 */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
