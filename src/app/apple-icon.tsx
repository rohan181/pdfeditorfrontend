import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180, height: 180,
          background: '#020208',
          borderRadius: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          position: 'relative',
        }}
      >
        {/* Glow behind spark */}
        <div style={{
          position: 'absolute',
          width: 90, height: 90,
          background: 'rgba(129,140,248,0.4)',
          borderRadius: '50%',
          filter: 'blur(32px)',
          top: 36,
        }} />
        {/* Spark ✦ */}
        <div style={{
          position: 'relative',
          fontSize: 68,
          color: '#a5b4fc',
          lineHeight: 1,
          fontWeight: 700,
        }}>
          ✦
        </div>
        {/* EDITPDF.AI wordmark */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 0,
          position: 'relative',
        }}>
          <span style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#f0f4ff',
            letterSpacing: '-1px',
            fontFamily: 'sans-serif',
          }}>
            EDITPDF
          </span>
          <span style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#818cf8',
            letterSpacing: '-1px',
            fontFamily: 'sans-serif',
          }}>
            .AI
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
