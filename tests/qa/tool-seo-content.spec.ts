import { expect, test, type Locator, type Page } from '@playwright/test'
import guides from '../../src/lib/guidesData'
import { TOOL_GUIDES } from '../../src/lib/toolGuideLinks'
import toolMeta from '../../src/lib/toolMeta'

const AI_FORM_FILLER = 'ai-pdf-form-filler'
const PDF_EDITOR = 'pdf-editor'
const PRIORITY_AEO_SLUGS = new Set([
  PDF_EDITOR,
  AI_FORM_FILLER,
  'pdf-ocr',
  'pdf-summarizer',
  'pdf-merger',
  'pdf-compressor',
  'pdf-viewer',
  'pdf-signer',
])
const AI_PRIORITY_SLUGS = new Set([AI_FORM_FILLER, 'pdf-ocr', 'pdf-summarizer'])
const MAJOR_TOOL_SLUGS = [
  'pdf-editor',
  'pdf-viewer',
  'ai-pdf-form-filler',
  'pdf-merger',
  'pdf-compressor',
  'pdf-splitter',
  'pdf-ocr',
  'pdf-summarizer',
  'pdf-translator',
  'pdf-signer',
  'pdf-to-word',
  'image-to-pdf',
  'quiz-creator',
] as const

const IMPLEMENTED_CONTENT_PLAN_GUIDES = [
  {
    slug: 'how-to-extract-pages-from-a-pdf',
    title: 'How to Extract Pages from a PDF into a New File',
    toolSlug: 'extract-pages',
  },
  {
    slug: 'how-to-reorder-pages-in-a-pdf',
    title: 'How to Reorder PDF Pages and Save the New Sequence',
    toolSlug: 'pdf-page-manager',
  },
  {
    slug: 'how-to-combine-images-into-one-pdf',
    title: 'How to Combine JPG and PNG Images into One PDF',
    toolSlug: 'image-to-pdf',
  },
] as const

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function findFaqPage(value: unknown): any | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFaqPage(item)
      if (found) return found
    }
    return null
  }
  if (!value || typeof value !== 'object') return null
  const object = value as Record<string, unknown>
  if (object['@type'] === 'FAQPage') return object
  return findFaqPage(object['@graph'])
}

async function sectionWithHeading(page: Page, heading: string): Promise<Locator> {
  return page.locator('section').filter({ has: page.getByRole('heading', { name: heading, exact: true }) }).first()
}

