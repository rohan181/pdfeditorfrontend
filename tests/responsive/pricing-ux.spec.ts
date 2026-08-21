import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import {
  AI_CONVERSION_ACCESS_SUMMARY,
  AI_USE_DEFINITION,
  PRO_BILLING_SUMMARY,
  PRO_PRICE_DISPLAY,
  PRO_REFUND_SUMMARY,
} from '../../src/lib/pricing'

const widths = [320, 375, 390, 768, 1024, 1440] as const

function chromiumLaptopOnly(projectName: string) {
  test.skip(projectName !== 'chromium-laptop', 'One Chromium project covers the explicit pricing breakpoint matrix')
}

test('pricing clearly separates equal Free and Pro cards at every required width', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  chromiumLaptopOnly(testInfo.project.name)

  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 320 ? 568 : width <= 390 ? 844 : width <= 768 ? 1024 : 900 })
    await page.goto('/pricing', { waitUntil: 'domcontentloaded' })

    const freeCard = page.getByRole('article', { name: 'Free' })
    const proCard = page.getByRole('article', { name: 'Pro' })
    await expect(freeCard).toBeVisible()
    await expect(proCard).toBeVisible()
    await expect(freeCard.locator('.ui-button')).toHaveCount(1)
    await expect(proCard.locator('.ui-button')).toHaveCount(1)
    await expect(proCard).toContainText(`${PRO_PRICE_DISPLAY}per month`)
    await expect(proCard).toContainText('Recurring monthly billing in USD')
    await expect(proCard).toContainText('account and sign-in are required before checkout')

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), `${width}px pricing overflow`).toBeTruthy()

    const [freeHeight, proHeight] = await Promise.all([
      freeCard.evaluate(element => element.getBoundingClientRect().height),
      proCard.evaluate(element => element.getBoundingClientRect().height),
    ])
    expect(Math.abs(freeHeight - proHeight), `${width}px card height difference`).toBeLessThanOrEqual(2)
  }
})

test('pricing explains AI use, conversion access, billing, cancellation, and refunds without false urgency', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.goto('/pricing', { waitUntil: 'domcontentloaded' })

  await expect(page.getByText(AI_USE_DEFINITION).first()).toBeVisible()
  await expect(page.getByText(AI_CONVERSION_ACCESS_SUMMARY).first()).toBeVisible()
  await expect(page.getByText(PRO_BILLING_SUMMARY).first()).toBeVisible()
  await expect(page.getByText(PRO_REFUND_SUMMARY).first()).toBeVisible()
  await expect(page.getByText(/Founding offer|Founding-member|limited time|countdown|spots left/i)).toHaveCount(0)

  const comparison = page.getByRole('table', { name: 'Free and Pro plan comparison' })
  await expect(comparison.getByRole('columnheader', { name: 'Free' })).toBeVisible()
  await expect(comparison.getByRole('columnheader', { name: 'Pro' })).toBeVisible()
})

test('mobile comparison rows become labelled cards without overflow', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/pricing', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('.pricing-full-header')).toBeHidden()
  const rows = page.locator('.pricing-full-row')
  await expect(rows.first()).toBeVisible()
  expect(await rows.evaluateAll(items => items.every(item => item.getBoundingClientRect().width <= 288))).toBeTruthy()
  await expect(rows.first().locator('[data-plan="Free"]')).toBeVisible()
  await expect(rows.first().locator('[data-plan="Pro"]')).toBeVisible()
})

test('signed-out checkout redirects to authentication before payment fields are available', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.goto('/checkout', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/sign-in(?:\/|\?|$)/)
  await expect(page.locator('#payment-element')).toHaveCount(0)
})

test('checkout confirmation exposes clear success, cancellation, and failure states', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)

  await page.goto('/checkout/confirm')
  await expect(page.getByRole('heading', { name: 'Checkout cancelled' })).toBeVisible()
  await expect(page.getByText('No subscription was created')).toBeVisible()

  await page.goto('/checkout/confirm?redirect_status=failed')
  await expect(page.getByRole('heading', { name: 'Subscription not activated' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Check current plan' })).toBeVisible()

  await page.route('**/api/subscription/activate', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'active' }) }))
  await page.goto('/checkout/confirm?setup_intent=seti_test&redirect_status=succeeded')
  await expect(page.getByRole('heading', { name: 'Pro is active' })).toBeVisible()
  await expect(page.getByText(PRO_BILLING_SUMMARY)).toBeVisible()
})

test('checkout cancellation returns a clear no-charge pricing state', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.goto('/pricing?checkout=cancelled')
  await expect(page.getByRole('status')).toContainText('No subscription was created')
  await expect(page.getByRole('status')).toContainText('no plan changes were made')
})

test('subscription APIs guard existing Pro accounts and duplicate activation', async ({}, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  const setupRoute = await readFile('src/app/api/subscription/create-setup-intent/route.ts', 'utf8')
  const activationRoute = await readFile('src/app/api/subscription/activate/route.ts', 'utf8')
  expect(setupRoute).toContain("code: 'already_pro'")
  expect(activationRoute).toContain('idempotencyKey:')
})

test('homepage and Terms use the same billing, conversion, and refund rules', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.goto('/')
  await expect(page.getByText(PRO_BILLING_SUMMARY)).toBeVisible()
  await expect(page.getByText(/Founding offer|Founding-member/i)).toHaveCount(0)

  await page.goto('/terms')
  await expect(page.getByText(AI_CONVERSION_ACCESS_SUMMARY)).toBeVisible()
  await expect(page.getByText(PRO_BILLING_SUMMARY, { exact: false })).toBeVisible()
  await expect(page.getByText(PRO_REFUND_SUMMARY, { exact: false })).toBeVisible()
})
