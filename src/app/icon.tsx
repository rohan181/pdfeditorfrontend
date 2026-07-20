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
          background: 'white',
        }}
      >
        {/* viewBox tightly cropped to content so mark fills entire 32×32 */}
        <svg width="32" height="32" viewBox="1 1 36 32" fill="none">
          {/* Document body */}
          <rect x="2" y="2" width="24" height="30" rx="3" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
          {/* Dog-ear fold */}
          <path d="M18,2 L26,10" stroke="#3B82F6" strokeWidth="2" />
          {/* Pencil */}
          <path d="M30,4 L36,10 L20,26 L14,26 L14,20 Z" fill="#8B5CF6" />
          {/* Red cap dot */}
          <circle cx="33" cy="7" r="2.5" fill="#F43F5E" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
