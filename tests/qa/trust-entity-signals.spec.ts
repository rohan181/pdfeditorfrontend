import { expect, test } from '@playwright/test'
import {
  LEGAL_LAST_UPDATED_LABEL,
  PUBLIC_OPERATOR_DISCLOSURE,
  SUPPORT_EMAIL,
  TRUSTPILOT_PROFILE_URL,
} from '../../src/lib/entity'
import { PRO_BILLING_SUMMARY } from '../../src/lib/pricing'

test.describe('verified trust and entity signals', () => {
  test('about publishes only the known product identity and support channel', async ({ page }) => {
    await page.goto('/about')

    await expect(page.getByText(PUBLIC_OPERATOR_DISCLOSURE)).toBeVisible()
    await expect(page.getByText('Legal operator', { exact: true }).locator('..')).toContainText('Not currently published')
    await expect(page.getByText('Team location', { exact: true }).locator('..')).toContainText('Not currently published')
    await expect(page.getByRole('link', { name: new RegExp(SUPPORT_EMAIL) })).toHaveAttribute('href', `mailto:${SUPPORT_EMAIL}`)
    await expect(page.getByText(/small, independent team|built out of frustration/i)).toHaveCount(0)
  })

  test('legal pages expose the real editorial date and processing categories', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.getByText(`Last updated: ${LEGAL_LAST_UPDATED_LABEL}`)).toBeVisible()

    for (const category of ['Browser-based PDF tools.', 'Conversion tools.', 'OCR.', 'AI tools.']) {
      await expect(page.getByText(category, { exact: true })).toBeVisible()
    }

    await page.goto('/terms')
    await expect(page.getByText(`Last updated: ${LEGAL_LAST_UPDATED_LABEL}`)).toBeVisible()
    await expect(page.getByText(/jurisdiction in which EditPDF AI is registered/i)).toHaveCount(0)
  })

  test('pricing matches the implemented monthly checkout', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(PRO_BILLING_SUMMARY).first()).toBeVisible()
    await expect(page.getByText('Annual', { exact: true })).toHaveCount(0)
    await expect(page.getByText(/Join users who use EditPDF AI every day/i)).toHaveCount(0)
    await expect(page.getByText(/Founding offer|Founding-member|limited time|countdown/i)).toHaveCount(0)
    await expect(page.getByText(/Secured by Stripe|256-bit SSL/i)).toHaveCount(0)
  })

  test('the footer links to the verified external profile without rating claims', async ({ page }) => {
    await page.goto('/')

    const profile = page.getByRole('link', { name: 'View the EditPDF AI profile on Trustpilot' })
    await expect(profile).toHaveAttribute('href', TRUSTPILOT_PROFILE_URL)
    await expect(page.getByText(/Real feedback from|What people are saying/i)).toHaveCount(0)
  })

  test('guides omit unsupported author and editorial dates', async ({ page }) => {
    await page.goto('/guides/how-to-edit-a-pdf-without-adobe')

    await expect(page.getByText(/By the EditPDF AI team|Published|Last reviewed/)).toHaveCount(0)
  })
})
