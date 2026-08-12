import { expect, test } from '@playwright/test'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

let samplePdf: Buffer

test.beforeAll(async () => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([420, 594])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  page.drawText('Responsive PDF workspace test', {
    x: 42,
    y: 520,
    size: 20,
    font,
    color: rgb(0.1, 0.2, 0.35),
  })
  samplePdf = Buffer.from(await pdf.save())
})

async function openSamplePdf(page: import('@playwright/test').Page, route: string, workspace: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  await page.locator('input[type="file"][accept*="pdf"]').first().setInputFiles({
    name: 'phone-test.pdf',
    mimeType: 'application/pdf',
    buffer: samplePdf,
  })
  await expect(page.locator(workspace)).toBeVisible({ timeout: 20_000 })
}

test('viewer stays usable after a PDF is open on a phone', async ({ page }) => {
  await openSamplePdf(page, '/pdf-viewer', '.viewer')
  await expect.poll(() => page.locator('.pdf-canvas').evaluate(canvas => canvas.clientWidth)).toBeGreaterThan(0)

  const metrics = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    workspace: document.querySelector('.viewer')!.getBoundingClientRect().toJSON(),
    canvas: document.querySelector('.pdf-canvas')!.getBoundingClientRect().toJSON(),
    controls: [...document.querySelectorAll('.viewer .toolbar button,.viewer .page-input')].map(control => {
      const rect = control.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    }),
  }))

  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 2)
  expect(metrics.workspace.right).toBeLessThanOrEqual(metrics.viewportWidth + 1)
  expect(metrics.canvas.width).toBeLessThanOrEqual(metrics.viewportWidth - 12)
  expect(metrics.controls.every(control => control.width >= 44 && control.height >= 44)).toBeTruthy()
})

test('cropper exposes large handles and the primary action on a phone', async ({ page }) => {
  await openSamplePdf(page, '/pdf-cropper', '.cropper')
  await expect.poll(() => page.locator('.pdf-canvas').evaluate(canvas => canvas.clientWidth)).toBeGreaterThan(0)

  const metrics = await page.evaluate(() => {
    const download = document.querySelector('.cropper .tb-btn.accent')!.getBoundingClientRect()
    const handle = document.querySelector('.cropper .handle')!
    const handleRect = handle.getBoundingClientRect()
    const handleHitArea = getComputedStyle(handle, '::after')
    const hitInset = Math.abs(parseFloat(handleHitArea.top))
    return {
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      download: download.toJSON(),
      handleHitSize: handleRect.width + hitInset * 2,
      canvasWidth: document.querySelector('.cropper .pdf-canvas')!.getBoundingClientRect().width,
    }
  })

  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 2)
  expect(metrics.download.left).toBeGreaterThanOrEqual(0)
  expect(metrics.download.right).toBeLessThanOrEqual(metrics.viewportWidth)
  expect(metrics.handleHitSize).toBeGreaterThanOrEqual(44)
  expect(metrics.canvasWidth).toBeLessThanOrEqual(metrics.viewportWidth - 12)
})

test('watermark controls stack above a full-width preview on a phone', async ({ page }) => {
  await openSamplePdf(page, '/pdf-watermark', '.watermark-editor')
  await expect(page.locator('.watermark-page-frame')).toBeVisible({ timeout: 20_000 })

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector('.watermark-panel')!.getBoundingClientRect()
    const pages = document.querySelector('.watermark-pages')!.getBoundingClientRect()
    const frame = document.querySelector('.watermark-page-frame')!.getBoundingClientRect()
    return {
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      panel: panel.toJSON(),
      pages: pages.toJSON(),
      frame: frame.toJSON(),
      topbarControls: [...document.querySelectorAll('.watermark-topbar button')]
        .filter(button => getComputedStyle(button).display !== 'none')
        .map(button => button.getBoundingClientRect().height),
    }
  })

  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 2)
  expect(metrics.panel.width).toBeGreaterThanOrEqual(metrics.viewportWidth - 2)
  expect(metrics.panel.bottom).toBeLessThanOrEqual(metrics.pages.top + 1)
  expect(metrics.frame.width).toBeLessThanOrEqual(metrics.viewportWidth - 12)
  expect(metrics.topbarControls.every(height => height >= 44)).toBeTruthy()
})
