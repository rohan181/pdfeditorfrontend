// Single source of truth for the site's canonical production origin. Every
// canonical/OG/Twitter URL in the metadata system is built from this — never
// from request headers, VERCEL_URL, or NEXT_PUBLIC_SITE_URL — so a localhost,
// preview, or staging deployment can never leak into a canonical tag.
export const PRODUCTION_ORIGIN = 'https://www.editpdfai.com'

export const SITE_NAME = 'EditPDF AI'

// Stable @id anchors for the site-wide JSON-LD entity graph (rendered once,
// site-wide, by <SiteJsonLd /> in the root layout). Other schema blocks
// (e.g. each tool page's SoftwareApplication in ToolSEOSection) reference
// these by @id instead of repeating the full Organization/WebSite object,
// so the whole site describes one consistent entity to answer engines.
export const ORGANIZATION_ID = `${PRODUCTION_ORIGIN}/#organization`
export const WEBSITE_ID = `${PRODUCTION_ORIGIN}/#website`

// Site-wide branded OG image (src/app/opengraph-image.tsx), 1200x630. Pages
// with a hand-designed social card pass their own `ogImage` to override.
export const DEFAULT_OG_IMAGE = '/opengraph-image'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

// Builds an absolute, canonical-safe URL against the verified production
// origin. Strips query strings and trailing slashes (except the root, which
// keeps its trailing slash to match the homepage's established canonical).
export function absoluteUrl(path: string): string {
  const withoutQuery = path.split('?')[0].split('#')[0]
  if (withoutQuery === '/' || withoutQuery === '') return `${PRODUCTION_ORIGIN}/`
  const trimmed = withoutQuery.replace(/\/+$/, '')
  return `${PRODUCTION_ORIGIN}${trimmed}`
}
