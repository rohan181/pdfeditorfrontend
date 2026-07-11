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
        {/* Document icon — gradient fill, folded top-right */}
        <div
          style={{
            position: 'relative',
            width: 88,
            height: 106,
            background: 'linear-gradient(135deg, #4F7FFA 0%, #8B3FEC 100%)',
            clipPath: 'polygon(0% 0%, 63% 0%, 100% 27%, 100% 100%, 0% 100%)',
            borderRadius: 6,
            display: 'flex',
          }}
        >
          {/* Fold triangle */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 33,
              height: 29,
              background: 'rgba(255,255,255,0.25)',
              clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
            }}
          />
          {/* Diagonal edit stroke */}
          <div
            style={{
              position: 'absolute',
              bottom: 28,
              left: 16,
              width: 46,
              height: 8,
              background: 'rgba(255,255,255,0.9)',
              transform: 'rotate(-42deg)',
              transformOrigin: 'left center',
              borderRadius: 4,
            }}
          />
          {/* Pen dot */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 10,
              width: 11,
              height: 11,
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{
            fontFamily: 'sans-serif',
            fontSize: 22,
            fontWeight: 800,
            color: '#0D1B4B',
            letterSpacing: '-0.5px',
          }}>EditPDF</span>
          <span style={{
            fontFamily: 'sans-serif',
            fontSize: 22,
            fontWeight: 800,
            color: '#6B4FEC',
            marginLeft: 3,
            letterSpacing: '-0.5px',
          }}>AI</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
