import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180, height: 180,
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #0ea5e9 100%)',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Document body */}
        <div style={{
          position: 'absolute',
          left: 38, top: 32,
          width: 72, height: 90,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: '4px 18px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 10px 16px',
          gap: 8,
        }}>
          <div style={{ width: '100%', height: 7, background: '#6366f1', borderRadius: 4, opacity: 0.6 }} />
          <div style={{ width: '75%', height: 7, background: '#6366f1', borderRadius: 4, opacity: 0.45 }} />
          <div style={{ width: '55%', height: 7, background: '#6366f1', borderRadius: 4, opacity: 0.3 }} />
        </div>
        {/* Folded corner */}
        <div style={{
          position: 'absolute',
          left: 86, top: 32,
          width: 24, height: 24,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.5) 50%, rgba(255,255,255,0.8) 50%)',
          borderRadius: '0 0 0 4px',
        }} />
        {/* AI spark */}
        <div style={{
          position: 'absolute',
          right: 28, top: 26,
          fontSize: 52,
          color: '#67e8f9',
          lineHeight: 1,
          textShadow: '0 0 20px #22d3ee',
        }}>
          ✦
        </div>
      </div>
    ),
    { ...size }
  )
}
