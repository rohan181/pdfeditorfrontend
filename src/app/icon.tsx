import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32, height: 32,
          background: '#020208',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Glow behind spark */}
        <div style={{
          position: 'absolute',
          width: 22, height: 22,
          background: 'rgba(129,140,248,0.55)',
          borderRadius: '50%',
          filter: 'blur(8px)',
        }} />
        {/* Spark ✦ */}
        <div style={{
          position: 'relative',
          fontSize: 18,
          color: '#a5b4fc',
          lineHeight: 1,
          fontWeight: 700,
        }}>
          ✦
        </div>
      </div>
    ),
    { ...size }
  )
}
