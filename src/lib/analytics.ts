'use client'

import type { PostHog } from 'posthog-js'

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com'

let posthogPromise: Promise<PostHog | null> | null = null

function withoutQueryOrHash(value: string): string {
  try {
    const url = new URL(value, window.location.origin)
    return `${url.origin}${url.pathname}`
  } catch {
    return value.split(/[?#]/, 1)[0]
  }
}

function getPostHog(): Promise<PostHog | null> {
  if (!posthogProjectToken) return Promise.resolve(null)

  if (!posthogPromise) {
    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      if (!posthog.__loaded) {
        posthog.init(posthogProjectToken, {
          api_host: posthogHost,
          defaults: '2026-05-30',
          cookieless_mode: 'always',
          person_profiles: 'never',
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
          capture_dead_clicks: false,
          capture_exceptions: false,
          capture_heatmaps: false,
          capture_performance: false,
          disable_session_recording: true,
          disable_surveys: true,
          respect_dnt: true,
          before_send: event => {
            if (!event?.properties) return event

            for (const property of ['$current_url', '$referrer']) {
              const value = event.properties[property]
              if (typeof value === 'string') {
                event.properties[property] = withoutQueryOrHash(value)
              }
            }

            return event
          },
        })
      }

      return posthog
    })
  }

  return posthogPromise
}

/**
 * Sends one deliberately named product event to each configured event provider.
 * Do not include document text, file names, email addresses, or other personal data.
 */
export async function trackEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
): Promise<void> {
  if (googleAnalyticsId) {
    window.gtag?.('event', eventName, properties)
  }

  const posthog = await getPostHog()
  posthog?.capture(eventName, properties)
}

export async function trackPageView(pathname: string): Promise<void> {
  const pagePath = pathname.split(/[?#]/, 1)[0] || '/'
  const pageLocation = `${window.location.origin}${pagePath}`

  if (googleAnalyticsId) {
    window.gtag?.('event', 'page_view', {
      page_location: pageLocation,
      page_path: pagePath,
      page_title: document.title,
    })
  }

  const posthog = await getPostHog()
  posthog?.capture('$pageview', {
    $current_url: pageLocation,
    page_path: pagePath,
  })
}

