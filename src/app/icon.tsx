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
        }}
      >
        {/* Glow layer */}
        <div style={{
          position: 'absolute',
          width: 24, height: 24,
          background: 'rgba(99,102,241,0.45)',
          borderRadius: '50%',
          filter: 'blur(10px)',
        }} />
        {/* Pentagon abstract mark — folded-page shape */}
        <div style={{
          position: 'relative',
          width: 18, height: 22,
          background: 'linear-gradient(148deg, #6366f1 0%, #818cf8 60%, #a78bfa 100%)',
          clipPath: 'polygon(0% 0%, 68% 0%, 100% 26%, 100% 100%, 0% 100%)',
        }} />
      </div>
    ),
    { ...size }
  )
}
