export interface ToolQuickFactsProps {
  /** Optional short definition for tool pages whose hero does not already
   * provide the answer immediately after its H1. */
  definition?: string
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
  color: '#64748b',
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
      aria-label="Verified facts"
      className="tool-quick-facts"
      style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '0 24px 40px',
        fontFamily: 'var(--font-dm,system-ui,sans-serif)',
      }}
    >
      <div style={{ background: '#f7f8fa', border: '1.5px solid #e8eaed', borderRadius: 16, padding: '22px 24px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.025em', color: '#1d1d1f', margin: definition ? '0 0 8px' : '0 0 18px' }}>
          Verified facts
        </h2>
        {definition && (
          <p className="tool-quick-definition" style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 700 }}>
            {definition}
          </p>
        )}
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
            <div className="tool-quick-fact" data-fact-label={label} key={label}>
              <div className="tool-quick-fact-label" style={LABEL}>{label}</div>
              <div className="tool-quick-fact-value" style={VALUE}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
