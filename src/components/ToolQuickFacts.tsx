import { Card, Container, Heading, Text } from '@/components/ui'
import ToolUploadAssist from '@/components/ToolUploadAssist'

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

export default function ToolQuickFacts({ definition, price, account, processing, formats, fileLimit, browserSupport }: ToolQuickFactsProps) {
  const facts: [string, string][] = [
    ['Price', price],
    ['Account', account],
    ['Processing', processing],
    ['Formats', formats],
    ['File limit', fileLimit],
    ['Browser support', browserSupport],
  ]

  const accessLabel = price.includes('Optional AI Builder') || /optional AI/i.test(account)
    ? 'Free core · optional AI'
    : price === 'Free — no account needed'
      ? 'Free'
      : 'AI · Free allowance + Pro'
  const accessSummary = accessLabel === 'Free'
    ? 'The core task does not require an account.'
    : accessLabel === 'Free core · optional AI'
      ? 'Core controls are free; optional AI actions have separate access rules.'
      : 'Sign-in is required; Free allowance and Pro access are stated up front.'

  const workflow = [
    ['Select file', 'Choose a supported file and wait for validation.'],
    ['Configure', 'Review the available options after your file is ready.'],
    ['Process', 'Confirm the access label above, then start once and follow progress.'],
    ['Preview result', 'Check the generated result before relying on it.'],
    ['Download', 'Save the result, then start another task if needed.'],
  ]

  return (
    <section
      aria-label="Verified facts"
      className="tool-quick-facts"
      data-tool-workflow
    >
      <Container size="narrow">
        <Card variant="info" className="tool-quick-facts-card">
        <div className="tool-quick-facts-title-row">
          <div>
            <div className="tool-access-badge" data-access-label={accessLabel}>{accessLabel}</div>
            <Heading as="h2" className="tool-quick-facts-heading">
              Verified facts
            </Heading>
          </div>
          <p className="tool-access-summary">{accessSummary}</p>
        </div>
        {definition && (
          <Text className="tool-quick-definition">
            {definition}
          </Text>
        )}
        <div className="tool-workflow" aria-labelledby="standard-tool-workflow-heading">
          <h3 id="standard-tool-workflow-heading">Standard tool workflow</h3>
          <ol>
            {workflow.map(([title, description], index) => (
              <li key={title}>
                <span className="tool-workflow-number" aria-hidden="true">{index + 1}</span>
                <span><strong>{title}</strong><small>{description}</small></span>
              </li>
            ))}
          </ol>
        </div>
        <div className="tool-workflow-guidance">
          <p><strong>Why is Process unavailable?</strong> Processing controls remain disabled until the required file has been selected and validated.</p>
          <p><strong>If something goes wrong:</strong> Follow the message beside the tool, correct the file or option it identifies, and retry. Recoverable errors should keep your selected settings; reset only when you want to clear the task.</p>
        </div>
        <div className="tool-quick-facts-grid">
          {facts.map(([label, value]) => (
            <div className="tool-quick-fact" data-fact-label={label} key={label}>
              <div className="tool-quick-fact-label">{label}</div>
              <div className="tool-quick-fact-value">{value}</div>
            </div>
          ))}
        </div>
        <ToolUploadAssist formats={formats} fileLimit={fileLimit} processing={processing} />
        </Card>
      </Container>
    </section>
  )
}
