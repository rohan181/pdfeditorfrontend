import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import guides from '../../src/lib/guidesData'
import { INDEXABLE_PAGE_SEO, NOINDEX_PAGE_SEO } from '../../src/lib/seo/routes'
import { PRODUCTION_ORIGIN } from '../../src/lib/seo/site'
import toolMeta from '../../src/lib/toolMeta'

const INDEXABLE_ROUTES = [
  ...INDEXABLE_PAGE_SEO.map(route => route.path),
  ...guides.map(guide => `/guides/${guide.slug}`),
]
const TOOL_ROUTES = new Set(toolMeta.map(tool => `/${tool.slug}`))
const GUIDE_ROUTES = new Set(guides.map(guide => `/guides/${guide.slug}`))
const FORBIDDEN_SCHEMA_TYPES = new Set(['AggregateRating', 'Offer', 'Person', 'Rating', 'Review'])
const UNSUPPORTED_CLAIMS = /\b(?:35\+|50\+|all (?:PDF )?tools (?:are )?free|free forever|no limits|no upload|never uploaded|fully editable|pixel-perfect|any PDF|AI does not invent facts|five free uses|unlimited AI|permanent redaction|permanently redact)\b/i
const GENERIC_LINK_TEXT = /^(?:click here|here|learn more|read more|go)$/i
const CANONICAL_HEADERS = {
  host: 'www.editpdfai.com',
  'x-forwarded-host': 'www.editpdfai.com',
  'x-forwarded-proto': 'https',
}

type JsonObject = { [key: string]: unknown }

function htmlAttribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1]
}

function textFromServerHtml(html: string) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|#39|lt|gt);/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function objectsIn(value: unknown): JsonObject[] {
  if (!value || typeof value !== 'object') return []
  if (Array.isArray(value)) return value.flatMap(objectsIn)
  const object = value as JsonObject
  return [object, ...Object.values(object).flatMap(objectsIn)]
}

function typesIn(value: unknown) {
  return objectsIn(value).flatMap(object => {
    const type = object['@type']
    return Array.isArray(type)
      ? type.filter((item): item is string => typeof item === 'string')
      : typeof type === 'string' ? [type] : []
  })
}

async function structuredData(page: Page) {
  const source = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(source.length, 'at least one JSON-LD document should be rendered').toBeGreaterThan(0)
  return source.map((json, index) => {
    expect(() => JSON.parse(json), `JSON-LD document ${index + 1} must be valid JSON`).not.toThrow()
    return JSON.parse(json) as JsonObject
  })
}

function expectedSchemaTypes(route: string) {
  if (route === '/') return ['Organization', 'WebSite', 'WebPage', 'WebApplication']
  if (TOOL_ROUTES.has(route)) return ['Organization', 'WebPage', 'WebApplication', 'BreadcrumbList']
  if (GUIDE_ROUTES.has(route)) return ['Organization', 'WebPage', 'Article', 'BreadcrumbList']
  if (route === '/guides') return ['Organization', 'CollectionPage', 'ItemList', 'BreadcrumbList']
  if (route === '/about') return ['Organization', 'AboutPage']
  if (route === '/contact') return ['Organization', 'ContactPage']
  if (route === '/pricing') return ['Organization', 'WebPage', 'FAQPage']
  return ['Organization']
}

function internalPath(href: string) {
  const decoded = href.replace(/&amp;/g, '&')
  if (!decoded || decoded.startsWith('#') || decoded.startsWith('mailto:') || decoded.startsWith('tel:')) return null
  try {
    const url = new URL(decoded, PRODUCTION_ORIGIN)
    if (url.origin !== PRODUCTION_ORIGIN) return null
    if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) return null
    if (/\.(?:avif|css|gif|ico|jpe?g|js|json|pdf|png|svg|webp|xml)$/i.test(url.pathname)) return null
    return url.pathname || '/'
  } catch {
    return null
  }
}

async function expectReachable(request: APIRequestContext, pathname: string) {
  const response = await request.get(pathname, {
    headers: CANONICAL_HEADERS,
    maxRedirects: 5,
  })
  expect(response.status(), `internal destination ${pathname} should not be broken`).toBeLessThan(400)
}

