import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Document body — gradient fill, folded top-right corner */}
        <div
          style={{
            position: 'relative',
            width: 22,
            height: 38,
            background: 'linear-gradient(135deg, #4F7FFA 0%, #8B3FEC 100%)',
            clipPath: 'polygon(0% 0%, 62% 0%, 100% 27%, 100% 100%, 0% 100%)',
            borderRadius: 2,
            display: 'flex',
          }}
        >
          {/* Fold triangle highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 8,
              height: 7,
              background: 'rgba(255,255,255,0.28)',
              clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
            }}
          />
          {/* Diagonal edit stroke */}
          <div
            style={{
              position: 'absolute',
              bottom: 7,
              left: 4,
              width: 11,
              height: 2.2,
              background: 'rgba(255,255,255,0.9)',
              transform: 'rotate(-42deg)',
              transformOrigin: 'left center',
              borderRadius: 2,
            }}
          />
          {/* Pen dot */}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: 2,
              width: 3,
              height: 3,
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
