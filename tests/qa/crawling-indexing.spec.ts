import { expect, test } from '@playwright/test'
import guides from '../../src/lib/guidesData'
import { INDEXABLE_PAGE_SEO, NOINDEX_PAGE_SEO } from '../../src/lib/seo/routes'
import { absoluteUrl, PRODUCTION_ORIGIN } from '../../src/lib/seo/site'

const EXPECTED_INDEXABLE_URLS = [
  ...INDEXABLE_PAGE_SEO.map(page => absoluteUrl(page.canonicalPath ?? page.path)),
  ...guides.map(guide => absoluteUrl(`/guides/${guide.slug}`)),
]

const CRAWL_BLOCKED_PREFIXES = ['/api/', '/trpc/']

function xmlValues(xml: string, element: 'loc' | 'lastmod') {
  return Array.from(xml.matchAll(new RegExp(`<${element}>([^<]+)</${element}>`, 'g')))
    .map(match => match[1])
}

function canonicalFromHtml(html: string) {
  const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
  return canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1]
}

function hasNoindex(html: string) {
  const robotsTag = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i)?.[0]
  return /\bnoindex\b/i.test(robotsTag ?? '')
}

const canonicalHeaders = {
  host: 'www.editpdfai.com',
  'x-forwarded-host': 'www.editpdfai.com',
  'x-forwarded-proto': 'https',
}

test.describe('crawling and indexing controls', () => {
  test('robots.txt allows pages, blocks non-page APIs and declares the absolute sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)

    const robots = await response.text()
    expect(robots).toContain('User-Agent: *')
    expect(robots).toContain('Allow: /')
    expect(robots).toContain('Disallow: /api/')
    expect(robots).toContain('Disallow: /trpc/')
    expect(robots).toContain(`Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`)

    for (const page of INDEXABLE_PAGE_SEO) {
      expect(
        CRAWL_BLOCKED_PREFIXES.some(prefix => page.path.startsWith(prefix)),
        `${page.path} must not be blocked by robots.txt`,
      ).toBe(false)
    }
  })

  test('sitemap contains exactly the canonical indexable URL set and only real guide dates', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/xml')

    const xml = await response.text()
    const urls = xmlValues(xml, 'loc')
    const lastModifiedValues = xmlValues(xml, 'lastmod')

    expect(urls).toHaveLength(EXPECTED_INDEXABLE_URLS.length)
    expect(new Set(urls).size).toBe(urls.length)
    expect(new Set(urls)).toEqual(new Set(EXPECTED_INDEXABLE_URLS))
    expect(lastModifiedValues).toEqual(
      guides.flatMap(guide => guide.dateModified ? [guide.dateModified] : []),
    )

    for (const url of urls) {
      const parsed = new URL(url)
      expect(parsed.origin).toBe(PRODUCTION_ORIGIN)
      expect(parsed.search).toBe('')
      expect(parsed.hash).toBe('')
      if (parsed.pathname !== '/') expect(parsed.pathname.endsWith('/')).toBe(false)
      expect(CRAWL_BLOCKED_PREFIXES.some(prefix => parsed.pathname.startsWith(prefix))).toBe(false)
    }

    for (const route of NOINDEX_PAGE_SEO) {
      expect(urls).not.toContain(`${PRODUCTION_ORIGIN}${route.path}`)
    }
  })

  test('every sitemap URL returns 200 with a matching canonical and no noindex directive', async ({ request }) => {
    const sitemapResponse = await request.get('/sitemap.xml')
    const urls = xmlValues(await sitemapResponse.text(), 'loc')

    for (const url of urls) {
      const pathname = new URL(url).pathname
      const response = await request.get(pathname, {
        headers: canonicalHeaders,
        maxRedirects: 0,
      })

      expect(response.status(), `${pathname} should return 200`).toBe(200)
      const html = await response.text()
      expect(canonicalFromHtml(html), `${pathname} should self-canonicalize`).toBe(url)
      expect(hasNoindex(html), `${pathname} must remain indexable`).toBe(false)
    }
  })

  test('scheme, hostname and trailing slash variants normalize in one redirect', async ({ request }) => {
    const variants = [
      {
        label: 'non-www host',
        path: '/pdf-editor',
        headers: {
          host: 'editpdfai.com',
          'x-forwarded-host': 'editpdfai.com',
          'x-forwarded-proto': 'https',
        },
      },
      {
        label: 'HTTP canonical host',
        path: '/pdf-editor',
        headers: {
          host: 'www.editpdfai.com',
          'x-forwarded-host': 'www.editpdfai.com',
          'x-forwarded-proto': 'http',
        },
      },
      {
        label: 'alternative host and trailing slash',
        path: '/pdf-editor/',
        headers: {
          host: 'preview.example.test',
          'x-forwarded-host': 'preview.example.test',
          'x-forwarded-proto': 'https',
        },
      },
      {
        label: 'trailing slash on canonical host',
        path: '/pdf-editor/',
        headers: canonicalHeaders,
      },
    ]

    for (const variant of variants) {
      const response = await request.get(variant.path, {
        headers: variant.headers,
        maxRedirects: 0,
      })
      expect(response.status(), variant.label).toBe(308)
      expect(response.headers().location, variant.label).toBe(`${PRODUCTION_ORIGIN}/pdf-editor`)

      // The redirect target itself is terminal, proving there is no second hop
      // or loop after the scheme/host/path normalization.
      const target = await request.get('/pdf-editor', {
        headers: canonicalHeaders,
        maxRedirects: 0,
      })
      expect(target.status(), `${variant.label} target should be terminal`).toBe(200)
    }
  })

  test('query strings do not alter canonicals', async ({ request }) => {
    const response = await request.get('/pdf-editor?utm_source=crawl-test&ref=qa', {
      headers: canonicalHeaders,
      maxRedirects: 0,
    })
    expect(response.status()).toBe(200)
    expect(canonicalFromHtml(await response.text())).toBe(`${PRODUCTION_ORIGIN}/pdf-editor`)
  })

  test('unknown and deleted-looking URLs return real 404 responses', async ({ request }) => {
    for (const pathname of [
      '/__crawler-audit-missing-page__',
      '/guides/__missing-guide__',
      '/pdf-editor/deleted-workspace',
    ]) {
      const response = await request.get(pathname, {
        headers: canonicalHeaders,
        maxRedirects: 0,
      })
      expect(response.status(), pathname).toBe(404)
      expect(hasNoindex(await response.text()), `${pathname} should not be indexable`).toBe(true)
    }
  })
})
