import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import {
  LEGAL_LAST_UPDATED_ISO,
  LEGAL_LAST_UPDATED_LABEL,
  SUPPORT_EMAIL,
  supportMailto,
} from '@/lib/entity'
import {
  AI_PROCESSING_SUMMARY,
  BROWSER_PROCESSING_SUMMARY,
  CONVERSION_PROCESSING_SUMMARY,
  OCR_PROCESSING_SUMMARY,
} from '@/lib/productMessaging'

const FI = 'var(--font-dm,system-ui,sans-serif)'
const MONO = 'var(--font-mono,monospace)'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: FI, fontSize: 18, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.03em', margin: '0 0 14px' }}>
        {title}
      </h2>
      <div style={{ fontFamily: FI, fontSize: 15, color: '#374151', lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 12px' }}>{children}</p>
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '0 0 12px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map(i => <li key={i}>{i}</li>)}
    </ul>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <SiteNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '100px 28px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af' }}>
            Legal
          </span>
          <h1 style={{ fontFamily: FI, fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.04em', margin: '10px 0 12px', lineHeight: 1.05 }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: MONO, fontSize: 11, color: '#9ca3af', letterSpacing: '0.06em' }}>
            Last updated: <time dateTime={LEGAL_LAST_UPDATED_ISO}>{LEGAL_LAST_UPDATED_LABEL}</time>
          </p>
        </div>

        {/* Key facts banner */}
        <div style={{ background: 'rgba(22,163,74,.06)', border: '1.5px solid rgba(22,163,74,.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 48 }}>
          <p style={{ fontFamily: FI, fontWeight: 700, fontSize: 14, color: '#15803d', margin: '0 0 10px' }}>🔒 The short version</p>
          <ul style={{ fontFamily: FI, fontSize: 14, color: '#374151', lineHeight: 1.65, margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <li>Core editing, page, signing, protection, and many conversion workflows process selected files in your browser.</li>
            <li>AI features may send <strong>extracted text, rendered page images, uploaded images, or a PDF</strong> through EditPDF AI server routes to configured processing providers.</li>
            <li>The application code does not write document content to its database or object storage. Processing providers handle request data under their own terms and policies.</li>
            <li>Payment fields are provided by <strong>Stripe</strong>; EditPDF AI stores subscription identifiers and status rather than card numbers.</li>
          </ul>
        </div>

        <Section title="1. What we collect">
          <P>When you use EditPDF AI, we may collect:</P>
          <Ul items={[
            'Account information when you sign up (name, email address) via Clerk',
            'Usage data: which tools you use and how many AI features you access per day',
            'Payment fields and billing details are handled by Stripe. EditPDF AI stores the customer, subscription, price, and status identifiers needed to administer access; it does not receive a full card number from those fields.',
            'Configured analytics events such as page paths, page titles, referrers, and deliberately named product events',
          ]} />
          <P>Document content is handled only when needed for the core browser workflow or AI feature you trigger. The application does not insert PDF, image, or extracted-text content into its Supabase tables or an object-storage bucket.</P>
        </Section>

        <Section title="2. How your files are processed">
          <P><strong>Browser-based PDF tools.</strong> {BROWSER_PROCESSING_SUMMARY}</P>
          <P><strong>Conversion tools.</strong> {CONVERSION_PROCESSING_SUMMARY}</P>
          <P><strong>OCR.</strong> {OCR_PROCESSING_SUMMARY}</P>
          <P><strong>AI tools.</strong> {AI_PROCESSING_SUMMARY}</P>
          <P>Summaries, chat, translations, mind maps, quizzes, and other text-based AI actions send extracted document text. Scan detection and visual form-field detection send rendered page images. Form-filling workflows can send user-entered details, an identity-document image, a rendered form page, or a complete PDF when document-level context is requested.</P>
          <P>Some form-processing routes can also forward a PDF to the configured document-processing backend. Request bodies are handled by the application server and applicable processing provider. This codebase does not establish or control a provider-wide deletion schedule, so the provider&apos;s own retention terms also apply.</P>
        </Section>

        <Section title="3. Cookies and analytics">
          <P>The site includes Vercel Speed Insights for web-performance telemetry. When their environment identifiers are configured, it also loads Cloudflare Web Analytics, PostHog, and Google Analytics 4.</P>
          <P>PostHog is configured with in-memory persistence, cookieless page views and named product events, person profiles set to &ldquo;never,&rdquo; and session recording disabled. Google Analytics starts with analytics and advertising storage denied, Google signals disabled, and advertising personalisation disabled. EditPDF AI&apos;s analytics calls remove URL query strings and do not deliberately send document content, file names, or email addresses.</P>
          <P>Authentication (sign-in sessions) uses cookies managed by Clerk. These are necessary for keeping you signed in and are not used for advertising.</P>
        </Section>

        <Section title="4. Third-party services">
          <Ul items={[
            'Clerk — authentication and user account management (clerk.com)',
            'Stripe — payment fields and subscription processing. EditPDF AI stores Stripe customer/subscription identifiers, price identifiers, and subscription status.',
            'Anthropic (Claude) — processing of extracted text, rendered page images, uploaded images, and PDFs for the AI features described above. Anthropic\'s terms and privacy policy apply to data its API receives.',
            'Configured document-processing backend — form detection or filling routes may forward a PDF to the backend URL configured for that service.',
            'Supabase — database for subscription status and daily AI usage counts. No document content is stored.',
            'Vercel Speed Insights — web-performance telemetry.',
            'Cloudflare Web Analytics — traffic and performance measurement when its site token is configured.',
            'PostHog — cookieless aggregate page views and deliberately named feature-usage events; session recording and individual profiles are disabled.',
            'Google Analytics 4 — cookieless aggregate page views and traffic attribution; advertising storage and personalisation are disabled.',
            'Third-party content delivery networks — some browser tools load required PDF workers, conversion libraries, or fonts. Those requests fetch software assets; EditPDF AI does not deliberately attach the selected document to them.',
          ]} />
        </Section>

        <Section title="5. Data retention">
          <P>Clerk manages account identity. EditPDF AI&apos;s database stores subscription records and one dated AI usage-count row used to enforce the free daily allowance.</P>
          <P>No automated deletion schedule for AI usage-count rows is implemented in this codebase. Contact support to request review or deletion of account-associated data, subject to records that must be retained for subscription or service administration.</P>
          <P>The application does not deliberately persist PDF, image, file-name, or extracted-document content in its database or object storage. Server and processing-provider handling remains subject to their operational logs and retention policies.</P>
        </Section>

        <Section title="6. Your rights">
          <P>Depending on applicable law, you may be able to request:</P>
          <Ul items={[
            'The right to access the data we hold about you',
            'The right to request deletion of your account and associated data',
            'The right to correct inaccurate information',
            'The right to data portability',
          ]} />
          <P>To make a request, email us at <a href={supportMailto()} style={{ color: '#0891b2', fontWeight: 600 }}>{SUPPORT_EMAIL}</a>. The request will be reviewed and the data and options available for the associated account will be explained.</P>
        </Section>

        <Section title="7. Security">
          <P>Production URLs are normalized to HTTPS. Subscription and AI usage database access uses server-side credentials. No security control makes processing risk-free; review the feature-specific data flow before submitting sensitive material to an AI feature.</P>
        </Section>

        <Section title="8. Children">
          <P>EditPDF AI is not directed to children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us personal information, please contact us and we will delete it.</P>
        </Section>

        <Section title="9. Changes to this policy">
          <P>We may update this policy from time to time. Material changes will be announced on this page with an updated date. Continued use of the service after changes constitutes acceptance.</P>
        </Section>

        <Section title="10. Contact">
          <P>For privacy questions, data deletion requests, or any concerns:</P>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px', display: 'inline-block' }}>
            <p style={{ margin: 0, fontFamily: FI, fontSize: 14, color: '#1d1d1f', fontWeight: 600 }}>EditPDF AI</p>
            <p style={{ margin: '4px 0 0', fontFamily: FI, fontSize: 14, color: '#6b7280' }}>
              <a href={supportMailto()} style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>{SUPPORT_EMAIL}</a>
            </p>
          </div>
        </Section>

      </main>

      <SiteFooter />
    </div>
  )
}
