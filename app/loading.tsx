/**
 * 全局 loading 骨架屏
 * ─────────────────────────────────────────────────────────────────
 * 页面切换时显示，保持品牌风格 #E8DFD6
 */

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        background: '#E8DFD6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: '2px solid rgba(0,0,0,0.08)',
          borderTopColor: '#A05E46',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
