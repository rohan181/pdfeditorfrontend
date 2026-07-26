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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="180" height="180" viewBox="0 0 512 512" fill="none">
          <defs>
            <linearGradient id="brand" x1="96" y1="72" x2="416" y2="440" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="112" fill="#FFFFFF" />
          <path d="M122 76h176l92 92v250c0 20-16 36-36 36H122c-20 0-36-16-36-36V112c0-20 16-36 36-36Z" fill="none" stroke="url(#brand)" strokeWidth="28" strokeLinejoin="round" />
          <path d="M298 76v92h92" fill="none" stroke="url(#brand)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m142 370 34-74L344 128l50 50-168 168-84 24Z" fill="url(#brand)" />
          <path d="m176 296 50 50" fill="none" stroke="#FFFFFF" strokeWidth="16" />
          <circle cx="370" cy="152" r="13" fill="#F43F5E" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
