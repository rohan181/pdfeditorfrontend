import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/qa',
  testMatch: ['seo-metadata.spec.ts', 'crawling-indexing.spec.ts', 'product-messaging.spec.ts', 'structured-data.spec.ts', 'tool-seo-content.spec.ts', 'trust-entity-signals.spec.ts', 'final-production-validation.spec.ts', 'priority-tools.spec.ts'],
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3101',
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run start -- -p 3101',
        url: 'http://127.0.0.1:3101',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
