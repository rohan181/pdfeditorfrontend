import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'EditPDF AI — Edit smarter. Finish faster.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f0f1a 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          top: 65,
          left: 350,
        }} />

        {/* Logo mark — E+P rose gradient icon */}
        <div style={{
          width: 90,
          height: 90,
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,#f43f5e,#e11d48)',
          borderRadius: 20,
          boxShadow: '0 0 0 3px rgba(244,63,94,.3)',
        }}>
          <svg width="58" height="58" viewBox="0 0 48 48" fill="none">
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

        {/* Title */}
        <div style={{
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ color: '#ffffff' }}>EditPDF</span>
          <span style={{ color: '#818cf8', marginLeft: 18 }}>AI</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 26,
          color: 'rgba(255,255,255,0.65)',
          fontWeight: 400,
          marginBottom: 40,
          display: 'flex',
        }}>
          Edit smarter. Finish faster.
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['AI Form Fill', 'Sign PDF', 'OCR', 'Translate', 'Summarise', '35+ Tools'].map(label => (
            <div
              key={label}
              style={{
                padding: '10px 20px',
                background: 'rgba(99,102,241,0.18)',
                border: '1px solid rgba(129,140,248,0.35)',
                borderRadius: 40,
                color: '#a5b4fc',
                fontSize: 18,
                fontWeight: 500,
                display: 'flex',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          color: 'rgba(255,255,255,0.3)',
          fontSize: 18,
          display: 'flex',
        }}>
          editpdfai.com
        </div>
      </div>
    ),
    { ...size },
  )
}
