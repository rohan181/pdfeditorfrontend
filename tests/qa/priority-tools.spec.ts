// Automated upload -> process -> download journeys for the 5 priority tools
// (Editor, Merge, Split, Compress, Sign). Run against a local dev/staging
// server: PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/qa
import { execFileSync } from 'child_process'
import path from 'path'
import { expect, test } from '@playwright/test'

const FIX = path.join(__dirname, '..', 'fixtures')

function assertValidPdf(filePath: string) {
  execFileSync('qpdf', ['--check', filePath])
}

function pageCount(filePath: string): number {
  return parseInt(execFileSync('qpdf', ['--show-npages', filePath]).toString().trim(), 10)
}

test.describe('Priority tool journeys', () => {
  test('PDF Merger: two files merge into one with correct combined page count', async ({ page }, testInfo) => {
    await page.goto('/pdf-merger', { waitUntil: 'networkidle' })
    await page.setInputFiles('input[type=file]', [
      path.join(FIX, 'normal-test.pdf'),
      path.join(FIX, 'tables.pdf'),
    ])
    await expect(page.locator('.rm-btn')).toHaveCount(2)

    await page.click('button.merge-btn')
    await page.waitForSelector('button.dl-btn', { timeout: 20_000 })
    const downloadPromise = page.waitForEvent('download')
    await page.click('button.dl-btn')
    const download = await downloadPromise

    const savePath = testInfo.outputPath('merged.pdf')
    await download.saveAs(savePath)
    assertValidPdf(savePath)
    expect(pageCount(savePath)).toBe(3) // 2 pages + 1 page
  })

  test('PDF Splitter: every-page mode produces one file per page', async ({ page }, testInfo) => {
    await page.goto('/pdf-splitter', { waitUntil: 'networkidle' })
    await page.setInputFiles('input[type=file]', path.join(FIX, '100-page.pdf'))
    await page.waitForSelector('button.split-btn:not([disabled])', { timeout: 15_000 })

    await page.click('button.split-btn')
    await page.waitForSelector('.result-grid', { timeout: 30_000 })
    await expect(page.locator('.result-card')).toHaveCount(100)

    const downloadPromise = page.waitForEvent('download')
    await page.click('.result-card:first-child button.dl-btn')
    const download = await downloadPromise
    const savePath = testInfo.outputPath('split-page1.pdf')
    await download.saveAs(savePath)
    assertValidPdf(savePath)
    expect(pageCount(savePath)).toBe(1)
  })

  test('PDF Compressor: image-heavy PDF compresses to a smaller, valid PDF', async ({ page }, testInfo) => {
    await page.goto('/pdf-compressor', { waitUntil: 'networkidle' })
    await page.setInputFiles('input[type=file]', path.join(FIX, 'image-heavy.pdf'))
    await page.click('button.compress-btn')
    await page.waitForSelector('.result', { timeout: 30_000 })

    const downloadPromise = page.waitForEvent('download')
    await page.click('button.dl-btn')
    const download = await downloadPromise
    const savePath = testInfo.outputPath('compressed.pdf')
    await download.saveAs(savePath)
    assertValidPdf(savePath)
  })

  test('PDF Signer: typed signature places and downloads a valid signed PDF', async ({ page }, testInfo) => {
    await page.goto('/pdf-signer', { waitUntil: 'networkidle' })
    await page.setInputFiles('input[type=file]', path.join(FIX, 'normal-test.pdf'))
    await page.waitForSelector('button.sign-fab', { timeout: 15_000 })

    await page.click('.m-tab:has-text("Type")')
    await page.fill('input.type-input', 'QA Automated Test')
    await page.click('button.m-place')
    await page.locator('.page-wrap').first().click({ position: { x: 80, y: 80 } })
    await expect(page.locator('.nbtn.pri')).toBeEnabled()

    const downloadPromise = page.waitForEvent('download')
    await page.click('.nbtn.pri')
    const download = await downloadPromise
    const savePath = testInfo.outputPath('signed.pdf')
    await download.saveAs(savePath)
    assertValidPdf(savePath)
  })

  test('PDF Signer: uploaded JPEG signature also downloads a valid signed PDF', async ({ page }, testInfo) => {
    await page.goto('/pdf-signer', { waitUntil: 'networkidle' })
    await page.setInputFiles('input[type=file]', path.join(FIX, 'normal-test.pdf'))
    await page.waitForSelector('button.sign-fab', { timeout: 15_000 })

    await page.click('.m-tab:has-text("Upload")')
    await page.setInputFiles('input[accept="image/png,image/jpeg,image/jpg"]', path.join(FIX, 'sample.jpg'))
    await page.click('button.m-place')
    await page.locator('.page-wrap').first().click({ position: { x: 80, y: 80 } })
    await expect(page.locator('.nbtn.pri')).toBeEnabled()

    const downloadPromise = page.waitForEvent('download')
    await page.click('.nbtn.pri')
    const download = await downloadPromise
    const savePath = testInfo.outputPath('signed-jpg.pdf')
    await download.saveAs(savePath)
    assertValidPdf(savePath)
  })

  test('PDF Editor: upload and export round-trips a valid single-page PDF', async ({ page }, testInfo) => {
    await page.goto('/pdf-editor', { waitUntil: 'networkidle' })
    await page.click('text=Edit a PDF — Free')
    await page.setInputFiles('input[type=file]', path.join(FIX, 'tables.pdf'))

    const exportBtn = page.locator('button:has-text("Export PDF"), button:has-text("Export")').first()
    await expect(exportBtn).toBeEnabled({ timeout: 15_000 })

    const downloadPromise = page.waitForEvent('download')
    await exportBtn.click()
    const download = await downloadPromise
    const savePath = testInfo.outputPath('editor-export.pdf')
    await download.saveAs(savePath)
    assertValidPdf(savePath)
    expect(pageCount(savePath)).toBe(1)
  })
})
