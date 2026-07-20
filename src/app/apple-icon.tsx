import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
            <path
              d="M0 0H38C44 0 48 6 48 13.5C48 21 44 27 38 27H10M10 27V48H0V0M10 27H32"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="38" cy="27" r="6" fill="white" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            EditPDF
          </span>
          <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 800, color: '#dc2626', marginLeft: 3, letterSpacing: '-0.5px' }}>
            AI
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
