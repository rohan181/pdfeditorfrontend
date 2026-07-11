import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'EditPDF AI — AI-Powered PDF Editor & Document Suite'
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

        {/* Logo mark */}
        <div style={{
          width: 80,
          height: 80,
          background: 'linear-gradient(148deg, #6366f1 0%, #818cf8 60%, #a78bfa 100%)',
          clipPath: 'polygon(0% 0%, 68% 0%, 100% 26%, 100% 100%, 0% 100%)',
          marginBottom: 28,
          borderRadius: 6,
        }} />

        {/* Title */}
        <div style={{
          fontSize: 64,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: 16,
          display: 'flex',
        }}>
          EditPDF{' '}
          <span style={{ color: '#818cf8', marginLeft: 16 }}>AI</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 26,
          color: 'rgba(255,255,255,0.65)',
          fontWeight: 400,
          marginBottom: 40,
          display: 'flex',
        }}>
          AI-Powered PDF Editor & Document Suite
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
