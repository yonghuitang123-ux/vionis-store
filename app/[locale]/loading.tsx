/**
 * 全局 loading 骨架屏
 * ─────────────────────────────────────────────────────────────────
 * 页面切换时显示品牌化 shimmer 动画
 */

const SHIMMER = `
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        background: '#FAF8F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column' as const,
        gap: 16,
      }}
    >
      <style>{SHIMMER}</style>
      <div
        style={{
          width: 36,
          height: 36,
          border: '2px solid rgba(0,0,0,0.06)',
          borderTopColor: '#C8B69E',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
