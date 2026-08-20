import type { MetadataRoute } from 'next'
import guides from '@/lib/guidesData'
import { INDEXABLE_PAGE_SEO } from '@/lib/seo/routes'
import { absoluteUrl } from '@/lib/seo/site'

/**
 * Only canonical, indexable page URLs belong in the sitemap. Static routes do
 * not emit lastModified because the project has no durable per-page content
 * revision source. Guide dates are also omitted unless a guide record contains
 * a confirmed editorial modification date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = INDEXABLE_PAGE_SEO.map(page => ({
    url: absoluteUrl(page.canonicalPath ?? page.path),
  }))

  const guidePages: MetadataRoute.Sitemap = guides.map(guide => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    ...(guide.dateModified ? { lastModified: guide.dateModified } : {}),
  }))

  return [...staticPages, ...guidePages]
}
