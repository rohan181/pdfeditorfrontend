import { ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import guides from '@/lib/guidesData'
import SiteFooter from '@/components/SiteFooter'
import PublicPageHeader from '@/components/PublicPageHeader'
import { ButtonLink, CardLink, Container, Eyebrow, Heading, Text } from '@/components/ui'
import { buildToolMetadata } from '@/lib/seo/metadata'
import { TOOL_METADATA } from '@/lib/seo/routes'
import { PRODUCT_ACCESS_SUMMARY } from '@/lib/productMessaging'
import { buildGuidesCollectionStructuredData } from '@/lib/seo/structuredData'

export const metadata = buildToolMetadata(TOOL_METADATA['guides'])

export default function GuidesPage() {
  return (
    <div className="guides-page">
      <JsonLd id="guides-structured-data" data={buildGuidesCollectionStructuredData(guides)} />
      <PublicPageHeader />

      <main id="main-content">
        <section className="guides-hero">
          <Container size="reading">
            <nav aria-label="Breadcrumb" className="public-breadcrumb">
              <Link href="/" prefetch={false}>EditPDF AI</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Guides</span>
            </nav>
            <Eyebrow>Guides</Eyebrow>
            <Heading as="h1">PDF guides that actually help</Heading>
            <Text size="large">
              Step-by-step instructions for common PDF tasks, with links to the relevant core or AI-assisted tool.
            </Text>
          </Container>
        </section>

        <section className="guides-list" aria-label="PDF guides">
          <Container>
            <div className="guides-grid">
              {guides.map(guide => (
                <CardLink
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  prefetch={false}
                  variant="guide"
                  className="guide-card"
                >
                  <div className="guide-card-meta">
                    <BookOpen size={15} aria-hidden="true" />
                    <span>{guide.readTime}</span>
                  </div>
                  <Heading as="h2" className="guide-card-title">{guide.title}</Heading>
                  <Text size="small" className="guide-card-copy">{guide.description}</Text>
                  <span className="guide-card-action">
                    Read guide <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </CardLink>
              ))}
            </div>
          </Container>
        </section>

        <section className="guides-cta">
          <Container size="reading">
            <Heading as="h2" inverse>Ready to try it yourself?</Heading>
            <Text tone="inverse">{PRODUCT_ACCESS_SUMMARY}</Text>
            <ButtonLink prefetch={false} href="/pdf-editor" size="large">
              Open the free PDF editor <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
