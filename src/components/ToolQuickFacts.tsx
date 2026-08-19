export interface ToolQuickFactsProps {
  /** One self-contained 40–60 word answer to "what is this tool" — placed
   * immediately after the H1 so it can be lifted whole by an answer engine
   * without needing surrounding page context. */
  definition: string
  price: string
  account: string
  processing: string
  formats: string
  fileLimit: string
  browserSupport: string
}

const LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '.07em',
  textTransform: 'uppercase',
  color: '#9ca3af',
  marginBottom: 4,
}

const VALUE: React.CSSProperties = {
  fontSize: 13.5,
  fontWeight: 600,
  color: '#1d1d1f',
  lineHeight: 1.4,
}

export default function ToolQuickFacts({ definition, price, account, processing, formats, fileLimit, browserSupport }: ToolQuickFactsProps) {
  const facts: [string, string][] = [
    ['Price', price],
    ['Account', account],
    ['Processing', processing],
    ['Formats', formats],
    ['File limit', fileLimit],
    ['Browser support', browserSupport],
  ]

  return (
    <section
      aria-label="Quick facts"
      style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '0 24px 40px',
        fontFamily: 'var(--font-dm,system-ui,sans-serif)',
      }}
    >
      <div style={{ background: '#f7f8fa', border: '1.5px solid #e8eaed', borderRadius: 16, padding: '22px 24px' }}>
        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 700 }}>
          {definition}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
            gap: '14px 20px',
            borderTop: '1px solid #e8eaed',
            paddingTop: 16,
          }}
        >
          {facts.map(([label, value]) => (
            <div key={label}>
              <div style={LABEL}>{label}</div>
              <div style={VALUE}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
