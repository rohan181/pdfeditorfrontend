import { TRUSTPILOT_PROFILE_URL } from '@/lib/entity'

const FI = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = {
  fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace',
}

/**
 * Kept as a neutral external-review destination. No rating, review count, quote,
 * reviewer identity, or platform endorsement is shown without source records.
 */
export default function SiteTestimonials() {
  return (
    <section style={{ background: '#0f172a', padding: '64px 28px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ ...MONO, fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
          Independent feedback
        </div>
        <h2 style={{ fontFamily: 'var(--font-jakarta,system-ui)', fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, margin: '0 0 16px' }}>
          Review EditPDF AI independently
        </h2>
        <p style={{ ...FI, fontSize: 14, color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.7, margin: '0 auto 24px' }}>
          The external profile is linked without displaying a rating, review count, or customer quote on this website.
        </p>
        <a
          href={TRUSTPILOT_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...FI, display: 'inline-flex', padding: '11px 20px', borderRadius: 99, background: '#fff', color: '#0f172a', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
        >
          View EditPDF AI on Trustpilot ↗
        </a>
      </div>
    </section>
  )
}
