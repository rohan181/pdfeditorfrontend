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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="1 0 34 34" fill="none">
          {/* Document body */}
          <rect x="2" y="2" width="22" height="28" rx="3" fill="none" stroke="#2563EB" strokeWidth="2.5" />
          {/* Dog-ear fold */}
          <path d="M16,2 L24,10" stroke="#2563EB" strokeWidth="2" />
          {/* Pencil */}
          <path d="M28,6 L34,12 L18,28 L12,28 L12,22 Z" fill="#7C3AED" />
          {/* Red cap dot */}
          <circle cx="31" cy="9" r="2.5" fill="#F43F5E" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
