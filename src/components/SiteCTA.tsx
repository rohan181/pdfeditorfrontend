import { Upload } from 'lucide-react'
import { ButtonLink, Container, Eyebrow, Heading } from '@/components/ui'

export default function SiteCTA() {
  return (
    <section id="final-editor-cta" className="site-cta-sec">
      <Container>
        <Eyebrow className="site-cta-eyebrow">
          Get started
        </Eyebrow>
        <Heading as="h2" inverse className="site-cta-heading">
          Ready to edit<br/>your PDF?
        </Heading>
        <div className="site-cta-actions">
          <ButtonLink href="/pdf-editor" variant="secondary" size="large" data-editor-cta>
            <Upload size={16} strokeWidth={2.5}/> Open PDF Editor
          </ButtonLink>
          <span className="site-cta-note">
            Start with your PDF — no signup required
          </span>
        </div>
      </Container>
    </section>
  )
}
