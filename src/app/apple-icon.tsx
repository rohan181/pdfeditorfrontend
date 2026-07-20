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
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="64" height="64" viewBox="0 0 44 44" fill="none">
            {/* Document body */}
            <rect x="2" y="2" width="24" height="30" rx="3" fill="none" stroke="white" strokeWidth="2.5" />
            {/* Dog-ear fold */}
            <path d="M18,2 L26,10" stroke="white" strokeWidth="2" />
            {/* Text lines */}
            <line x1="6" y1="14" x2="13" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="20" x2="20" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="26" x2="16" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
            {/* Pencil */}
            <path d="M30,4 L36,10 L20,26 L14,26 L14,20 Z" fill="white" />
            {/* Red cap dot */}
            <circle cx="33" cy="7" r="2.5" fill="#F43F5E" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            EditPDF
          </span>
          <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 800, color: '#3B82F6', marginLeft: 4, letterSpacing: '-0.5px' }}>
            AI
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
