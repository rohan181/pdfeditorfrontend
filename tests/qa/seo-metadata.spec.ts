// Guards the technical-SEO invariants documented in /seo-audit/editpdfai-seo-audit.md:
// every indexable route gets a unique title, a unique meta description, a
// canonical tag pointing at itself, and exactly one <h1>. Run against a
// production build: npm run build && npm run test:seo
import { test, expect } from '@playwright/test'
import guides from '../../src/lib/guidesData'
import { buildPageMetadata, type PageSeoConfig } from '../../src/lib/seo/metadata'
import { PAGE_SEO } from '../../src/lib/seo/routes'
import { PRODUCTION_ORIGIN } from '../../src/lib/seo/site'

const CONFIGURED_ROUTES: PageSeoConfig[] = Object.values(PAGE_SEO)
const STATIC_INDEXABLE_ROUTES = CONFIGURED_ROUTES
  .filter(route => route.robots?.index !== false)
  .map(route => route.path)
const GUIDE_ROUTES = guides.map(guide => `/guides/${guide.slug}`)
const ALL_ROUTES = [...STATIC_INDEXABLE_ROUTES, ...GUIDE_ROUTES]

test.describe('SEO metadata regression', () => {
  const seenTitles = new Map<string, string>()
  const seenDescriptions = new Map<string, string>()

  for (const route of ALL_ROUTES) {
    test(`${route} has valid, unique, self-referencing metadata`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status(), `${route} should return 200`).toBe(200)

      // Title: present, non-empty, unique across the whole route set.
      const title = await page.title()
      expect(title.length, `${route} title should be non-empty`).toBeGreaterThan(0)
      expect(title.length, `${route} title should be under ~65 chars`).toBeLessThanOrEqual(70)
      const dupeTitleRoute = seenTitles.get(title)
      expect(dupeTitleRoute, `${route} title duplicates ${dupeTitleRoute}`).toBeUndefined()
      seenTitles.set(title, route)

      // Meta description: present, non-empty, reasonable length, unique.
      const description = await page.locator('meta[name="description"]').getAttribute('content')
      expect(description, `${route} should have a meta description`).toBeTruthy()
      if (description) {
        expect(description.length, `${route} description should be useful`).toBeGreaterThanOrEqual(130)
        expect(description.length, `${route} description should be under ~160 chars`).toBeLessThanOrEqual(165)
        const dupeDescRoute = seenDescriptions.get(description)
        expect(dupeDescRoute, `${route} description duplicates ${dupeDescRoute}`).toBeUndefined()
        seenDescriptions.set(description, route)
      }

      // Canonical: present and points at this exact route on the verified
      // production origin — never localhost/preview/staging.
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical, `${route} should have a canonical link`).toBeTruthy()
      if (canonical) {
        expect(canonical.startsWith(PRODUCTION_ORIGIN), `${route} canonical must use the production origin, got ${canonical}`).toBe(true)
        const expectedPath = route === '/' ? '/' : route
        const canonicalPath = canonical.replace(PRODUCTION_ORIGIN, '') || '/'
        expect(canonicalPath, `${route} canonical path should match its own route`).toBe(expectedPath)
        expect(canonical).not.toContain('?')
        expect(canonical).not.toContain('#')
      }

      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
      expect(ogUrl, `${route} should have an Open Graph URL`).toBe(canonical)

      const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content')
      expect(ogImage, `${route} should have an Open Graph image`).toMatch(/^https:\/\/www\.editpdfai\.com\//)

      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
      expect(twitterCard, `${route} should have Twitter Card metadata`).toBe('summary_large_image')

      // No meta keywords tag anywhere (Google hasn't used it since 2009).
      const keywordsCount = await page.locator('meta[name="keywords"]').count()
      expect(keywordsCount, `${route} should not render a meta keywords tag`).toBe(0)

      // Exactly one H1.
      const h1Count = await page.locator('h1').count()
      expect(h1Count, `${route} should have exactly one <h1>, found ${h1Count}`).toBe(1)
    })
  }

  test('private routes use noindex, follow and omit canonicals', () => {
    const privateRoutes = CONFIGURED_ROUTES.filter(route => route.robots?.index === false)
    expect(privateRoutes).toHaveLength(7)

    for (const route of privateRoutes) {
      const metadata = buildPageMetadata(route)
      expect(metadata.robots).toMatchObject({ index: false, follow: true })
      expect(metadata.alternates).toBeUndefined()
    }
  })

  test('query parameters never enter generated canonical URLs', () => {
    const metadata = buildPageMetadata({
      path: '/pdf-editor?utm_source=test#editor',
      title: 'Canonical safety test',
      description: 'A test description used only to verify canonical URL normalization in the centralized EditPDF AI metadata builder.',
    })

    expect(metadata.alternates?.canonical).toBe(`${PRODUCTION_ORIGIN}/pdf-editor`)
    expect(metadata.openGraph?.url).toBe(`${PRODUCTION_ORIGIN}/pdf-editor`)
  })
})
