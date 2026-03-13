import { useId } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ServiceIconKey = 'shipping' | 'return' | 'quality' | 'contact';

export interface ServiceItem {
  icon: ServiceIconKey;
  title: string;
  subtitle?: string;
}

export interface ServiceBarProps {
  items?: ServiceItem[];
  bgColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
  headingFont?: string;
  textFont?: string;
  iconSize?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

// ─── SVG Icons (极简线条风格) ─────────────────────────────────────────────────

function IconShipping({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {/* 箱体 */}
      <path d="M20 5L34 12.5V27.5L20 35L6 27.5V12.5L20 5Z" />
      {/* 腰线 */}
      <path d="M6 12.5L20 20L34 12.5" />
      {/* 中轴线 */}
      <line x1="20" y1="20" x2="20" y2="35" />
      {/* 顶部包带 */}
      <path d="M13 8.75L27 16.25" />
    </svg>
  );
}

function IconReturn({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {/* 圆弧 */}
      <path d="M8 20C8 12.268 14.268 6 22 6C28.627 6 34 11.373 34 18" />
      {/* 回程弧 */}
      <path d="M32 34C25.373 34 20 28.627 20 22" />
      {/* 上箭头 */}
      <polyline points="14 6 8 6 8 12" />
      {/* 下箭头 */}
      <polyline points="26 34 32 34 32 28" />
    </svg>
  );
}

function IconQuality({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {/* 盾形 */}
      <path d="M20 5L7 10V20C7 27.18 12.73 33.74 20 35C27.27 33.74 33 27.18 33 20V10L20 5Z" />
      {/* 勾选 */}
      <polyline points="14 20 18 24 27 15" />
    </svg>
  );
}

function IconContact({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {/* 信封主体 */}
      <rect x="5" y="11" width="30" height="20" rx="1.5" />
      {/* 折叠线 */}
      <polyline points="5 11 20 23 35 11" />
      {/* 左侧折角线（可选装饰） */}
      <line x1="5" y1="31" x2="14" y2="22" />
      <line x1="35" y1="31" x2="26" y2="22" />
    </svg>
  );
}

const ICON_MAP: Record<ServiceIconKey, (size: number) => React.ReactElement> = {
  shipping: (s) => <IconShipping size={s} />,
  return:   (s) => <IconReturn   size={s} />,
  quality:  (s) => <IconQuality  size={s} />,
  contact:  (s) => <IconContact  size={s} />,
};

// ─── Default Items ────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: ServiceItem[] = [
  { icon: 'shipping', title: 'Free Shipping',       subtitle: 'Complimentary worldwide delivery' },
  { icon: 'return',   title: 'Free Returns',         subtitle: '30-day hassle-free returns' },
  { icon: 'quality',  title: 'Quality Guarantee',    subtitle: '100% natural fibres, certified' },
  { icon: 'contact',  title: 'Contact Us',           subtitle: 'hello@vionisxy.com' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServiceBar({
  items = DEFAULT_ITEMS,
  bgColor = '#E8DFD6',
  textColor = '#1a1a1a',
  mutedColor = '#888888',
  borderColor = 'rgba(0,0,0,0.1)',
  headingFont = '"Assistant", serif',
  textFont = '"Assistant", sans-serif',
  iconSize = 36,
  paddingTop = 44,
  paddingBottom = 44,
}: ServiceBarProps) {
  const uid = useId();
  const scopeId = `sb${uid.replace(/:/g, '')}`;

  const css = [
    // 整体 padding
    `#${scopeId}{padding-top:${paddingTop}px;padding-bottom:${paddingBottom}px}`,

    // 四列网格
    `#${scopeId} .sb-grid{`,
    `  display:grid;grid-template-columns:repeat(4,1fr);`,
    `  max-width:1200px;margin:0 auto;padding:0 48px`,
    `}`,

    // 分隔线（右侧边框，最后一项无）
    `#${scopeId} .sb-item{`,
    `  display:flex;flex-direction:column;align-items:center;text-align:center;`,
    `  padding:0 32px;`,
    `  border-right:1px solid ${borderColor}`,
    `}`,
    `#${scopeId} .sb-item:last-child{border-right:none}`,

    // 图标区
    `#${scopeId} .sb-icon{`,
    `  margin-bottom:16px;color:${textColor};opacity:0.75;`,
    `  transition:opacity 0.3s ease,transform 0.3s ease`,
    `}`,
    `#${scopeId} .sb-item:hover .sb-icon{opacity:1;transform:translateY(-2px)}`,

    // 标题
    `#${scopeId} .sb-title{`,
    `  font-family:${headingFont};font-weight:400;font-size:13px;`,
    `  color:${textColor};letter-spacing:0.1em;text-transform:uppercase;`,
    `  margin-bottom:6px;line-height:1.4`,
    `}`,

    // 副标题
    `#${scopeId} .sb-sub{`,
    `  font-family:${textFont};font-weight:400;font-size:12px;`,
    `  color:${mutedColor};line-height:1.6`,
    `}`,

    // 手机端：2列
    `@media(max-width:768px){`,
    `  #${scopeId} .sb-grid{`,
    `    grid-template-columns:repeat(2,1fr);padding:0 24px;gap:0`,
    `  }`,
    `  #${scopeId} .sb-item{`,
    `    padding:28px 16px;`,
    `    border-right:1px solid ${borderColor};`,
    `    border-bottom:1px solid ${borderColor}`,
    `  }`,
    // 手机端：右列无右边框
    `  #${scopeId} .sb-item:nth-child(2n){border-right:none}`,
    // 手机端：底部两项无下边框
    `  #${scopeId} .sb-item:nth-child(3),`,
    `  #${scopeId} .sb-item:nth-child(4){border-bottom:none}`,
    `}`,
  ].join('\n');

  return (
    <section
      id={scopeId}
      style={{ backgroundColor: bgColor }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 顶部细分隔线 */}
      <div style={{ borderTop: `1px solid ${borderColor}` }} />

      <div className="sb-grid">
        {items.map((item, idx) => (
          <div key={idx} className="sb-item">

            {/* 图标 */}
            <div className="sb-icon" aria-hidden>
              {ICON_MAP[item.icon]?.(iconSize) ?? ICON_MAP.shipping(iconSize)}
            </div>

            {/* 标题 */}
            <p className="sb-title">{item.title}</p>

            {/* 副标题 */}
            {item.subtitle && (
              <p className="sb-sub">{item.subtitle}</p>
            )}

          </div>
        ))}
      </div>

      {/* 底部细分隔线 */}
      <div style={{ borderTop: `1px solid ${borderColor}` }} />
    </section>
  );
}
