import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

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
  const updated = 'July 1, 2025'

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
            Last updated: {updated}
          </p>
        </div>

        {/* Key facts banner */}
        <div style={{ background: 'rgba(22,163,74,.06)', border: '1.5px solid rgba(22,163,74,.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 48 }}>
          <p style={{ fontFamily: FI, fontWeight: 700, fontSize: 14, color: '#15803d', margin: '0 0 10px' }}>🔒 The short version</p>
          <ul style={{ fontFamily: FI, fontSize: 14, color: '#374151', lineHeight: 1.65, margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <li>Your PDF files are processed <strong>entirely in your browser</strong> — they are never uploaded to our servers.</li>
            <li>AI features send <strong>only the required text context</strong> (not the raw file) for processing.</li>
            <li>We do not store your files, documents, or PDF content.</li>
            <li>Payment is handled by <strong>Stripe</strong> — we never see or store your card details.</li>
          </ul>
        </div>

        <Section title="1. What we collect">
          <P>When you use EditPDF AI, we may collect:</P>
          <Ul items={[
            'Account information when you sign up (name, email address) via Clerk',
            'Usage data: which tools you use and how many AI features you access per day',
            'Billing information is handled entirely by Stripe — we receive only a subscription status (active/inactive), never card details',
            'Standard web analytics (page views, referrers) through anonymised analytics tools',
          ]} />
          <P>We do <strong>not</strong> collect your PDF files, document contents, or any text extracted from your files beyond what is transiently processed for an AI feature you explicitly trigger.</P>
        </Section>

        <Section title="2. How your files are processed">
          <P>All core PDF tools (merge, split, compress, rotate, watermark, edit, sign, etc.) run <strong>entirely in your browser</strong> using client-side JavaScript libraries. Your files never leave your device for these operations.</P>
          <P>When you use an AI-powered feature (Summarizer, Form Filler, Translator, Mind Map, Quiz Creator, OCR), the relevant <strong>text content</strong> extracted from your PDF is sent to our AI provider (Anthropic / Claude) for processing. The raw PDF binary file is never transmitted.</P>
          <P>We do not store, log, or retain any document content sent for AI processing beyond the time required to return a response to you.</P>
        </Section>

        <Section title="3. Cookies and analytics">
          <P>We use minimal, privacy-friendly analytics to understand how the site is used (page visits, feature usage). No cross-site tracking cookies are set.</P>
          <P>Authentication (sign-in sessions) uses cookies managed by Clerk. These are necessary for keeping you signed in and are not used for advertising.</P>
        </Section>

        <Section title="4. Third-party services">
          <Ul items={[
            'Clerk — authentication and user account management (clerk.com)',
            'Stripe — payment processing for Pro subscriptions. Stripe processes card data under PCI-DSS compliance. We store only your Stripe customer ID and subscription status.',
            'Anthropic (Claude) — AI text processing for AI features. Text context from your PDF is sent to Anthropic\'s API. Anthropic\'s privacy policy applies to data they receive.',
            'Supabase — database for subscription status and daily AI usage counts. No document content is stored.',
          ]} />
        </Section>

        <Section title="5. Data retention">
          <P>Account data (name, email, subscription status) is retained while your account is active. You may request deletion at any time by contacting us.</P>
          <P>Daily AI usage counts (a simple integer per user per day) are retained for 30 days to enforce free-tier limits, then deleted.</P>
          <P>No PDF content, file names, or document text is stored beyond the duration of a single AI request.</P>
        </Section>

        <Section title="6. Your rights">
          <P>Depending on where you are located, you may have rights including:</P>
          <Ul items={[
            'The right to access the data we hold about you',
            'The right to request deletion of your account and associated data',
            'The right to correct inaccurate information',
            'The right to data portability',
          ]} />
          <P>To exercise any of these rights, email us at <a href="mailto:support@editpdfai.com" style={{ color: '#0891b2', fontWeight: 600 }}>support@editpdfai.com</a>. We will respond within 30 days.</P>
        </Section>

        <Section title="7. Security">
          <P>We use HTTPS for all data in transit. Our database is hosted on Supabase with row-level security. We do not store raw PDFs or document content, which significantly limits exposure in any security event.</P>
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
              <a href="mailto:support@editpdfai.com" style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>support@editpdfai.com</a>
            </p>
          </div>
        </Section>

      </main>

      <SiteFooter />
    </div>
  )
}
