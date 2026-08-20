import { expect, test } from '@playwright/test'
import toolMeta, {
  AI_TOOL_COUNT,
  CORE_TOOL_COUNT,
  TOOL_COUNT,
} from '../../src/lib/toolMeta'
import {
  AI_ACCURACY_DISCLAIMER,
  FREE_AI_DAILY_LIMIT,
  PRODUCT_ACCESS_SUMMARY,
} from '../../src/lib/productMessaging'

const PUBLIC_MESSAGING_ROUTES = [
  '/',
  '/about',
  '/pricing',
  '/privacy',
  '/terms',
  '/support',
  '/ai-pdf-form-filler',
  '/pdf-summarizer',
  '/pdf-translator',
  '/pdf-ocr',
  '/pdf-to-word',
  '/pdf-to-excel',
  '/pdf-to-ppt',
  '/mind-map',
  '/quiz-creator',
]

test.describe('product messaging regression', () => {
  test('tool totals and access groups come from the central registry', () => {
    expect(TOOL_COUNT).toBe(toolMeta.length)
    expect(TOOL_COUNT).toBe(51)
    expect(CORE_TOOL_COUNT).toBe(toolMeta.filter(tool => tool.access !== 'metered-ai').length)
    expect(AI_TOOL_COUNT).toBe(toolMeta.filter(tool => tool.access !== 'core').length)
    expect(CORE_TOOL_COUNT).toBe(41)
    expect(AI_TOOL_COUNT).toBe(12)
    expect(PRODUCT_ACCESS_SUMMARY).toContain(`${TOOL_COUNT} active tools`)
    expect(PRODUCT_ACCESS_SUMMARY).toContain(`${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day`)
  })

  for (const route of PUBLIC_MESSAGING_ROUTES) {
    test(`${route} avoids stale access and absolute product claims`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)

      const content = `${await page.title()} ${await page.locator('meta[name="description"]').getAttribute('content')} ${await page.locator('body').innerText()}`
      expect(content).not.toMatch(/\b(?:35|50)\+\b/i)
      expect(content).not.toMatch(/\bfree forever\b|\ball (?:tools )?free\b|\bno limits\b|\bunlimited AI\b|\bpriority processing\b/i)
      expect(content).not.toMatch(/\bno upload\b|\bnever uploaded\b|\bany PDF\b/i)
      expect(content).not.toMatch(/\bpixel-perfect\b|\bfully editable\b|\bAI does not invent facts\b/i)
    })
  }

  test('pricing states the actual Free and Pro distinction', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('No tool is currently restricted to Pro; Pro changes the daily AI allowance')).toBeVisible()
    await expect(page.getByText(new RegExp(`${FREE_AI_DAILY_LIMIT} metered AI actions per UTC day`)).first()).toBeVisible()
    expect(await page.locator('main').innerText()).toContain('Tool-specific input and processing limits still apply')
  })

  test('privacy and AI accuracy disclosures describe implemented data flows', async ({ page }) => {
    await page.goto('/privacy')
    const privacyText = await page.locator('main').innerText()
    expect(privacyText).toContain('extracted text, rendered page images, uploaded images, or a PDF')
    expect(privacyText).toContain('does not write document content to its database or object storage')
    expect(privacyText).toContain('provider\'s own retention terms also apply')

    await page.goto('/support')
    expect(await page.locator('main').innerText()).toContain(AI_ACCURACY_DISCLAIMER)
  })
})
