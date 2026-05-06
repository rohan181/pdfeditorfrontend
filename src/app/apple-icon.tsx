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
          gap: 0,
        }}
      >
        {/* Wordmark row 1: EDIT PDF */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, marginBottom: 6 }}>
          <span style={{
            fontFamily: 'sans-serif',
            fontSize: 38,
            fontWeight: 300,
            color: 'rgba(240,244,255,.42)',
            letterSpacing: '2px',
            lineHeight: 1,
          }}>
            EDIT
          </span>
          <span style={{
            fontFamily: 'sans-serif',
            fontSize: 38,
            fontWeight: 900,
            color: '#f0f4ff',
            letterSpacing: '-1.5px',
            lineHeight: 1,
          }}>
            PDF
          </span>
        </div>
        {/* .AI badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
          borderRadius: 10,
          padding: '5px 18px',
        }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '3px',
          }}>
            .AI
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
