import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtected = createRouteMatcher([
  '/dashboard(.*)',
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
  if (isProtected(req)) await auth.protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
