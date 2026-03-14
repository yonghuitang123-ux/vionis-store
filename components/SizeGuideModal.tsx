'use client';

/**
 * SizeGuideModal
 * ─────────────────────────────────────────────────────────────────
 * 尺寸指南弹窗 — 读取 siteConfig.sizeGuide 中的数据，
 * 以表格形式展示各尺码对应的身体尺寸（胸围、腰围、臀围）。
 *
 * 特性：
 *   · 居中弹窗 + 半透明遮罩
 *   · 淡入动画（opacity + translateY）
 *   · 表格使用细边框，干净清爽
 *   · 底部附穿衣建议提示
 *   · 点击遮罩或关闭按钮均可关闭
 *   · ESC 键关闭
 */

import { useEffect, type CSSProperties } from 'react';
import { siteConfig } from '@/config/site';

// ─── 类型 ────────────────────────────────────────────────────────────────────

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── 样式常量 ────────────────────────────────────────────────────────────────

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  padding: 20,
};

const panelStyle: CSSProperties = {
  position: 'relative',
  backgroundColor: '#fff',
  maxWidth: 560,
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: '40px 36px 36px',
};

const closeBtnStyle: CSSProperties = {
  position: 'absolute',
  top: 14,
  right: 14,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 6,
  lineHeight: 1,
  fontSize: 20,
  color: '#1a1a1a',
};

const headingStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 26,
  fontWeight: 400,
  color: '#1a1a1a',
  margin: '0 0 6px',
  textAlign: 'center',
};

const unitStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 400,
  color: '#888',
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 24px',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  color: '#1a1a1a',
};

const thStyle: CSSProperties = {
  padding: '10px 12px',
  fontWeight: 500,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid rgba(0,0,0,0.15)',
  textAlign: 'center',
};

const thFirstStyle: CSSProperties = {
  ...thStyle,
  textAlign: 'left',
};

const tdStyle: CSSProperties = {
  padding: '10px 12px',
  textAlign: 'center',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
};

const tdFirstStyle: CSSProperties = {
  ...tdStyle,
  textAlign: 'left',
  fontWeight: 500,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: '#666',
};

const tipsStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  lineHeight: 1.7,
  color: '#888',
  marginTop: 24,
  paddingTop: 16,
  borderTop: '1px solid rgba(0,0,0,0.06)',
};

// ─── 测量行标签映射（中文 key → 英文显示名） ────────────────────────────────

const measurementLabels: Record<string, string> = {
  胸围: 'Bust',
  腰围: 'Waist',
  臀围: 'Hip',
};

// ─── 组件 ────────────────────────────────────────────────────────────────────

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const { 单位: unit, 尺码表: sizeTable } = siteConfig.sizeGuide;
  const sizes = Object.keys(sizeTable) as (keyof typeof sizeTable)[];

  // 取第一个尺码的 key 作为测量维度列表
  const measurementKeys = sizes.length > 0 ? Object.keys(sizeTable[sizes[0]]) : [];

  // ESC 键关闭
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // 阻止滚动穿透
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={backdropStyle}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Size Guide"
    >
      {/* 弹窗面板 — 淡入动画通过 CSS animation 实现 */}
      <div
        style={{
          ...panelStyle,
          animation: 'sizeGuideIn 0.3s ease forwards',
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={closeBtnStyle}
          aria-label="Close size guide"
        >
          ✕
        </button>

        {/* 标题 */}
        <h2 style={headingStyle}>Size Guide</h2>
        <p style={unitStyle}>Measurements in {unit}</p>

        {/* 尺码表格 */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thFirstStyle}>{/* 空白角 */}</th>
              {sizes.map((size) => (
                <th key={size} style={thStyle}>{size}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {measurementKeys.map((key) => (
              <tr key={key}>
                <td style={tdFirstStyle}>{measurementLabels[key] ?? key}</td>
                {sizes.map((size) => (
                  <td key={size} style={tdStyle}>
                    {(sizeTable[size] as Record<string, string>)[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 穿衣建议 */}
        <div style={tipsStyle}>
          <strong style={{ fontWeight: 500, color: '#1a1a1a' }}>Measuring Tips</strong>
          <br />
          • Bust — Measure around the fullest part of your chest.
          <br />
          • Waist — Measure around the narrowest part of your natural waistline.
          <br />
          • Hip — Measure around the widest part of your hips.
          <br />
          • If you are between sizes, we recommend sizing up for a relaxed fit.
        </div>
      </div>

      {/* 淡入动画关键帧 — 通过内联 style 标签注入 */}
      <style>{`
        @keyframes sizeGuideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
