import path from 'node:path'
import { expect, test } from '@playwright/test'
import { validateToolFiles } from '../../src/components/ToolUploadAssist'
import {
  TOOL_WORKFLOW_STATES,
  classifyToolWorkflowError,
  type ToolWorkflowState,
} from '../../src/lib/toolWorkflowState'

const requiredStates: ToolWorkflowState[] = [
  'empty',
  'drag-over',
  'file-selected',
  'uploading',
  'processing',
  'success',
  'unsupported-file',
  'oversized-file',
  'password-protected',
  'corrupted-pdf',
  'network-failure',
  'ai-service-failure',
  'usage-limit-reached',
  'authentication-required',
  'payment-required',
  'cancelled',
  'retry',
]

function chromiumOnly(projectName: string) {
  test.skip(projectName !== 'chromium-laptop', 'One Chromium project covers the shared workflow-state contract')
}

test('all required states define a heading, explanation, next action, and semantic tone', async ({}, testInfo) => {
  chromiumOnly(testInfo.project.name)

  expect(Object.keys(TOOL_WORKFLOW_STATES).sort()).toEqual([...requiredStates].sort())

  for (const state of requiredStates) {
    const content = TOOL_WORKFLOW_STATES[state]
    expect(content.heading, `${state} heading`).not.toEqual('')
    expect(content.message, `${state} explanation`).not.toEqual('')
    expect(content.nextAction, `${state} next action`).not.toEqual('')
    expect(['neutral', 'info', 'success', 'warning', 'error', 'pro']).toContain(content.tone)
  }
})

test('file validation and failure classification cover recoverable upload errors', async ({}, testInfo) => {
  chromiumOnly(testInfo.project.name)

  expect(validateToolFiles(
    [{ name: 'notes.txt', type: 'text/plain', size: 20 }],
    '.pdf,application/pdf',
    'PDF',
    '100 MB',
  ).kind).toBe('unsupported-file')
  expect(validateToolFiles(
    [{ name: 'large.pdf', type: 'application/pdf', size: 101 * 1024 * 1024 }],
    '.pdf,application/pdf',
    'PDF',
    '100 MB',
  ).kind).toBe('oversized-file')

  expect(classifyToolWorkflowError(new Error('No password given'))).toBe('password-protected')
  expect(classifyToolWorkflowError(new Error('Invalid PDF structure'))).toBe('corrupted-pdf')
  expect(classifyToolWorkflowError(new TypeError('Failed to fetch'))).toBe('network-failure')
  expect(classifyToolWorkflowError(new Error('model temporarily unavailable'))).toBe('ai-service-failure')
  expect(classifyToolWorkflowError(new DOMException('cancelled', 'AbortError'))).toBe('cancelled')
  expect(classifyToolWorkflowError(new Error('try again'))).toBe('retry')
  expect(classifyToolWorkflowError(null, 401)).toBe('authentication-required')
  expect(classifyToolWorkflowError(null, 403)).toBe('payment-required')
  expect(classifyToolWorkflowError(null, 429)).toBe('usage-limit-reached')
})

test('API access gates use explicit authentication, usage, and payment states', async ({ page }, testInfo) => {
  chromiumOnly(testInfo.project.name)
  await page.route('**/api/workflow-*', async route => {
    const pathname = new URL(route.request().url()).pathname
    const status = pathname.endsWith('auth') ? 401 : pathname.endsWith('usage') ? 429 : 403
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ error: 'Test access gate' }) })
  })
  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-workflow-gates-ready]').waitFor({ state: 'attached' })

  await page.evaluate(() => fetch('/api/workflow-auth'))
  const signIn = page.getByRole('dialog', { name: 'Sign in to use AI tools' })
  await expect(signIn.locator('[data-workflow-state="authentication-required"]')).toBeVisible()
  await signIn.getByRole('button', { name: 'Close' }).click()

  await page.evaluate(() => fetch('/api/workflow-usage'))
  const usage = page.getByRole('dialog', { name: 'Daily limit reached' })
  await expect(usage.locator('[data-workflow-state="usage-limit-reached"]')).toBeVisible()
  await usage.getByRole('button', { name: 'Continue with Free tools' }).click()

  await page.evaluate(() => fetch('/api/workflow-payment'))
  const payment = page.getByRole('dialog', { name: 'Pro is required for this action' })
  await expect(payment.locator('[data-workflow-state="payment-required"]')).toBeVisible()
  await payment.getByRole('button', { name: 'Close' }).click()
})

