import { defineConfig, devices } from '@playwright/test';

const viewports = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1366, height: 768 }, touch: false },
  { name: 'desktop', viewport: { width: 1920, height: 1080 }, touch: false },
] as const;

const engines = [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'firefox', use: devices['Desktop Firefox'] },
  { name: 'webkit', use: devices['Desktop Safari'] },
] as const;

export default defineConfig({
  testDir: './tests/responsive',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: engines.flatMap((engine) =>
    viewports.map((device) => ({
      name: `${engine.name}-${device.name}`,
      use: {
        ...engine.use,
        viewport: device.viewport,
        hasTouch: device.touch,
        isMobile: device.touch,
      },
    })),
  ),
  webServer: {
    command: 'npm run start -- -p 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
