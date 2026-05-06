import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32, height: 32,
          background: '#000',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {/* EDIT — thin */}
        <span style={{
          fontFamily: 'sans-serif',
          fontSize: 8,
          fontWeight: 400,
          color: 'rgba(240,244,255,.45)',
          letterSpacing: '0.02em',
          lineHeight: 1,
        }}>
          EDIT
        </span>
        {/* PDF — bold */}
        <span style={{
          fontFamily: 'sans-serif',
          fontSize: 8,
          fontWeight: 900,
          color: '#f0f4ff',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          PDF
        </span>
        {/* .AI badge */}
        <span style={{
          fontFamily: 'monospace',
          fontSize: 5.5,
          fontWeight: 700,
          color: '#fff',
          background: '#6366f1',
          padding: '1px 3px',
          borderRadius: 2,
          marginLeft: 2,
          lineHeight: 1.4,
        }}>
          .AI
        </span>
      </div>
    ),
    { ...size }
  )
}
