'use client';

/**
 * 邮件订阅弹窗组件
 * ─────────────────────────────────────────────────────────────────
 * 延迟弹出的居中模态框，读取 siteConfig.newsletter 配置。
 * 关闭后写入 cookie（24 小时内不再弹出）。
 */

import { siteConfig } from '@/config/site';
import { useCallback, useEffect, useId, useState } from 'react';

// ─── 品牌设计 Token ──────────────────────────────────────────────────────────
const BG      = '#E8DFD6';
const TEXT    = '#1a1a1a';
const ACCENT  = '#A05E46';
const HEADING = 'var(--font-cormorant), "Cormorant", serif';
const BODY    = 'var(--font-montserrat), "Montserrat", sans-serif';

const COOKIE_KEY = 'vionis_newsletter_dismissed';

// ─── Cookie 读写工具 ─────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, hours: number) {
  const expires = new Date(Date.now() + hours * 3600_000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${expires}`;
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────

export default function NewsletterPopup() {
  const [visible, setVisible]     = useState(false);
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const uid      = useId();
  const scopeId  = `nl${uid.replace(/:/g, '')}`;

  const cfg   = siteConfig.newsletter;
  const delay = cfg.显示延迟 ?? 60000;

  // 挂载时检测 cookie，延迟弹出
  useEffect(() => {
    if (getCookie(COOKIE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // 关闭弹窗
  const handleClose = useCallback(() => {
    setVisible(false);
    setCookie(COOKIE_KEY, '1', 24);
  }, []);

  // 提交订阅
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubmitted(true);
      setCookie(COOKIE_KEY, '1', 24);
    },
    [email],
  );

  // 弹窗打开时禁止页面滚动
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  // ─── 动画样式 ──────────────────────────────────────────────────────────────
  const css = `
    #${scopeId} .nl-backdrop {
      position: fixed; inset: 0; z-index: 1200;
      background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: nl-fade 0.35s ease;
    }
    @keyframes nl-fade { from { opacity: 0; } to { opacity: 1; } }
    #${scopeId} .nl-card {
      position: relative;
      width: 100%; max-width: 440px;
      background: ${BG};
      border: 1px solid rgba(0,0,0,0.1);
      padding: 48px 36px 40px;
      text-align: center;
      animation: nl-rise 0.4s ease;
    }
    @keyframes nl-rise {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 480px) {
      #${scopeId} .nl-card { padding: 36px 24px 32px; }
    }
  `;

  if (!visible) return null;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        className="nl-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <div className="nl-card">
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            aria-label="Close popup"
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'none', border: 'none', cursor: 'pointer',
              color: TEXT, padding: 4,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <line x1="1" y1="1" x2="15" y2="15" />
              <line x1="15" y1="1" x2="1" y2="15" />
            </svg>
          </button>

          {submitted ? (
            /* 提交成功状态 */
            <div>
              <h3 style={{
                fontFamily: HEADING,
                fontSize: 26, fontWeight: 400,
                color: TEXT, letterSpacing: '0.08em',
                margin: '0 0 12px',
              }}>
                Thank You
              </h3>
              <p style={{
                fontFamily: BODY, fontSize: 13,
                color: TEXT, opacity: 0.65,
                lineHeight: 1.7, letterSpacing: '0.03em',
                margin: 0,
              }}>
                You&rsquo;re now part of the VIONIS·XY inner circle.
              </p>
            </div>
          ) : (
            /* 订阅表单 */
            <>
              <h3 style={{
                fontFamily: HEADING,
                fontSize: 28, fontWeight: 400,
                color: TEXT, letterSpacing: '0.06em',
                margin: '0 0 10px', lineHeight: 1.2,
              }}>
                {cfg.标题}
              </h3>
              <p style={{
                fontFamily: BODY, fontSize: 13,
                color: TEXT, opacity: 0.65,
                lineHeight: 1.7, letterSpacing: '0.03em',
                margin: '0 0 28px', maxWidth: 340, marginInline: 'auto',
              }}>
                {cfg.副标题}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={cfg.占位文字}
                  style={{
                    width: '100%', maxWidth: 320,
                    padding: '11px 14px',
                    border: '1px solid rgba(0,0,0,0.15)',
                    background: 'rgba(255,255,255,0.6)',
                    fontFamily: BODY, fontSize: 13,
                    color: TEXT, letterSpacing: '0.04em',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)')}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%', maxWidth: 320,
                    padding: '12px 0',
                    background: TEXT, color: '#fff', border: 'none',
                    fontFamily: BODY, fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {cfg.按钮}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
