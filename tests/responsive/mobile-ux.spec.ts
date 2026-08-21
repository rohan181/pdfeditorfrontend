import { expect, test } from '@playwright/test'
import { PDFDocument, StandardFonts } from 'pdf-lib'

const phoneWidths = [320, 375, 390] as const
const routes = [
  '/',
  '/pdf-editor',
  '/ai-pdf-form-filler',
  '/pdf-merger',
  '/pdf-compressor',
  '/pdf-viewer',
  '/pricing',
  '/guides',
  '/sign-in',
  '/sign-up',
  '/dashboard',
] as const

function onlyExactWidthProject(projectName: string) {
  test.skip(projectName !== 'chromium-laptop', 'One Chromium project covers the explicit 320/375/390 matrix')
}

test('mobile surfaces avoid overflow, edge collisions, tiny primary actions, and iOS input zoom', async ({ page }, testInfo) => {
  test.setTimeout(120_000)
  onlyExactWidthProject(testInfo.project.name)

  for (const width of phoneWidths) {
    const height = width === 320 ? 568 : width === 375 ? 667 : 844
    await page.setViewportSize({ width, height })

    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('body')).toBeVisible()

      const metrics = await page.evaluate(() => {
        const root = document.documentElement
        const visible = (element: Element) => {
          const rect = element.getBoundingClientRect()
          const style = getComputedStyle(element)
          return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
        }
        const boundedShells = Array.from(document.querySelectorAll<HTMLElement>('main, .wrap, .ui-container, .upload-wrap'))
          .filter(visible)
          .map(element => element.getBoundingClientRect())
          .filter(rect => rect.width > 0)
          .map(rect => ({ left: rect.left, right: rect.right }))
        const primaryTargets = Array.from(document.querySelectorAll<HTMLElement>('.ui-button, .drop-btn, .browse-btn'))
          .filter(visible)
          .map(element => {
            const rect = element.getBoundingClientRect()
            return { width: rect.width, height: rect.height, label: element.textContent?.trim().slice(0, 40) }
          })
        const inputFonts = Array.from(document.querySelectorAll<HTMLElement>('input, textarea, select'))
          .filter(visible)
          .map(element => parseFloat(getComputedStyle(element).fontSize))

        return {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          boundedShells,
          primaryTargets,
          inputFonts,
        }
      })

      expect(metrics.scrollWidth, `${route} should not overflow at ${width}px`).toBeLessThanOrEqual(metrics.clientWidth + 2)
      expect(metrics.boundedShells.every(shell => shell.left >= -1 && shell.right <= metrics.clientWidth + 1), `${route} shell edges at ${width}px`).toBeTruthy()
      expect(metrics.primaryTargets.every(target => target.height >= 44), `${route} primary touch targets at ${width}px: ${JSON.stringify(metrics.primaryTargets)}`).toBeTruthy()
      expect(metrics.inputFonts.every(fontSize => fontSize >= 16), `${route} input font sizes at ${width}px`).toBeTruthy()
    }
  }
})

test('mobile navigation, footer, pricing, modal, and browser back remain usable', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  onlyExactWidthProject(testInfo.project.name)
  await page.setViewportSize({ width: 320, height: 568 })

  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  const drawer = page.getByRole('dialog', { name: 'Menu' })
  await expect(drawer).toBeVisible()
  expect(await drawer.evaluate(element => element.getBoundingClientRect().width)).toBeLessThanOrEqual(321)
  const firstCategory = drawer.locator('.site-mobile-categories > section > button').first()
  if (await firstCategory.getAttribute('aria-expanded') === 'true') await firstCategory.click()
  await firstCategory.click()
  await expect(firstCategory).toHaveAttribute('aria-expanded', 'true')
  expect(await drawer.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused()

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const footerGroups = page.locator('.sf-mobile-col')
  await expect(footerGroups).toHaveCount(4)
  expect(await footerGroups.evaluateAll(groups => groups.every(group => !(group as HTMLDetailsElement).open))).toBeTruthy()
  await footerGroups.first().locator('summary').click()
  await expect(footerGroups.first()).toHaveAttribute('open', '')

  await page.goto('/pricing', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.pricing-full-header')).toBeHidden()
  const comparisonCards = page.locator('.pricing-full-row')
  await expect(comparisonCards.first()).toBeVisible()
  expect(await comparisonCards.evaluateAll(cards => cards.every(card => card.getBoundingClientRect().width <= 288))).toBeTruthy()
  await expect(comparisonCards.first().locator('[data-plan="Free"]')).toBeVisible()
  await expect(comparisonCards.first().locator('[data-plan="Pro"]')).toBeVisible()

  const signInDialog = page.getByRole('dialog', { name: 'Sign in to use AI tools' })
  await expect.poll(async () => {
    await page.evaluate(() => window.dispatchEvent(new Event('signin-needed')))
    return signInDialog.count()
  }).toBe(1)
  await expect(signInDialog).toBeVisible()
  const dialogRect = await signInDialog.locator('.mobile-modal-surface').evaluate(element => element.getBoundingClientRect().toJSON())
  expect(dialogRect.width).toBeLessThanOrEqual(304)
  expect(dialogRect.height).toBeLessThanOrEqual(552)
  await signInDialog.getByRole('button', { name: 'Close' }).click()

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.locator('a[href="/pdf-merger"]').first().click()
  await expect(page).toHaveURL(/\/pdf-merger$/)
  await page.goBack({ waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('selected upload survives orientation changes and keeps a readable filename', async ({ page }, testInfo) => {
  test.setTimeout(30_000)
  onlyExactWidthProject(testInfo.project.name)

  const pdf = await PDFDocument.create()
  const pdfPage = pdf.addPage([420, 594])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  pdfPage.drawText('Orientation state test', { x: 40, y: 520, size: 18, font })
  const samplePdf = Buffer.from(await pdf.save())
  const filename = 'a-very-long-mobile-filename-that-must-truncate-safely.pdf'

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })
  await page.locator('#compressor-pdf-input').setInputFiles({ name: filename, mimeType: 'application/pdf', buffer: samplePdf })
  await expect(page.locator('.file-name')).toHaveText(filename)

  await page.setViewportSize({ width: 667, height: 375 })
  await expect(page.locator('.file-name')).toHaveText(filename)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBeTruthy()

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.file-name')).toHaveText(filename)
  const filenameStyle = await page.locator('.file-name').evaluate(element => ({
    overflow: getComputedStyle(element).overflow,
    textOverflow: getComputedStyle(element).textOverflow,
    whiteSpace: getComputedStyle(element).whiteSpace,
  }))
  expect(filenameStyle).toEqual({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
})