test.describe('final production SEO and AEO validation', () => {
  for (const route of INDEXABLE_ROUTES) {
    test(`${route} has complete social metadata and valid route-appropriate schema`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), `${route} should return 200`).toBe(200)

      const canonical = route === '/' ? PRODUCTION_ORIGIN : `${PRODUCTION_ORIGIN}${route}`
      const socialFields = [
        ['meta[property="og:title"]', 'content'],
        ['meta[property="og:description"]', 'content'],
        ['meta[property="og:url"]', 'content'],
        ['meta[property="og:image"]', 'content'],
        ['meta[name="twitter:card"]', 'content'],
        ['meta[name="twitter:title"]', 'content'],
        ['meta[name="twitter:description"]', 'content'],
        ['meta[name="twitter:image"]', 'content'],
      ] as const

      for (const [selector, attribute] of socialFields) {
        await expect(page.locator(selector).first(), `${route} should render ${selector}`).toHaveAttribute(attribute, /.+/)
      }
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical)
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute('content', /^https:\/\//)
      await expect(page.locator('meta[name="twitter:image"]').first()).toHaveAttribute('content', /^https:\/\//)

      const documents = await structuredData(page)
      const schemaTypes = new Set(documents.flatMap(typesIn))
      for (const expectedType of expectedSchemaTypes(route)) {
        expect(schemaTypes.has(expectedType), `${route} should include ${expectedType} schema`).toBe(true)
      }
      for (const forbiddenType of Array.from(FORBIDDEN_SCHEMA_TYPES)) {
        expect(schemaTypes.has(forbiddenType), `${route} must not include fabricated ${forbiddenType} schema`).toBe(false)
      }
      for (const object of documents.flatMap(objectsIn)) {
        expect(object, `${route} must not include unsupported rating, review, offer, award or founding claims`).not.toMatchObject({
          aggregateRating: expect.anything(),
        })
        expect(object).not.toHaveProperty('review')
        expect(object).not.toHaveProperty('offers')
        expect(object).not.toHaveProperty('award')
        expect(object).not.toHaveProperty('foundingDate')
      }
    })
  }

  test('every indexable route has meaningful server-rendered content and descriptive links', async ({ request }) => {
    test.setTimeout(180_000)
    for (const route of INDEXABLE_ROUTES) {
      const response = await request.get(route, { headers: CANONICAL_HEADERS, maxRedirects: 0 })
      expect(response.status(), route).toBe(200)
      const html = await response.text()
      const renderedText = textFromServerHtml(html)
      const words = renderedText.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) ?? []
      expect(words.length, `${route} should render meaningful HTML before hydration`).toBeGreaterThanOrEqual(75)
      expect((html.match(/<h1\b/gi) ?? []).length, `${route} should server-render one H1`).toBe(1)
      expect(renderedText, `${route} should not contain a known unsupported absolute claim`).not.toMatch(UNSUPPORTED_CLAIMS)

      const links = Array.from(html.matchAll(/<a\b[^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi))
      const internalLinks = links.filter(match => internalPath(htmlAttribute(match[0], 'href') ?? '') !== null)
      expect(internalLinks.length, `${route} should contain useful internal links`).toBeGreaterThan(0)
      for (const match of internalLinks) {
        const label = textFromServerHtml(match[0])
          || htmlAttribute(match[0], 'aria-label')
          || htmlAttribute(match[0], 'title')
          || match[0].match(/\balt=["']([^"']+)["']/i)?.[1]
          || ''
        expect(label.trim(), `${route} has an unlabeled internal link: ${match[0].slice(0, 160)}`).not.toBe('')
        expect(label.trim(), `${route} has generic internal anchor text`).not.toMatch(GENERIC_LINK_TEXT)
      }
    }
  })

  test('all rendered internal page destinations resolve without an HTTP error', async ({ request }) => {
    test.setTimeout(180_000)
    const destinations = new Set<string>()
    for (const route of INDEXABLE_ROUTES) {
      const html = await (await request.get(route, { headers: CANONICAL_HEADERS })).text()
      for (const match of Array.from(html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi))) {
        const pathname = internalPath(match[1])
        if (pathname) destinations.add(pathname)
      }
    }
    for (const pathname of Array.from(destinations).sort()) await expectReachable(request, pathname)
  })

  test('private routes stay out of the sitemap and resolve only to noindex pages or authentication redirects', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    for (const route of NOINDEX_PAGE_SEO) {
      expect(sitemap, `${route.path} must be excluded from the sitemap`).not.toContain(`<loc>${PRODUCTION_ORIGIN}${route.path}</loc>`)
      const response = await request.get(route.path, { headers: CANONICAL_HEADERS, maxRedirects: 0 })
      expect(response.status(), `${route.path} should resolve or redirect intentionally`).toBeLessThan(400)
      if (response.status() === 200) {
        const html = await response.text()
        expect(html, `${route.path} should render noindex`).toMatch(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i)
        expect(html, `${route.path} should not publish a canonical`).not.toMatch(/<link\b[^>]*rel=["']canonical["']/i)
      } else {
        expect(response.status(), `${route.path} should use a normal redirect status`).toBeGreaterThanOrEqual(300)
        expect(response.status()).toBeLessThan(400)
      }
    }
  })

  test('the custom not-found page returns a real 404 with noindex and recovery links', async ({ request }) => {
    const response = await request.get('/__final-seo-validation-missing__', {
      headers: CANONICAL_HEADERS,
      maxRedirects: 0,
    })
    expect(response.status()).toBe(404)
    const html = await response.text()
    expect(html).toContain('Page not found')
    expect(html).toMatch(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i)
    expect(html).toContain('Return to the homepage')
    expect(html).toContain('Open the PDF Editor')
  })
})
