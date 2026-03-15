/**
 * 产品列表页 — 骨架屏
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

export default function CollectionLoading() {
  return (
    <div style={{ minHeight: '80vh', background: '#FAF8F4', padding: '40px 30px 80px' }}>
      <style>{SHIMMER}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
          <div style={{ ...pulseStyle, width: 200, height: 32, margin: '0 auto 12px' }} />
          <div style={{ ...pulseStyle, width: 300, height: 14, margin: '0 auto' }} />
        </div>
        {/* 产品网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 28,
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div style={{ ...pulseStyle, width: '100%', aspectRatio: '3/4', marginBottom: 14 }} />
              <div style={{ ...pulseStyle, width: '70%', height: 14, marginBottom: 8 }} />
              <div style={{ ...pulseStyle, width: '40%', height: 14 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
