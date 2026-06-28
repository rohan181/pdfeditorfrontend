import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Pages that require a signed-in session (redirect to sign-in if not authed)
const isProtectedPage = createRouteMatcher([
  '/dashboard(.*)',
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
  '/api/test-ai(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedPage(req)) {
    await auth.protect()
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
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
