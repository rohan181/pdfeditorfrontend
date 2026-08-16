// Guards the technical-SEO invariants documented in /seo-audit/editpdfai-seo-audit.md:
// every indexable route gets a unique title, a unique meta description, a
// canonical tag pointing at itself, and exactly one <h1>. Run against a
// local/staging server: PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/qa/seo-metadata.spec.ts
import { test, expect } from '@playwright/test'
import { TOOL_METADATA } from '../../src/lib/seo/routes'
import { PRODUCTION_ORIGIN } from '../../src/lib/seo/site'

// Indexable routes not present in TOOL_METADATA (either not yet migrated to
// the centralized generator, or a dynamic route audited separately).
const EXTRA_INDEXABLE_ROUTES = [
  '/',
  '/pricing',
  '/privacy',
  '/terms',
  '/support',
  '/contact',
]

const ALL_ROUTES = Array.from(
  new Set([...Object.values(TOOL_METADATA).map(r => r.path), ...EXTRA_INDEXABLE_ROUTES]),
)

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
      }

      // No meta keywords tag anywhere (Google hasn't used it since 2009).
      const keywordsCount = await page.locator('meta[name="keywords"]').count()
      expect(keywordsCount, `${route} should not render a meta keywords tag`).toBe(0)

      // Exactly one H1.
      const h1Count = await page.locator('h1').count()
      expect(h1Count, `${route} should have exactly one <h1>, found ${h1Count}`).toBe(1)
    })
  }
})
