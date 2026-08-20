import type { MetadataRoute } from 'next'
import { PRODUCTION_ORIGIN } from '@/lib/seo/site'

// Private HTML routes are intentionally not blocked here: they emit
// `noindex, follow`, and crawlers must be able to fetch that directive.
// Non-page API/RPC surfaces are blocked because they have no search value.
const NON_PAGE_SURFACES = ['/api/', '/trpc/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: NON_PAGE_SURFACES,
    },
    sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
  }
}
