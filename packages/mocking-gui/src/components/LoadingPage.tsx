const LoadingPage = () => {
  return (
    <div style={containerStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={spinnerStyle} />
      <div style={textWrapStyle}>
        <p style={titleStyle}>Preparing Service Worker...</p>
        <p style={descStyle}>
          Please ensure MSW is initialized before running.
          <br />
          Check browser console for details.
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;

const containerStyle = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
} as const;

const spinnerStyle = {
  width: 48,
  height: 48,
  borderWidth: 3,
  borderStyle: 'solid',
  borderColor: '#e5e7eb',
  borderTopColor: '#1f2937',
  borderRadius: 9999,
  marginBottom: 16,
  animation: 'spin 0.8s linear infinite',
} as const;

const textWrapStyle = { textAlign: 'center' } as const;
const titleStyle = { color: '#4b5563', fontWeight: 600 } as const;
const descStyle = { color: '#9ca3af', fontSize: 12, marginTop: 8, lineHeight: 1.4 } as const;
