import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import {
  LEGAL_LAST_UPDATED_ISO,
  LEGAL_LAST_UPDATED_LABEL,
  PUBLIC_OPERATOR_DISCLOSURE,
  SUPPORT_EMAIL,
  supportMailto,
} from '@/lib/entity'
import {
  AI_ACCURACY_DISCLAIMER,
  BROWSER_PROCESSING_SUMMARY,
  CONVERSION_PROCESSING_SUMMARY,
  OCR_PROCESSING_SUMMARY,
  PRODUCT_ACCESS_SUMMARY,
} from '@/lib/productMessaging'
import {
  AI_CONVERSION_ACCESS_SUMMARY,
  PRO_BILLING_SUMMARY,
  PRO_CANCELLATION_SUMMARY,
  PRO_REFUND_SUMMARY,
} from '@/lib/pricing'

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

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ fontFamily: MONO, fontSize: 11, color: '#9ca3af', letterSpacing: '0.06em' }}>
            Last updated: <time dateTime={LEGAL_LAST_UPDATED_ISO}>{LEGAL_LAST_UPDATED_LABEL}</time>
          </p>
        </div>

        <Section title="1. Acceptance of terms">
          <P>By accessing or using EditPDF AI ("the Service," "we," "us"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</P>
          <P>{PUBLIC_OPERATOR_DISCLOSURE}</P>
          <P>We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes your acceptance of the revised terms.</P>
        </Section>

        <Section title="2. The service">
          <P>EditPDF AI provides browser-based PDF editing, conversion, and AI-powered document tools. The Service includes:</P>
          <Ul items={[
            PRODUCT_ACCESS_SUMMARY,
            AI_CONVERSION_ACCESS_SUMMARY,
          ]} />
          <P><strong>Browser-based tools.</strong> {BROWSER_PROCESSING_SUMMARY}</P>
          <P><strong>Conversion tools.</strong> {CONVERSION_PROCESSING_SUMMARY}</P>
          <P><strong>OCR.</strong> {OCR_PROCESSING_SUMMARY}</P>
          <P>Other AI tools send the content required for the selected action through EditPDF AI server routes to configured processing providers. See the <Link href="/privacy" style={{ color: '#0891b2', fontWeight: 600 }}>Privacy Policy</Link> for the feature-specific data flows.</P>
        </Section>

        <Section title="3. User accounts">
          <P>A free account lets you access AI features with a daily limit. You must be at least 13 years old to create an account. You are responsible for maintaining the security of your credentials.</P>
          <P>We reserve the right to suspend or terminate accounts that violate these terms.</P>
        </Section>

        <Section title="4. Acceptable use">
          <P>You agree not to use the Service to:</P>
          <Ul items={[
            'Process, distribute, or create illegal content',
            'Infringe on intellectual property rights or privacy of others',
            'Attempt to bypass security measures or rate limits',
            'Use automated scripts to abuse AI features or overload the Service',
            'Resell or sublicense the Service without permission',
          ]} />
        </Section>

        <Section title="5. Pro subscription and billing">
          <P>{PRO_BILLING_SUMMARY} Stripe provides the payment fields and processes the subscription. By subscribing, you authorise recurring monthly charges to your payment method.</P>
          <P>{PRO_CANCELLATION_SUMMARY}</P>
          <P>We reserve the right to change pricing with at least 30 days' notice to current subscribers.</P>
        </Section>

        <Section title="6. Refunds">
          <P>{PRO_REFUND_SUMMARY} Please contact <a href={supportMailto()} style={{ color: '#0891b2', fontWeight: 600 }}>{SUPPORT_EMAIL}</a> with your request.</P>
        </Section>

        <Section title="7. Intellectual property">
          <P>Except for third-party software and materials used under their respective licences, the Service&apos;s original interface and content are protected by applicable intellectual-property law. You retain your rights to the documents you process. EditPDF AI does not claim ownership of document content you submit to or generate with the Service.</P>
        </Section>

        <Section title="8. AI-generated content">
          <P>AI features produce automated output including summaries, translations, mind maps, quiz questions, conversions, OCR text, and suggested form values. This output is provided for convenience and informational purposes only.</P>
          <P>{AI_ACCURACY_DISCLAIMER}</P>
        </Section>

        <Section title="9. Disclaimers and limitation of liability">
          <P>The Service is provided "as is" without warranty of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that results will meet your requirements.</P>
          <P>To the maximum extent permitted by law, EditPDF AI shall not be liable for any indirect, incidental, special, or consequential damages, including loss of data, arising from your use of the Service.</P>
          <P>Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.</P>
        </Section>

        <Section title="10. Governing law">
          <P>These Terms do not currently designate a particular governing-law jurisdiction or mandatory arbitration forum. Applicable law, non-waivable consumer rights, and the available dispute forum depend on the circumstances.</P>
        </Section>

        <Section title="11. Contact">
          <P>Questions about these Terms? Contact us:</P>
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
