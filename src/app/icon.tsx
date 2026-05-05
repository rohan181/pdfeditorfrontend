import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #0ea5e9 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Document body */}
        <div style={{
          position: 'absolute',
          left: 7, top: 6,
          width: 12, height: 15,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: '1px 3px 2px 2px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 2px 3px',
          gap: 2,
        }}>
          <div style={{ width: '100%', height: 1.5, background: '#6366f1', borderRadius: 1, opacity: 0.6 }} />
          <div style={{ width: '75%', height: 1.5, background: '#6366f1', borderRadius: 1, opacity: 0.5 }} />
        </div>
        {/* Folded corner */}
        <div style={{
          position: 'absolute',
          left: 15, top: 6,
          width: 4, height: 4,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 50%, rgba(255,255,255,0.7) 50%)',
          borderRadius: '0 0 0 1px',
        }} />
        {/* AI spark — 4-point star */}
        <div style={{
          position: 'absolute',
          right: 5, top: 5,
          fontSize: 11,
          color: '#67e8f9',
          lineHeight: 1,
        }}>
          ✦
        </div>
      </div>
    ),
    { ...size }
  )
}
