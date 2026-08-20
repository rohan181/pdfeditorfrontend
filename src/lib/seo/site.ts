// Single source of truth for the site's canonical production origin. Every
// canonical/OG/Twitter URL in the metadata system is built from this — never
// from request headers, VERCEL_URL, or NEXT_PUBLIC_SITE_URL — so a localhost,
// preview, or staging deployment can never leak into a canonical tag.
export const PRODUCTION_ORIGIN = 'https://www.editpdfai.com'

export const SITE_NAME = 'EditPDF AI'

// Stable @id anchors connect the site-wide Organization, homepage WebSite,
// page, article, and application entities without duplicating those entities.
export const ORGANIZATION_ID = `${PRODUCTION_ORIGIN}/#organization`
export const WEBSITE_ID = `${PRODUCTION_ORIGIN}/#website`

// Site-wide branded OG image (src/app/opengraph-image.tsx), 1200x630. Pages
// with a hand-designed social card pass their own `ogImage` to override.
export const DEFAULT_OG_IMAGE = `${PRODUCTION_ORIGIN}/opengraph-image`
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

// Builds an absolute, canonical-safe URL against the verified production
// origin. Strips query strings and trailing slashes. The root is represented
// by the bare origin because Next.js renders the homepage canonical that way
// when `trailingSlash` is disabled.
export function absoluteUrl(pathOrUrl: string): string {
  let path = pathOrUrl.trim()

  if (/^https?:\/\//i.test(path)) {
    const parsed = new URL(path)
    path = parsed.pathname
  }

  const withoutQuery = path.split('?')[0].split('#')[0]
  if (withoutQuery === '/' || withoutQuery === '') return PRODUCTION_ORIGIN

  const withLeadingSlash = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
  const normalized = withLeadingSlash.replace(/\/{2,}/g, '/').replace(/\/+$/, '')
  return `${PRODUCTION_ORIGIN}${normalized}`
}
