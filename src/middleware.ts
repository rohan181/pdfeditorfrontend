import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PRODUCTION_ORIGIN } from '@/lib/seo/site'

const CANONICAL_HOSTNAME = new URL(PRODUCTION_ORIGIN).hostname
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]'])

/**
 * Normalize every public production request in one hop. Local development is
 * exempt so Playwright and developer servers remain accessible over HTTP.
 */
function getCanonicalRedirect(req: NextRequest) {
  const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const requestedHost = forwardedHost || req.headers.get('host') || req.nextUrl.host
  const requestedHostname = requestedHost.replace(/:\d+$/, '').toLowerCase()

  if (!requestedHostname || LOCAL_HOSTNAMES.has(requestedHostname)) return null

  const forwardedProtocol = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const requestedProtocol = (forwardedProtocol || req.nextUrl.protocol).replace(/:$/, '')
  const currentPath = req.nextUrl.pathname
  const canonicalPath = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '') || '/'

  const isCanonical =
    requestedHostname === CANONICAL_HOSTNAME &&
    requestedProtocol === 'https' &&
    currentPath === canonicalPath

  if (isCanonical) return null

  const destination = new URL(canonicalPath, `${PRODUCTION_ORIGIN}/`)
  destination.search = req.nextUrl.search

  return NextResponse.redirect(destination, 308)
}

// Pages that require a signed-in session (redirect to sign-in if not authed)
const isProtectedPage = createRouteMatcher([
  '/dashboard(.*)',
  '/checkout',
  '/cancel(.*)',
  '/manage-subscription(.*)',
])

// API routes that require auth — return 401 JSON instead of redirecting
const isProtectedApi = createRouteMatcher([
  '/api/autofill(.*)',
  '/api/chat-fill(.*)',
  '/api/summarize(.*)',
  '/api/translate-pdf(.*)',
  '/api/ocr(.*)',
  '/api/mind-map(.*)',
  '/api/node-summary(.*)',
  '/api/extract-doc(.*)',
  '/api/improvise(.*)',
  '/api/form-builder-ai(.*)',
  '/api/scan-detect(.*)',
  '/api/pdf-to-excel(.*)',
  '/api/pdf-to-word(.*)',
  '/api/pdf-to-ppt(.*)',
  '/api/quiz-gen(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const canonicalRedirect = getCanonicalRedirect(req)
  if (canonicalRedirect) return canonicalRedirect

  if (isProtectedPage(req)) {
    // APIRequestContext and some link checkers do not send a browser-style
    // Accept header. Clerk intentionally answers those signed-out requests
    // with a 404 unless an unauthenticated destination is explicit. Keep the
    // route protected while making every signed-out entry path converge on
    // the real sign-in page instead of looking like a broken internal link.
    await auth.protect({
      unauthenticatedUrl: new URL('/sign-in', req.url).toString(),
    })
    return
  }
  if (isProtectedApi(req)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Sign in to use AI features' },
        { status: 401 },
      )
    }
  }
})

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/robots.txt',
    '/sitemap.xml',
  ],
}