test('network and AI failures can retry the original request without re-uploading', async ({ page }, testInfo) => {
  chromiumOnly(testInfo.project.name)
  let aiAttempts = 0
  let networkAttempts = 0
  await page.route('**/api/workflow-ai-retry', async route => {
    aiAttempts += 1
    if (aiAttempts === 1) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Internal trace hidden' }) })
      return
    }
    await new Promise(resolve => setTimeout(resolve, 150))
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
  await page.route('**/api/workflow-network-retry', async route => {
    networkAttempts += 1
    if (networkAttempts === 1) {
      await route.abort('failed')
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-workflow-gates-ready]').waitFor({ state: 'attached' })

  await page.evaluate(() => {
    void fetch('/api/workflow-ai-retry').then(response => response.json()).then(value => {
      ;(window as typeof window & { aiRetryResult?: unknown }).aiRetryResult = value
    })
  })
  const recovery = page.getByRole('complementary', { name: 'Request recovery' })
  await expect(recovery.locator('[data-workflow-state="ai-service-failure"]')).toBeVisible()
  await expect(recovery).not.toContainText('Internal trace hidden')
  await recovery.getByRole('button', { name: 'Retry AI action' }).click()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { aiRetryResult?: unknown }).aiRetryResult)).toEqual({ ok: true })
  await expect(recovery).toBeHidden()

  await page.evaluate(() => {
    void fetch('/api/workflow-network-retry').then(response => response.json()).then(value => {
      ;(window as typeof window & { networkRetryResult?: unknown }).networkRetryResult = value
    })
  })
  await expect(recovery.locator('[data-workflow-state="network-failure"]')).toBeVisible()
  await recovery.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { networkRetryResult?: unknown }).networkRetryResult)).toEqual({ ok: true })
  await expect(recovery).toBeHidden()
})

test('local processing can cancel, retry without re-uploading, and guard repeat downloads', async ({ page }, testInfo) => {
  chromiumOnly(testInfo.project.name)
  test.setTimeout(60_000)
  const fixture = path.join(process.cwd(), 'tests/fixtures/image-heavy.pdf')

  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('[data-tool-upload-assist]')).toBeVisible()
  await page.locator('#compressor-pdf-input').setInputFiles(fixture)
  await page.getByRole('button', { name: /Compress PDF/ }).click()
  const processing = page.locator('[data-workflow-state="processing"]')
  await expect(processing).toBeVisible()
  await processing.getByRole('button', { name: 'Cancel compression' }).click()
  const cancelled = page.locator('[data-workflow-state="cancelled"]')
  await expect(cancelled).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.file-name')).toContainText('image-heavy.pdf')
  await expect(cancelled.getByRole('button', { name: 'Retry' })).toBeVisible()

  await page.locator('#compressor-pdf-input').setInputFiles(path.join(process.cwd(), 'tests/fixtures/normal-test.pdf'))
  await page.getByRole('button', { name: /Compress PDF/ }).click()
  const success = page.locator('[data-workflow-state="success"]')
  await expect(success).toBeVisible({ timeout: 30_000 })
  const download = success.getByRole('button', { name: 'Download compressed PDF' })
  await download.click()
  const guarded = success.getByRole('button', { name: 'Download started' })
  await expect(guarded).toBeDisabled()
})

test('password-protected and corrupted PDFs get specific recovery guidance', async ({ page }, testInfo) => {
  chromiumOnly(testInfo.project.name)
  test.setTimeout(60_000)
  await page.goto('/pdf-compressor', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('[data-tool-upload-assist]')).toBeVisible()

  await page.locator('#compressor-pdf-input').setInputFiles(path.join(process.cwd(), 'tests/fixtures/password-protected.pdf'))
  await page.getByRole('button', { name: /Compress PDF/ }).click()
  const password = page.locator('[data-workflow-state="password-protected"]')
  await expect(password).toBeVisible({ timeout: 30_000 })
  await expect(password.getByRole('button', { name: 'Open Unlock PDF' })).toBeVisible()

  await page.locator('#compressor-pdf-input').setInputFiles(path.join(process.cwd(), 'tests/fixtures/corrupted.pdf'))
  await page.getByRole('button', { name: /Compress PDF/ }).click()
  const corrupted = page.locator('[data-workflow-state="corrupted-pdf"]')
  await expect(corrupted).toBeVisible({ timeout: 30_000 })
  await expect(corrupted.getByRole('button', { name: 'Open Repair PDF' })).toBeVisible()
})
