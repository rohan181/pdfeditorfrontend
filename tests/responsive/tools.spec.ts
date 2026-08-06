import { expect, test } from '@playwright/test';

const toolRoutes = [
  '/add-page-numbers', '/delete-pages', '/excel-to-pdf', '/extract-pages',
  '/html-to-pdf', '/image-to-pdf', '/mind-map', '/odt-to-pdf',
  '/pdf-annotate', '/pdf-compressor', '/pdf-cropper', '/pdf-editor',
  '/pdf-form-builder', '/pdf-merger', '/pdf-ocr', '/pdf-page-manager',
  '/pdf-password-lock', '/pdf-redactor', '/pdf-signer', '/pdf-splitter',
  '/pdf-summarizer', '/pdf-to-excel', '/pdf-to-images', '/pdf-to-ppt',
  '/pdf-to-word', '/pdf-translator', '/pdf-viewer', '/pdf-watermark',
  '/ppt-to-pdf', '/quiz-creator', '/rotate-pdf', '/rtf-to-pdf',
  '/txt-to-pdf', '/word-to-pdf',
] as const;

for (const route of toolRoutes) {
  test(`${route} has a usable responsive shell`, async ({ page }, testInfo) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), `${route} should load successfully`).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();

    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const viewportWidth = root.clientWidth;
      const visible = (element: Element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
      };

      const tinyButtons = navigator.maxTouchPoints > 0 ? [...document.querySelectorAll('button,[role="button"]')]
        .filter(visible)
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width < 32 || rect.height < 32;
        })
        .slice(0, 8)
        .map((element) => ({
          label: (element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 50),
          width: Math.round(element.getBoundingClientRect().width),
          height: Math.round(element.getBoundingClientRect().height),
        })) : [];

      return {
        viewportWidth,
        scrollWidth: root.scrollWidth,
        tinyButtons,
        title: document.title,
      };
    });

    expect(result.title, 'page should have a meaningful title').not.toBe('');
    expect(result.scrollWidth, `document overflow: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportWidth + 2);
    expect(result.tinyButtons, `undersized controls: ${JSON.stringify(result.tinyButtons)}`).toEqual([]);

    await testInfo.attach('responsive-metrics', {
      body: Buffer.from(JSON.stringify(result, null, 2)),
      contentType: 'application/json',
    });
  });
}
