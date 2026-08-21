import { expect, test } from '@playwright/test'
import toolMeta from '../../src/lib/toolMeta'
import {
  PRODUCT_PRIORITY_TOOL_SLUGS,
  TOOL_CATEGORIES,
  searchTools,
} from '../../src/lib/toolDiscovery'

function chromiumLaptopOnly(projectName: string) {
  test.skip(projectName !== 'chromium-laptop', 'One Chromium project covers deterministic navigation interactions')
}

test('the discovery model covers every registered tool once in the seven required categories', async ({}, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)

  expect(TOOL_CATEGORIES.map(category => category.label)).toEqual([
    'AI tools',
    'Edit and annotate',
    'Convert',
    'Organize pages',
    'Compress',
    'Protect and sign',
    'Extract and export',
  ])

  const categorized = TOOL_CATEGORIES.flatMap(category => category.slugs)
  expect(new Set(categorized).size).toBe(categorized.length)
  expect([...categorized].sort()).toEqual(toolMeta.map(tool => tool.slug).sort())
  expect(new Set(PRODUCT_PRIORITY_TOOL_SLUGS).size).toBe(PRODUCT_PRIORITY_TOOL_SLUGS.length)
  expect(PRODUCT_PRIORITY_TOOL_SLUGS.every(slug => toolMeta.some(tool => tool.slug === slug))).toBeTruthy()
})

test('tool search matches common tasks and synonyms, not only names', async ({}, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)

  const expected = [
    ['combine files', 'pdf-merger'],
    ['shrink email attachment', 'pdf-compressor'],
    ['add a signature', 'pdf-signer'],
    ['make searchable pdf', 'pdf-ocr'],
    ['jpg to pdf', 'image-to-pdf'],
    ['remove password', 'pdf-unlock'],
  ] as const

  for (const [query, slug] of expected) {
    expect(searchTools(query).map(tool => tool.slug), query).toContain(slug)
  }
})

test('the All Tools directory exposes search, access labels, priorities, and all categories', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#tools', { waitUntil: 'domcontentloaded' })

  const directory = page.locator('#tools')
  const search = directory.getByRole('searchbox', { name: 'Search all PDF tools' })
  await expect(search).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Popular tools' })).toBeVisible()
  await expect(page.getByText('Verified product priorities').first()).toBeVisible()

  const legend = directory.getByLabel('Tool access labels')
  await expect(legend).toContainText('Free')
  await expect(legend).toContainText('AI')
  await expect(legend).toContainText('Pro')

  for (const category of TOOL_CATEGORIES) {
    await expect(directory.getByRole('heading', { name: category.label })).toBeVisible()
  }

  await search.fill('combine files')
  await expect(directory.getByRole('status')).toContainText(/tools? found/)
  await expect(directory.getByRole('link', { name: /PDF Merger: Combine multiple PDFs/ })).toBeVisible()

  await search.fill('remove password')
  await expect(directory.getByRole('link', { name: /Unlock PDF: Remove a known password/ })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBeTruthy()
})

test('desktop category navigation is click and keyboard accessible and marks the current tool', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.setViewportSize({ width: 1024, height: 800 })
  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })

  const trigger = page.getByRole('button', { name: /Browse tool categories/ })
  const headingTop = await page.locator('h1').evaluate(element => element.getBoundingClientRect().top)
  await trigger.click()
  const menu = page.getByRole('navigation', { name: 'Tool categories' })
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('link', { name: /PDF Compressor/ })).toHaveAttribute('aria-current', 'page')
  expect(await page.locator('h1').evaluate(element => element.getBoundingClientRect().top)).toBe(headingTop)

  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.press('ArrowDown')
  await expect(menu).toBeVisible()
  await expect(menu.locator('a').first()).toBeFocused()
})

test('mobile navigation traps focus, restores focus, and keeps categories collapsible', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })

  const trigger = page.getByRole('button', { name: 'Open navigation menu' })
  await trigger.click()
  const drawer = page.getByRole('dialog', { name: 'Menu' })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('button', { name: 'Close navigation menu' })).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')

  const compressCategory = drawer.getByRole('button', { name: /Compress/ })
  await expect(compressCategory).toHaveAttribute('aria-expanded', 'true')
  await expect(drawer.getByRole('link', { name: /PDF Compressor/ })).toHaveAttribute('aria-current', 'page')
  await compressCategory.click()
  await expect(compressCategory).toHaveAttribute('aria-expanded', 'false')

  const lastAction = drawer.getByRole('link', { name: 'Open PDF Editor' })
  await drawer.getByRole('button', { name: 'Close navigation menu' }).focus()
  await page.keyboard.press('Shift+Tab')
  await expect(lastAction).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
})

test('breadcrumbs and the mobile footer provide concise discovery paths', async ({ page }, testInfo) => {
  chromiumLaptopOnly(testInfo.project.name)
  await page.setViewportSize({ width: 390, height: 844 })

  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })
  const toolBreadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(toolBreadcrumb).toContainText('All tools')
  await expect(toolBreadcrumb).toContainText('Compress')

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const footerGroups = page.locator('.sf-mobile-cols details')
  await expect(footerGroups).toHaveCount(4)
  for (let index = 0; index < await footerGroups.count(); index += 1) {
    expect(await footerGroups.nth(index).locator('a').count()).toBeLessThanOrEqual(9)
  }

  await page.goto('/guides/how-to-reduce-pdf-file-size', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await expect(page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Guides', exact: true })).toHaveAttribute('aria-current', 'page')
  await page.keyboard.press('Escape')
  const guideBreadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(guideBreadcrumb).toContainText('Guides')
  await expect(guideBreadcrumb).toContainText('How to Reduce PDF File Size')
})
