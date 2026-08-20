import { expect, test, type Page } from '@playwright/test'
import { serializeJsonLd } from '../../src/components/JsonLd'
import guides from '../../src/lib/guidesData'
import { PRICING_FAQS } from '../../src/lib/pricingData'
import {
  buildToolStructuredData,
  type JsonLdObject,
  type JsonLdValue,
} from '../../src/lib/seo/structuredData'
import {
  ORGANIZATION_ID,
  PRODUCTION_ORIGIN,
  WEBSITE_ID,
} from '../../src/lib/seo/site'
import toolMeta from '../../src/lib/toolMeta'

const FORBIDDEN_TYPES = new Set([
  'AggregateRating',
  'Offer',
  'Person',
  'Rating',
  'Review',
])

function asObject(value: JsonLdValue): JsonLdObject {
  expect(value).not.toBeNull()
  expect(Array.isArray(value)).toBe(false)
  expect(typeof value).toBe('object')
  return value as JsonLdObject
}

function topLevelNodes(documents: JsonLdObject[]): JsonLdObject[] {
  return documents.flatMap(document => {
    const graph = document['@graph']
    return Array.isArray(graph) ? graph.map(asObject) : [document]
  })
}

function everyObject(value: JsonLdValue): JsonLdObject[] {
  if (value === null || typeof value !== 'object') return []
  if (Array.isArray(value)) return value.flatMap(everyObject)

  const object = value as JsonLdObject
  return [object, ...Object.values(object).flatMap(child => (
    child === undefined ? [] : everyObject(child)
  ))]
}

function typesFor(object: JsonLdObject): string[] {
  const type = object['@type']
  if (typeof type === 'string') return [type]
  if (Array.isArray(type)) return type.filter((value): value is string => typeof value === 'string')
  return []
}

