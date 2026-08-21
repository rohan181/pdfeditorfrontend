import { expect, test } from '@playwright/test'

const requiredWidths = [320, 375, 390, 768, 1024, 1440] as const

test('homepage keeps the primary journey clear at required breakpoints', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  test.skip(testInfo.project.name !== 'chromium-laptop', 'One Chromium project covers the explicit breakpoint matrix')

  for (const width of requiredWidths) {
    const height = width === 320 ? 568 : width === 375 ? 667 : width === 390 ? 844 : width === 768 ? 1024 : width === 1024 ? 768 : 900
    await page.setViewportSize({ width, height })
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })
    expect(response?.ok(), `${width}px homepage should load`).toBeTruthy()

    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText('Edit, sign and transform PDFs in your browser.')

    const upload = page.getByRole('link', { name: 'Upload PDF', exact: true }).first()
    const browse = page.getByRole('link', { name: 'Browse all tools', exact: true })
    await expect(upload).toBeVisible()
    await expect(browse).toBeVisible()

    const metrics = await page.evaluate(() => {
      const uploadRect = document.querySelector('.constellation-primary')!.getBoundingClientRect()
      const stage = document.querySelector('.constellation-stage') as HTMLElement
      const core = document.querySelector('.constellation-core') as HTMLElement
      const visibleNodes = Array.from(document.querySelectorAll<HTMLElement>('.constellation-node'))
        .filter(node => getComputedStyle(node).display !== 'none')
      const nodeRects = visibleNodes.map(node => node.getBoundingClientRect().toJSON())
      const overlaps = nodeRects.flatMap((first, index) => nodeRects.slice(index + 1).filter(second => (
        first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top
      )))
      const sectionOrder = ['.ds-popular-tools', '#tools', '#how-it-works-detail, .home-scroll-placeholder', '#privacy', '.use-case-tabs', '.ds-pricing-preview', '.faq-item', '.site-cta-sec']
        .map(selector => document.querySelector(selector)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY)

      return {
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        upload: uploadRect.toJSON(),
        uploadInInitialViewport: uploadRect.top >= 0 && uploadRect.bottom <= window.innerHeight,
        visibleOrbitTools: visibleNodes.length,
        coreVisible: getComputedStyle(core).display !== 'none',
        overlaps: overlaps.length,
        stageOffsetHeight: stage.offsetHeight,
        sectionOrder,
      }
    })

    expect(metrics.documentWidth, `${width}px should not overflow horizontally`).toBeLessThanOrEqual(metrics.viewportWidth + 2)
    expect(metrics.upload.height, `${width}px upload CTA touch height`).toBeGreaterThanOrEqual(44)
    expect(metrics.uploadInInitialViewport, `${width}px upload CTA should be immediately visible`).toBeTruthy()
    expect(metrics.visibleOrbitTools, `${width}px orbit simplification`).toBe(width <= 560 ? 4 : 8)
    expect(metrics.coreVisible, `${width}px orbit fallback`).toBe(width > 560)
    expect(metrics.overlaps, `${width}px orbit cards should not overlap`).toBe(0)
    expect(metrics.sectionOrder.every((top, index, values) => index === 0 || top >= values[index - 1]), `${width}px section order`).toBeTruthy()

    const initialHeight = metrics.stageOffsetHeight
    await page.waitForTimeout(120)
    await expect.poll(() => page.locator('.constellation-stage').evaluate(stage => (stage as HTMLElement).offsetHeight)).toBe(initialHeight)
  }
})

test('orbit pauses for keyboard interaction and reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-laptop', 'One Chromium project covers deterministic motion checks')

  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const firstOrbitTool = page.getByRole('link', { name: 'Edit: Text & images' })
  await firstOrbitTool.focus()
  await expect(page.locator('.constellation-stage')).toHaveClass(/is-paused/)
  await expect(firstOrbitTool).toBeFocused()
  expect(await firstOrbitTool.evaluate(link => getComputedStyle(link).outlineWidth)).not.toBe('0px')
  expect(await page.locator('.constellation-core').evaluate(core => getComputedStyle(core).animationPlayState)).toBe('paused')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload({ waitUntil: 'domcontentloaded' })
  expect(await page.locator('.constellation-core').evaluate(core => getComputedStyle(core).animationName)).toBe('none')
  expect(await page.locator('.constellation-pulse').first().evaluate(pulse => getComputedStyle(pulse).animationName)).toBe('none')
  expect(await page.locator('.hero-fade-in-scale').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none')
})
