'use client';

/**
 * 语言 + 货币切换器
 * ─────────────────────────────────────────────────────────────────
 * 点击打开下拉菜单，左侧语言列表，右侧货币列表
 * 语言切换 → 导航到对应 locale URL + 设置 cookie
 * 货币切换 → 设置 cookie（不改 URL）
 */

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  locales,
  localeNames,
  localeCurrencyMap,
  currencies,
  type Locale,
} from '@/lib/i18n/config';
import { useTranslation } from '@/lib/i18n/client';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

interface LocaleSwitcherProps {
  /** 显示样式：header 里简洁 / footer 里完整 */
  variant?: 'compact' | 'full';
}

export default function LocaleSwitcher({ variant = 'compact' }: LocaleSwitcherProps) {
  const { locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'language' | 'currency'>('language');
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    if (typeof window === 'undefined') return localeCurrencyMap[locale];
    return getCookie('NEXT_CURRENCY') ?? localeCurrencyMap[locale];
  });
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 切换语言
  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    setCookie('NEXT_LOCALE', newLocale);
    setOpen(false);
    router.push(newPath);
  };

  // 切换货币
  const switchCurrency = (code: string) => {
    setCookie('NEXT_CURRENCY', code);
    setCurrentCurrency(code);
    setOpen(false);
    router.refresh();
  };

  if (variant === 'compact') {
    return (
      <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1a1a1a',
            fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 0',
          }}
        >
          <span>{localeNames[locale]}</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>{currentCurrency}</span>
          <svg width={8} height={8} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={open ? 'M1 7L5 3L9 7' : 'M1 3L5 7L9 3'} />
          </svg>
        </button>

        {open && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              background: '#FAF8F4',
              border: '1px solid rgba(200,182,158,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              zIndex: 9999,
              minWidth: 280,
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(200,182,158,0.15)' }}>
              {(['language', 'currency'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: tab === t ? '#1a1a1a' : '#999',
                    borderBottom: tab === t ? '1px solid #C8B69E' : '1px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  {t === 'language' ? 'Language' : 'Currency'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ maxHeight: 320, overflowY: 'auto', padding: '8px 0' }}>
              {tab === 'language'
                ? locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '10px 16px',
                        background: l === locale ? 'rgba(200,182,158,0.1)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                        fontSize: 12,
                        color: '#1a1a1a',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          minWidth: 28,
                          fontSize: 10,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#999',
                        }}
                      >
                        {l}
                      </span>
                      <span style={{ flex: 1 }}>{localeNames[l]}</span>
                      {l === locale && (
                        <span style={{ color: '#C8B69E', fontSize: 14 }}>✓</span>
                      )}
                    </button>
                  ))
                : currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => switchCurrency(c.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '10px 16px',
                        background:
                          c.code === currentCurrency
                            ? 'rgba(200,182,158,0.1)'
                            : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                        fontSize: 12,
                        color: '#1a1a1a',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontWeight: 500, minWidth: 36 }}>{c.symbol}</span>
                      <span style={{ flex: 1 }}>{c.name}</span>
                      <span style={{ color: '#999', fontSize: 11 }}>{c.code}</span>
                      {c.code === currentCurrency && (
                        <span style={{ color: '#C8B69E', fontSize: 14 }}>✓</span>
                      )}
                    </button>
                  ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant (for footer)
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          color: 'inherit',
          fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
          fontSize: 11,
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
        }}
      >
        <span>{localeNames[locale]}</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>{currentCurrency}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: 8,
            background: '#FAF8F4',
            border: '1px solid rgba(200,182,158,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            zIndex: 9999,
            minWidth: 280,
            color: '#1a1a1a',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(200,182,158,0.15)' }}>
            {(['language', 'currency'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: tab === t ? '#1a1a1a' : '#999',
                  borderBottom: tab === t ? '1px solid #C8B69E' : '1px solid transparent',
                  marginBottom: -1,
                }}
              >
                {t === 'language' ? 'Language' : 'Currency'}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto', padding: '8px 0' }}>
            {tab === 'language'
              ? locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '10px 16px',
                      background: l === locale ? 'rgba(200,182,158,0.1)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                      fontSize: 12,
                      color: '#1a1a1a',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 500,
                        minWidth: 28,
                        fontSize: 10,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#999',
                      }}
                    >
                      {l}
                    </span>
                    <span style={{ flex: 1 }}>{localeNames[l]}</span>
                    {l === locale && <span style={{ color: '#C8B69E', fontSize: 14 }}>✓</span>}
                  </button>
                ))
              : currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => switchCurrency(c.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '10px 16px',
                      background:
                        c.code === currentCurrency ? 'rgba(200,182,158,0.1)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                      fontSize: 12,
                      color: '#1a1a1a',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontWeight: 500, minWidth: 36 }}>{c.symbol}</span>
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ color: '#999', fontSize: 11 }}>{c.code}</span>
                    {c.code === currentCurrency && (
                      <span style={{ color: '#C8B69E', fontSize: 14 }}>✓</span>
                    )}
                  </button>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
