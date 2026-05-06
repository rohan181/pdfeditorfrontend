import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180, height: 180,
          background: '#000',
          borderRadius: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: 100, height: 100,
          background: 'rgba(99,102,241,0.38)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          top: 32,
        }} />

        {/* Pentagon abstract mark */}
        <div style={{
          position: 'relative',
          width: 72, height: 88,
          background: 'linear-gradient(148deg, #6366f1 0%, #818cf8 60%, #a78bfa 100%)',
          clipPath: 'polygon(0% 0%, 68% 0%, 100% 26%, 100% 100%, 0% 100%)',
        }} />

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 22,
            fontWeight: 300, color: 'rgba(240,244,255,.42)',
            letterSpacing: '2px',
          }}>EDIT</span>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 22,
            fontWeight: 900, color: '#f0f4ff',
            letterSpacing: '-1px',
          }}>PDF</span>
          <span style={{
            fontFamily: 'monospace', fontSize: 11,
            fontWeight: 700, color: '#fff',
            background: '#6366f1',
            padding: '3px 8px', borderRadius: 5,
            marginLeft: 6, letterSpacing: '1px',
          }}>.AI</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
