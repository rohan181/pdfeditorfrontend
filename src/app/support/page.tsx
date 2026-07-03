import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

const FI = 'var(--font-dm,system-ui,sans-serif)'
const MONO = 'var(--font-mono,monospace)'

const FAQS = [
  {
    q: 'Is EditPDF AI free to use?',
    a: 'All 35+ PDF tools (edit, merge, split, compress, watermark, sign, etc.) are completely free with no account required. AI-powered features (Summarizer, Form Filler, Translator, Mind Map, Quiz Creator, OCR) are free up to 5 uses per day. Pro gives you unlimited AI uses.',
  },
  {
    q: 'Do my files get uploaded to your servers?',
    a: 'No. All core PDF tools run entirely in your browser — your files never leave your device. For AI features, only the extracted text content (not the raw PDF) is sent for processing. We do not store any file content.',
  },
  {
    q: 'Why is the AI feature saying I\'ve reached my daily limit?',
    a: 'Free accounts can use AI features up to 5 times per day. The limit resets at midnight UTC. You can upgrade to Pro for unlimited AI uses with no daily resets.',
  },
  {
    q: 'How do I cancel my Pro subscription?',
    a: 'Sign in, go to your Dashboard, then click "Manage Subscription." You can cancel from there. Your Pro access continues until the end of the current billing period — no partial refunds for unused time.',
  },
  {
    q: 'I cancelled but was charged again — what do I do?',
    a: 'If you cancelled before the renewal date and were still charged, please email us at support@editpdfai.com with the details and we will issue a refund promptly.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Yes. We offer refunds within 7 days of your first payment if you are not satisfied. Contact us at support@editpdfai.com. Refunds are not available for renewals.',
  },
  {
    q: 'My PDF conversion looks wrong — what should I do?',
    a: 'Complex PDFs (scanned documents, PDFs with unusual fonts, or heavily formatted layouts) may not convert perfectly. Try the PDF OCR Scanner first to extract clean text, then convert. If issues persist, contact us.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Files are processed in your browser. AI features use only required text context — no raw file upload. We do not store PDFs or document content. Payment is handled by Stripe under PCI-DSS standards. See our Privacy Policy for full details.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'EditPDF AI works in all modern browsers: Chrome, Safari, Firefox, and Edge. For best performance, use the latest version of Chrome or Safari.',
  },
  {
    q: 'How do I request deletion of my data?',
    a: 'Email support@editpdfai.com with the subject "Data Deletion Request" and the email address associated with your account. We will delete your account and all associated data within 30 days.',
  },
]

export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <SiteNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '100px 28px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af' }}>
            Help
          </span>
          <h1 style={{ fontFamily: FI, fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.04em', margin: '10px 0 16px', lineHeight: 1.05 }}>
            Support
          </h1>
          <p style={{ fontFamily: FI, fontSize: 16, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>
            Browse common questions below or contact us directly for help.
          </p>
        </div>

        {/* Contact card */}
        <div style={{ background: '#f5f5f7', borderRadius: 20, padding: '24px 28px', marginBottom: 56, display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 8px' }}>Contact us</p>
            <a href="mailto:support@editpdfai.com"
              style={{ fontFamily: FI, fontSize: 18, fontWeight: 800, color: '#0891b2', textDecoration: 'none', letterSpacing: '-0.02em' }}>
              support@editpdfai.com
            </a>
            <p style={{ fontFamily: FI, fontSize: 13, color: '#6b7280', margin: '6px 0 0' }}>
              We usually respond within 24–48 hours.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
            {[
              { label: 'Billing & subscription', color: '#0891b2' },
              { label: 'Privacy & data requests', color: '#7c3aed' },
              { label: 'Bug reports & feedback', color: '#f97316' },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: FI, fontSize: 13, color: '#374151' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontFamily: FI, fontSize: 22, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.03em', margin: '0 0 28px' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {FAQS.map(({ q, a }) => (
              <div key={q} style={{ background: '#f9fafb', borderRadius: 14, padding: '18px 20px', border: '1px solid #f3f4f6' }}>
                <p style={{ fontFamily: FI, fontSize: 15, fontWeight: 700, color: '#1d1d1f', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                  {q}
                </p>
                <p style={{ fontFamily: FI, fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.65 }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div style={{ marginTop: 48, textAlign: 'center', padding: '32px', background: '#f5f5f7', borderRadius: 20 }}>
          <p style={{ fontFamily: FI, fontSize: 16, fontWeight: 700, color: '#1d1d1f', margin: '0 0 6px' }}>Still need help?</p>
          <p style={{ fontFamily: FI, fontSize: 14, color: '#6b7280', margin: '0 0 16px' }}>
            We read every email and respond within 24–48 hours.
          </p>
          <a href="mailto:support@editpdfai.com"
            style={{ fontFamily: FI, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 24px', background: '#1d1d1f', color: '#fff', borderRadius: 99, fontSize: 14, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em' }}>
            Email support@editpdfai.com
          </a>
        </div>

      </main>

      <SiteFooter />
    </div>
  )
}
