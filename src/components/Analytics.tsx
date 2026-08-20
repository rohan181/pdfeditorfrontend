import Script from 'next/script'
import AnalyticsRouteTracker from '@/components/AnalyticsRouteTracker'

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
const cloudflareToken = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim()

function serializeForInlineScript(value: string): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export default function Analytics() {
  const hasEventAnalytics = Boolean(googleAnalyticsId || posthogProjectToken)

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script id="google-analytics-bootstrap" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
              window.gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              window.gtag('js', new Date());
              window.gtag('config', ${serializeForInlineScript(googleAnalyticsId)}, {
                send_page_view: false,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
          <Script
            id="google-analytics"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
            strategy="lazyOnload"
          />
        </>
      )}

      {cloudflareToken && (
        <Script
          id="cloudflare-web-analytics"
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: cloudflareToken })}
          strategy="lazyOnload"
        />
      )}

      {hasEventAnalytics && <AnalyticsRouteTracker />}
    </>
  )
}