test.describe('public tool SEO content', () => {
  test('every registered tool renders the required visible content and constrained link sets', async ({ page }) => {
    test.setTimeout(120_000)
    const registeredSlugs = new Set(toolMeta.map(tool => tool.slug))
    const seenAnswers = new Set<string>()
    const seenPriorityFaqSets = new Set<string>()

    for (const tool of toolMeta) {
      const response = await page.goto(`/${tool.slug}`, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), `${tool.slug} should return 200`).toBe(200)

      await expect(page.locator('h1'), `${tool.slug} should have one H1`).toHaveCount(1)
      const h1Text = (await page.locator('h1').innerText()).toLowerCase()
      const keywordRoots = tool.name
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(token => token.length >= 3 && !['pdf', 'the', 'with'].includes(token))
        .map(token => token.slice(0, Math.min(4, token.length)))
      expect(keywordRoots.some(root => h1Text.includes(root)), `${tool.slug} H1 should contain a tool-specific keyword`).toBe(true)
      await expect(page.getByRole('navigation', { name: 'Breadcrumb' }), `${tool.slug} should show a breadcrumb`).toHaveCount(1)

      const directAnswer = PRIORITY_AEO_SLUGS.has(tool.slug)
        ? page.locator('.tool-hero-definition')
        : page.locator('.tool-seo-direct-answer')
      await expect(directAnswer, `${tool.slug} should show one direct answer`).toHaveCount(1)
      const answerText = (await directAnswer.innerText()).replace(/\s+/g, ' ').trim()
      const answerWords = wordCount(answerText)
      expect(answerWords, `${tool.slug} direct answer should be 40–60 words`).toBeGreaterThanOrEqual(40)
      expect(answerWords, `${tool.slug} direct answer should be 40–60 words`).toBeLessThanOrEqual(60)
      expect(seenAnswers.has(answerText), `${tool.slug} should not reuse an identical answer`).toBe(false)
      seenAnswers.add(answerText)

      if (PRIORITY_AEO_SLUGS.has(tool.slug)) {
        await expect(page.locator('h1 + .tool-hero-definition'), `${tool.slug} definition should immediately follow its H1`).toHaveCount(1)

        const facts = page.getByRole('region', { name: 'Verified facts' })
        await expect(facts.getByRole('heading', { name: 'Verified facts', exact: true })).toHaveCount(1)
        await expect(facts.locator('.tool-quick-fact')).toHaveCount(6)
        for (const label of ['Price', 'Account', 'Processing', 'Formats', 'File limit', 'Browser support']) {
          await expect(facts.locator(`[data-fact-label="${label}"]`), `${tool.slug} should show ${label}`).toHaveCount(1)
        }
        if (AI_PRIORITY_SLUGS.has(tool.slug)) {
          await expect(facts).toContainText('AI output can be inaccurate or incomplete')
        }

        const faqQuestionText = (await page.locator('.tool-seo-faq-question').allTextContents()).map(normalizeText)
        const faqAnswerText = (await page.locator('.tool-seo-faq-answer').allTextContents()).map(normalizeText)
        expect(faqQuestionText.length, `${tool.slug} should show four to six page-specific FAQs`).toBeGreaterThanOrEqual(4)
        expect(faqQuestionText.length, `${tool.slug} should show four to six page-specific FAQs`).toBeLessThanOrEqual(6)
        expect(faqAnswerText).toHaveLength(faqQuestionText.length)

        const documents = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(value => JSON.parse(value))
        const faqPage = findFaqPage(documents)
        expect(faqPage, `${tool.slug} should render FAQPage JSON-LD`).not.toBeNull()
        const schemaQuestions = (faqPage.mainEntity as any[]).map(item => normalizeText(String(item.name)))
        const schemaAnswers = (faqPage.mainEntity as any[]).map(item => normalizeText(String(item.acceptedAnswer.text)))
        expect(schemaQuestions, `${tool.slug} FAQ questions should match JSON-LD exactly`).toEqual(faqQuestionText)
        expect(schemaAnswers, `${tool.slug} FAQ answers should match JSON-LD exactly`).toEqual(faqAnswerText)

        const faqSet = JSON.stringify(schemaQuestions)
        expect(seenPriorityFaqSets.has(faqSet), `${tool.slug} should not reuse another priority page's FAQ set`).toBe(false)
        seenPriorityFaqSets.add(faqSet)
      }

      if (tool.slug === AI_FORM_FILLER) {
        expect(await page.locator('.fg3d').count(), `${tool.slug} should show capabilities`).toBeGreaterThanOrEqual(3)
        await expect(page.locator('.how-sec .step'), `${tool.slug} should show three steps`).toHaveCount(3)
        await expect(page.locator('.audience-card'), `${tool.slug} should show four use cases`).toHaveCount(4)
        await expect(page.locator('details.fq'), `${tool.slug} should show six FAQs`).toHaveCount(6)
        await expect(page.locator('.related-card'), `${tool.slug} should show five related tools`).toHaveCount(5)
        await expect(page.locator('[aria-label="Verified facts"]')).toContainText('Input: PDF')
        await expect(page.locator('[aria-label="Verified facts"]')).toContainText('Form PDF interface: 50 MB')
        await expect(page.locator('.priv-box')).toContainText('Processing depends on the workflow')
        await expect(page.locator('.cta-ban .btn-p')).toHaveCount(1)
      } else {
        await expect(page.locator('.tool-seo-capability'), `${tool.slug} should show three capabilities`).toHaveCount(3)

        if (tool.slug === PDF_EDITOR) {
          await expect(page.locator('.steps-sec .step'), `${tool.slug} should show three steps`).toHaveCount(3)
          await expect(page.locator('.faq-grid .fq'), `${tool.slug} should show six FAQs`).toHaveCount(6)
        } else {
          const howItWorks = await sectionWithHeading(page, 'How it works')
          await expect(howItWorks.locator('.tool-seo-card'), `${tool.slug} should show three steps`).toHaveCount(3)
          const faqCount = await page.locator('.tool-seo-faq').count()
          expect(faqCount, `${tool.slug} should show four to six FAQs`).toBeGreaterThanOrEqual(4)
          expect(faqCount, `${tool.slug} should show four to six FAQs`).toBeLessThanOrEqual(6)
        }

        const practicalExamples = await sectionWithHeading(page, 'Practical examples')
        const useCaseCount = await practicalExamples.locator('.tool-seo-card').count()
        expect(useCaseCount, `${tool.slug} should show three or four use cases`).toBeGreaterThanOrEqual(3)
        expect(useCaseCount, `${tool.slug} should show three or four use cases`).toBeLessThanOrEqual(4)

        await expect(page.locator('.tool-seo-formats')).toContainText('Input formats')
        await expect(page.locator('.tool-seo-formats')).toContainText('Output formats')
        await expect(page.locator('.tool-seo-limit'), `${tool.slug} should show a verified limit`).toHaveCount(1)
        await expect(page.locator('.tool-seo-privacy'), `${tool.slug} should explain processing`).toHaveCount(1)
        await expect(page.locator('.tool-seo-primary-action'), `${tool.slug} should show one primary CTA`).toHaveCount(1)

        const related = page.locator('.tool-seo-related')
        const relatedCount = await related.count()
        expect(relatedCount, `${tool.slug} should show three to five related tools`).toBeGreaterThanOrEqual(3)
        expect(relatedCount, `${tool.slug} should show three to five related tools`).toBeLessThanOrEqual(5)

        for (let index = 0; index < relatedCount; index += 1) {
          const href = await related.nth(index).getAttribute('href')
          const relatedSlug = href?.replace(/^\//, '') ?? ''
          expect(registeredSlugs.has(relatedSlug), `${tool.slug} related href ${href} should be registered`).toBe(true)
          expect(relatedSlug, `${tool.slug} should not link to itself`).not.toBe(tool.slug)
          expect((await related.nth(index).innerText()).trim().length, `${tool.slug} related anchor should be descriptive`).toBeGreaterThan(3)
        }
      }

      const genericLabelCount = await page.locator('text="Free online PDF tool"').count()
      expect(genericLabelCount, `${tool.slug} should not use the generic tool label`).toBe(0)
    }
  })

  test('major tools link to relevant guides and every guide links to its primary tool', async ({ page }) => {
    test.setTimeout(60_000)

    for (const slug of MAJOR_TOOL_SLUGS) {
      const configuredGuides = TOOL_GUIDES[slug]
      expect(configuredGuides?.length, `${slug} should have at least one guide`).toBeGreaterThanOrEqual(1)

      await page.goto(`/${slug}`, { waitUntil: 'domcontentloaded' })
      for (const guide of configuredGuides ?? []) {
        await expect(page.locator(`a[href="${guide.href}"]`).first(), `${slug} should link to ${guide.href}`).toBeVisible()
      }
    }

    for (const guide of guides) {
      await page.goto(`/guides/${guide.slug}`, { waitUntil: 'domcontentloaded' })
      await expect(page.locator(`a[href="/${guide.toolSlug}"]`).first(), `${guide.slug} should link to ${guide.toolSlug}`).toBeVisible()
    }
  })

  test('the first content-plan guides are substantial, focused, and connected to working tools', async ({ page }) => {
    for (const guide of IMPLEMENTED_CONTENT_PLAN_GUIDES) {
      const response = await page.goto(`/guides/${guide.slug}`, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), guide.slug).toBe(200)

      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(guide.title)
      await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toHaveCount(1)

      const articleText = normalizeText(await page.locator('article').innerText())
      expect(wordCount(articleText), `${guide.slug} should provide substantive guidance`).toBeGreaterThanOrEqual(500)

      const relatedLinks = page.locator('.guide-related-link')
      const relatedCount = await relatedLinks.count()
      expect(relatedCount, `${guide.slug} should provide three to five contextual links`).toBeGreaterThanOrEqual(3)
      expect(relatedCount, `${guide.slug} should provide three to five contextual links`).toBeLessThanOrEqual(5)

      await expect(page.locator(`a[href="/${guide.toolSlug}"]`).first()).toBeVisible()
      await expect(page.locator('article')).not.toContainText('Free online PDF tool')
    }
  })
})
