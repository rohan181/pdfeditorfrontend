import path from 'node:path'
import { expect, test } from '@playwright/test'
import toolMeta from '../../src/lib/toolMeta'

function chromiumOnly(projectName: string) {
  test.skip(projectName !== 'chromium-laptop', 'One Chromium project covers the shared tool workflow contract')
}

test('every registered tool server-renders the same workflow and access contract', async ({ request }, testInfo) => {
  chromiumOnly(testInfo.project.name)

  const pages = await Promise.all(toolMeta.map(async tool => {
    const response = await request.get(`/${tool.slug}`)
    return { tool, response, html: await response.text() }
  }))

  for (const { tool, response, html } of pages) {
    expect(response.status(), tool.slug).toBe(200)
    expect(html, `${tool.slug} should server-render the workflow`).toContain('data-tool-workflow="true"')
    expect(html, `${tool.slug} should show the select-first sequence`).toContain('Standard tool workflow')
    expect(html, `${tool.slug} should explain disabled processing`).toContain('Why is Process unavailable?')
    expect(html, `${tool.slug} should provide recovery instructions`).toContain('If something goes wrong:')
    if (tool.slug !== 'ai-pdf-form-filler') {
      expect(html, `${tool.slug} should retain related tools after the task`).toContain('Continue with a related tool')
    } else {
      expect(html, `${tool.slug} should retain its custom related-tool cards`).toContain('related-card')
    }

    const accessLabel = tool.access === 'core'
      ? 'data-access-label="Free"'
      : tool.access === 'core-with-ai'
        ? 'data-access-label="Free core · optional AI"'
        : 'data-access-label="AI · Free allowance + Pro"'
    expect(html, `${tool.slug} should identify access before processing`).toContain(accessLabel)
  }
})

test('shared upload guidance validates selection and remains contained on phones', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  chromiumOnly(testInfo.project.name)
  const fixture = path.join(process.cwd(), 'tests/fixtures/normal-test.pdf')
  const unsupported = path.join(process.cwd(), 'tests/fixtures/unsupported.exe')

  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 720 })
    await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })

    const assist = page.locator('[data-tool-upload-assist]')
    await expect(assist).toBeVisible()
    await expect(assist).toContainText('Supported:')
    await expect(assist).toContainText('Privacy:')
    expect(await assist.evaluate(element => {
      const rect = element.getBoundingClientRect()
      return rect.left >= -1 && rect.right <= document.documentElement.clientWidth + 1
    })).toBeTruthy()

    const input = page.locator('#compressor-pdf-input')
    await expect(input).toHaveAttribute('aria-label', /Choose supported file/)
    await input.setInputFiles(unsupported)
    await expect(assist.locator('[data-workflow-state="unsupported-file"]')).toContainText('This file type is not supported')

    await input.setInputFiles(fixture)
    await expect(assist.locator('[data-workflow-state="file-selected"]')).toContainText('passed the available browser checks')
    await expect(assist.locator('progress')).toHaveAttribute('value', '100')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBeTruthy()
  }
})

test('generated PDFs expose preview, download, guarded restart, and related actions', async ({ page }, testInfo) => {
  chromiumOnly(testInfo.project.name)
  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })

  await expect.poll(async () => page.evaluate(() => {
    const blob = new Blob(['%PDF-1.4 test'], { type: 'application/pdf' })
    window.dispatchEvent(new CustomEvent('editpdfai:pdf-ready', { detail: { blob, name: 'compressed-test.pdf' } }))
    return document.querySelector('.pdf-result-dock') !== null
  })).toBeTruthy()

  const dock = page.getByRole('complementary', { name: 'PDF actions' })
  await expect(dock).toContainText('Result ready')
  await expect(dock.getByRole('button', { name: 'Preview PDF' })).toBeVisible()
  await expect(dock.getByRole('button', { name: 'Download PDF' })).toBeVisible()
  await expect(dock.getByRole('button', { name: 'Process another' })).toBeVisible()
  await expect(dock.getByRole('navigation', { name: 'Related tools for the completed PDF' }).getByRole('link')).toHaveCount(2)

  page.once('dialog', dialog => dialog.dismiss())
  await dock.getByRole('button', { name: 'Process another' }).click()
  await expect(dock).toBeVisible()
})
