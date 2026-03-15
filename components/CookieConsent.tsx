'use client';

/**
 * CookieConsent — GDPR 合规 Cookie 同意弹窗
 * ─────────────────────────────────────────────────────────────────
 * 底部固定横幅，首次访问弹出，用户选择后记住 365 天。
 * 只有用户同意后才加载 GA / Shopify Pixel 等追踪脚本。
 */

import { useCallback, useEffect, useId, useState } from 'react';

const CONSENT_KEY = 'vionis_cookie_consent';
type ConsentValue = 'accepted' | 'declined';

export function getCookieConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
}

export default function CookieConsent() {
  const scopeId = `cc${useId().replace(/:/g, '')}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getCookieConsent();
    if (!stored) {
      // 延迟 1.5s 出现，避免干扰首次浏览
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = useCallback((choice: ConsentValue) => {
    localStorage.setItem(CONSENT_KEY, choice);
    setVisible(false);
    // 如果同意，触发自定义事件让 Analytics 脚本初始化
    if (choice === 'accepted') {
      window.dispatchEvent(new Event('cookie-consent-accepted'));
    }
  }, []);

  if (!visible) return null;

  const css = `
    #${scopeId}{
      position:fixed;bottom:0;left:0;right:0;z-index:9999;
      background:#1a1a1a;color:#e8e0d8;
      padding:16px 24px;
      display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;
      font-family:var(--font-montserrat),"Montserrat",sans-serif;
      font-size:12px;letter-spacing:0.02em;line-height:1.6;
      animation:ccSlideUp 0.4s ease;
    }
    @keyframes ccSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    #${scopeId} a{color:#C8B69E;text-decoration:underline}
    #${scopeId} .cc-btns{display:flex;gap:10px;flex-shrink:0}
    #${scopeId} .cc-btn{
      padding:8px 20px;border:none;cursor:pointer;
      font-family:inherit;font-size:10px;font-weight:500;
      letter-spacing:0.12em;text-transform:uppercase;
      transition:opacity 0.2s ease;
    }
    #${scopeId} .cc-btn:hover{opacity:0.85}
    #${scopeId} .cc-accept{background:#C8B69E;color:#1a1a1a}
    #${scopeId} .cc-decline{background:transparent;color:#999;border:1px solid #444}
  `;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <p style={{ margin: 0, flex: 1, minWidth: 240 }}>
        We use cookies to enhance your experience and analyze site traffic.
        By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.{' '}
        <a href="/pages/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </p>
      <div className="cc-btns">
        <button className="cc-btn cc-accept" onClick={() => handleChoice('accepted')}>
          Accept
        </button>
        <button className="cc-btn cc-decline" onClick={() => handleChoice('declined')}>
          Decline
        </button>
      </div>
    </div>
  );
}
