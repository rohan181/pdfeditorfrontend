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

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ fontFamily: MONO, fontSize: 11, color: '#9ca3af', letterSpacing: '0.06em' }}>
            Last updated: {updated}
          </p>
        </div>

        <Section title="1. Acceptance of terms">
          <P>By accessing or using EditPDF AI ("the Service," "we," "us"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</P>
          <P>We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes your acceptance of the revised terms.</P>
        </Section>

        <Section title="2. The service">
          <P>EditPDF AI provides browser-based PDF editing, conversion, and AI-powered document tools. The Service includes:</P>
          <Ul items={[
            'Free PDF tools: edit, merge, split, compress, rotate, watermark, sign, and more — available to all users without an account',
            'AI-powered features (Summarizer, Form Filler, Translator, Mind Map, Quiz Creator, OCR): 5 free uses per day for registered users; unlimited for Pro subscribers',
            'Conversion tools (PDF → Word, Excel, PowerPoint): available on the Pro plan',
          ]} />
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
          <P>Pro subscriptions are billed monthly. Payment is processed securely by Stripe. By subscribing, you authorise recurring charges to your payment method.</P>
          <P>You may cancel at any time from your account settings. Cancellation takes effect at the end of the current billing period — no partial refunds are issued for unused time.</P>
          <P>We reserve the right to change pricing with at least 30 days' notice to current subscribers.</P>
        </Section>

        <Section title="6. Refunds">
          <P>We offer refunds within 7 days of your first subscription payment if you are unsatisfied. Please contact <a href="mailto:support@editpdfai.com" style={{ color: '#0891b2', fontWeight: 600 }}>support@editpdfai.com</a> with your request. Refunds are not available for renewals.</P>
        </Section>

        <Section title="7. Intellectual property">
          <P>The Service, its design, interface, and codebase are the intellectual property of EditPDF AI. You retain all rights to the documents you process. We claim no ownership over content you upload or generate using the Service.</P>
        </Section>

        <Section title="8. AI-generated content">
          <P>AI features produce automated output (summaries, translations, mind maps, quiz questions, form fills). This output is provided for convenience and informational purposes only. You are responsible for reviewing AI-generated content before using it in any official, legal, or professional context.</P>
          <P>We make no warranty that AI output is accurate, complete, or error-free.</P>
        </Section>

        <Section title="9. Disclaimers and limitation of liability">
          <P>The Service is provided "as is" without warranty of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that results will meet your requirements.</P>
          <P>To the maximum extent permitted by law, EditPDF AI shall not be liable for any indirect, incidental, special, or consequential damages, including loss of data, arising from your use of the Service.</P>
          <P>Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.</P>
        </Section>

        <Section title="10. Governing law">
          <P>These terms are governed by and construed in accordance with applicable law. Disputes shall be resolved through binding arbitration or the courts of the jurisdiction in which EditPDF AI is registered, as applicable.</P>
        </Section>

        <Section title="11. Contact">
          <P>Questions about these Terms? Contact us:</P>
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
