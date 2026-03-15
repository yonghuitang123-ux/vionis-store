export default function ProductLoading() {
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