function nodesOfType(nodes: JsonLdObject[], type: string): JsonLdObject[] {
  return nodes.filter(node => typesFor(node).includes(type))
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

async function readStructuredData(page: Page): Promise<JsonLdObject[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(scripts.length).toBeGreaterThan(0)

  return scripts.map((script, index) => {
    expect(() => JSON.parse(script), `JSON-LD script ${index + 1} should contain valid JSON`).not.toThrow()
    return JSON.parse(script) as JsonLdObject
  })
}

function expectNoUnsupportedClaims(documents: JsonLdObject[]) {
  const objects = documents.flatMap(everyObject)
  for (const object of objects) {
    for (const type of typesFor(object)) {
      expect(FORBIDDEN_TYPES.has(type), `${type} should not be emitted`).toBe(false)
    }
    expect(object).not.toHaveProperty('aggregateRating')
    expect(object).not.toHaveProperty('review')
    expect(object).not.toHaveProperty('offers')
    expect(object).not.toHaveProperty('foundingDate')
    expect(object).not.toHaveProperty('award')
  }
}

function expectUniqueEntityIds(nodes: JsonLdObject[]) {
  const ids = nodes
    .map(node => node['@id'])
    .filter((id): id is string => typeof id === 'string')
  expect(new Set(ids).size, 'top-level schema entity @ids should be unique').toBe(ids.length)
}

async function expectFaqMatchesVisiblePage(page: Page, nodes: JsonLdObject[]) {
  // FAQ answers may begin inside a collapsed, user-expandable accordion. They
  // must still be rendered in the page DOM from the same source data.
  const bodyText = normalizeText(await page.locator('body').textContent() ?? '')
  const faqPages = nodesOfType(nodes, 'FAQPage')

  for (const faqPage of faqPages) {
    const questions = faqPage.mainEntity
    expect(Array.isArray(questions)).toBe(true)

    for (const questionValue of questions as JsonLdValue[]) {
      const question = asObject(questionValue)
      const answer = asObject(question.acceptedAnswer as JsonLdValue)
      expect(bodyText).toContain(normalizeText(String(question.name)))
      expect(bodyText).toContain(normalizeText(String(answer.text)))
    }
  }
}

test.describe('structured data regression', () => {
  test('JSON-LD serialization escapes script-breaking input and remains valid JSON', () => {
    const unsafe = '</script><script>alert("structured-data")</script>\u2028&'
    const serialized = serializeJsonLd({ name: unsafe })

    expect(serialized).not.toContain('<')
    expect(serialized).not.toContain('>')
    expect(serialized).not.toContain('&')
    expect(JSON.parse(serialized)).toEqual({ name: unsafe })
  })

  test('every registered tool builds one linked page, application and breadcrumb graph', () => {
    for (const tool of toolMeta) {
      const document = buildToolStructuredData(tool.slug)
      const nodes = topLevelNodes([document])
      const url = `${PRODUCTION_ORIGIN}/${tool.slug}`

      expect(nodesOfType(nodes, 'WebPage')).toHaveLength(1)
      expect(nodesOfType(nodes, 'WebApplication')).toHaveLength(1)
      expect(nodesOfType(nodes, 'BreadcrumbList')).toHaveLength(1)
      expect(nodesOfType(nodes, 'WebSite')).toHaveLength(0)
      expect(nodesOfType(nodes, 'Organization')).toHaveLength(0)
      expectUniqueEntityIds(nodes)
      expectNoUnsupportedClaims([document])

      const application = nodesOfType(nodes, 'WebApplication')[0]
      expect(application['@id']).toBe(`${url}#application`)
      expect(application.name).toBe(tool.name)
      expect(application.description).toBe(tool.desc)
      expect(asObject(application.provider as JsonLdValue)['@id']).toBe(ORGANIZATION_ID)

      const webPage = nodesOfType(nodes, 'WebPage')[0]
      expect(webPage['@id']).toBe(`${url}#webpage`)
      expect(asObject(webPage.isPartOf as JsonLdValue)['@id']).toBe(WEBSITE_ID)
    }
  })

  test('homepage contains the single Organization plus linked WebSite, WebPage and WebApplication entities', async ({ page }) => {
    await page.goto('/')
    const documents = await readStructuredData(page)
    const nodes = topLevelNodes(documents)

    expect(nodesOfType(nodes, 'Organization')).toHaveLength(1)
    expect(nodesOfType(nodes, 'WebSite')).toHaveLength(1)
    expect(nodesOfType(nodes, 'WebPage')).toHaveLength(1)
    expect(nodesOfType(nodes, 'WebApplication')).toHaveLength(1)
    expect(nodesOfType(nodes, 'FAQPage')).toHaveLength(1)
    expectUniqueEntityIds(nodes)
    expectNoUnsupportedClaims(documents)
    await expectFaqMatchesVisiblePage(page, nodes)

    const organization = nodesOfType(nodes, 'Organization')[0]
    expect(organization['@id']).toBe(ORGANIZATION_ID)
    expect(organization.name).toBe('EditPDF AI')
    expect(organization.url).toBe(PRODUCTION_ORIGIN)
    expect(organization).not.toHaveProperty('sameAs')

    const website = nodesOfType(nodes, 'WebSite')[0]
    expect(website['@id']).toBe(WEBSITE_ID)
    expect(asObject(website.publisher as JsonLdValue)['@id']).toBe(ORGANIZATION_ID)
  })

  for (const route of ['/pdf-editor', '/pdf-summarizer', '/pdf-to-word', '/ai-pdf-form-filler']) {
    test(`${route} has one tool graph and only visible FAQ content`, async ({ page }) => {
      await page.goto(route)
      const documents = await readStructuredData(page)
      const nodes = topLevelNodes(documents)

      expect(nodesOfType(nodes, 'Organization')).toHaveLength(1)
      expect(nodesOfType(nodes, 'WebSite')).toHaveLength(0)
      expect(nodesOfType(nodes, 'WebPage')).toHaveLength(1)
      expect(nodesOfType(nodes, 'WebApplication')).toHaveLength(1)
      expect(nodesOfType(nodes, 'BreadcrumbList')).toHaveLength(1)
      expect(nodesOfType(nodes, 'FAQPage')).toHaveLength(1)
      expectUniqueEntityIds(nodes)
      expectNoUnsupportedClaims(documents)
      await expectFaqMatchesVisiblePage(page, nodes)
    })
  }

  test('guide pages contain a linked WebPage, Article and BreadcrumbList without fabricated authors', async ({ page }) => {
    const guide = guides[0]
    await page.goto(`/guides/${guide.slug}`)
    const documents = await readStructuredData(page)
    const nodes = topLevelNodes(documents)

    expect(nodesOfType(nodes, 'Organization')).toHaveLength(1)
    expect(nodesOfType(nodes, 'WebSite')).toHaveLength(0)
    expect(nodesOfType(nodes, 'WebPage')).toHaveLength(1)
    expect(nodesOfType(nodes, 'Article')).toHaveLength(1)
    expect(nodesOfType(nodes, 'BreadcrumbList')).toHaveLength(1)
    expect(nodesOfType(nodes, 'FAQPage')).toHaveLength(0)
    expectUniqueEntityIds(nodes)
    expectNoUnsupportedClaims(documents)

    const article = nodesOfType(nodes, 'Article')[0]
    expect(article.headline).toBe(guide.title)
    expect(article).not.toHaveProperty('datePublished')
    expect(article).not.toHaveProperty('dateModified')
    expect(article).not.toHaveProperty('author')
    expect(asObject(article.publisher as JsonLdValue)['@id']).toBe(ORGANIZATION_ID)
    await expect(page.getByText(/Published|Last reviewed|By the EditPDF AI team/)).toHaveCount(0)
  })

  test('pricing FAQ schema is generated from the visibly rendered pricing FAQ data', async ({ page }) => {
    await page.goto('/pricing')
    const documents = await readStructuredData(page)
    const nodes = topLevelNodes(documents)

    expect(nodesOfType(nodes, 'Organization')).toHaveLength(1)
    expect(nodesOfType(nodes, 'WebPage')).toHaveLength(1)
    expect(nodesOfType(nodes, 'FAQPage')).toHaveLength(1)
    expect(nodesOfType(nodes, 'WebApplication')).toHaveLength(0)
    expectNoUnsupportedClaims(documents)
    await expectFaqMatchesVisiblePage(page, nodes)

    const faq = nodesOfType(nodes, 'FAQPage')[0]
    expect(faq.mainEntity).toHaveLength(PRICING_FAQS.length)
  })
})
