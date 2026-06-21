import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  // 301 every www.* request to the non-www equivalent.
  // This runs at the Edge before any page is rendered, so no www content
  // ever reaches the client and link equity consolidates on editpdfai.com.
  if (host.toLowerCase().startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host  = host.slice(4)          // strip "www."
    url.port  = ''                     // drop explicit port if any
    return NextResponse.redirect(url, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  // Skip Next.js internals and static assets — no need to evaluate them.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
