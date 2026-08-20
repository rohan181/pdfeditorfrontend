import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  // Middleware owns scheme, host and path normalization so combinations such
  // as http + non-www + trailing slash resolve in one canonical redirect.
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  // Content-Security-Policy is intentionally not set here: this app loads
  // scripts from Clerk, Stripe, PostHog, Google Analytics, Cloudflare Web
  // Analytics, and cdnjs (pdf.js worker, html2canvas, jsPDF), so a CSP needs
  // to be built and tested against the real production domain before it ships
  // — an incorrect one silently breaks checkout/sign-in/PDF conversion instead
  // of failing loudly. See the QA report for the recommended next step.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ]
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
}

export default withBundleAnalyzer(nextConfig)
