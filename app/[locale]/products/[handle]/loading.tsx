/**
 * 产品详情页 — 骨架屏
 */

const SHIMMER = `
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;
const pulseStyle = {
  background: 'linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%)',
  backgroundSize: '800px 100%',
  animation: 'shimmer 1.6s ease infinite',
  borderRadius: 2,
};

export default function ProductLoading() {
  return (
    <div style={{ minHeight: '80vh', background: '#FAF8F4', padding: '40px 20px' }}>
      <style>{SHIMMER}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 48, flexWrap: 'wrap' as const }}>
        {/* 左侧图片区 */}
        <div style={{ flex: '1 1 560px' }}>
          <div style={{ ...pulseStyle, width: '100%', aspectRatio: '4/5' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...pulseStyle, width: 72, height: 72 }} />
            ))}
          </div>
        </div>
        {/* 右侧信息区 */}
        <div style={{ flex: '1 1 400px', paddingTop: 8 }}>
          <div style={{ ...pulseStyle, width: 120, height: 12, marginBottom: 16 }} />
          <div style={{ ...pulseStyle, width: '80%', height: 28, marginBottom: 12 }} />
          <div style={{ ...pulseStyle, width: '50%', height: 28, marginBottom: 24 }} />
          <div style={{ ...pulseStyle, width: 100, height: 20, marginBottom: 32 }} />
          {/* Color swatches */}
          <div style={{ ...pulseStyle, width: 60, height: 10, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...pulseStyle, width: 44, height: 44, borderRadius: '50%' }} />
            ))}
          </div>
          {/* Size buttons */}
          <div style={{ ...pulseStyle, width: 40, height: 10, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
            {['S', 'M', 'L', 'XL'].map((s) => (
              <div key={s} style={{ ...pulseStyle, width: 52, height: 44 }} />
            ))}
          </div>
          {/* Buttons */}
          <div style={{ ...pulseStyle, width: '100%', height: 50, marginBottom: 12 }} />
          <div style={{ ...pulseStyle, width: '100%', height: 50 }} />
        </div>
      </div>
    </div>
  );
}
