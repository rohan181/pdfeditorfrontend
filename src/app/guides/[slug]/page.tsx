import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import guides, { guideMap, type Guide, type ContentBlock } from '@/lib/guidesData'

export function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = guideMap[slug]
  if (!guide) return {}
  return {
    title:       { absolute: `${guide.seoTitle} | EditPDF AI` },
    description: guide.description,
    alternates:  { canonical: `https://www.editpdfai.com/guides/${guide.slug}` },
    openGraph: {
      title:       `${guide.seoTitle} | EditPDF AI`,
      description: guide.description,
      type:        'article',
      url:         `https://www.editpdfai.com/guides/${guide.slug}`,
      siteName:    'EditPDF AI',
      publishedTime: guide.datePublished,
      modifiedTime:  guide.dateModified,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: guide.title }],
    },
  }
}

const PURPLE = '#4F7FFA'
const BG     = '#f7f8fa'

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'p':
      return <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' }}>{block.text}</p>

    case 'steps':
      return (
        <ol style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.7, paddingTop: 4 }}>{item}</span>
            </li>
          ))}
        </ol>
      )

    case 'list':
      return (
        <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15.5, color: '#374151', lineHeight: 1.7 }}>
              <span style={{ color: PURPLE, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>·</span>
              {item}
            </li>
          ))}
        </ul>
      )

    case 'tip':
      return (
        <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', margin: '0 0 20px', display: 'flex', gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="#1d4ed8" opacity=".15"/>
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#1d4ed8', marginBottom: 4 }}>{block.heading}</div>
            <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.65, margin: 0 }}>{block.text}</p>
          </div>
        </div>
      )
  }
}

function GuideContent({ guide }: { guide: Guide }) {
  const jsonLd = {
    '@context':       'https://schema.org',
    '@type':          'Article',
    headline:         guide.title,
    description:      guide.description,
    datePublished:    guide.datePublished,
    dateModified:     guide.dateModified,
    url:              `https://www.editpdfai.com/guides/${guide.slug}`,
    publisher: {
      '@type': 'Organization',
      name:    'EditPDF AI',
      url:     'https://www.editpdfai.com',
      logo:    { '@type': 'ImageObject', url: 'https://www.editpdfai.com/logo.png' },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://www.editpdfai.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.editpdfai.com/guides' },
        { '@type': 'ListItem', position: 3, name: guide.title, item: `https://www.editpdfai.com/guides/${guide.slug}` },
      ],
    },
  }

  const otherGuides = guides.filter(g => g.slug !== guide.slug).slice(0, 4)

  return (
    <div style={{ fontFamily: 'var(--font-dm,system-ui,sans-serif)', color: '#1d1d1f', background: '#fff', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.svg?v=2" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} priority />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/guides" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← All guides</Link>
          <Link href={`/${guide.toolSlug}`} style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 99, background: PURPLE }}>
            {guide.ctaLabel}
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 24px 0' }}>
        <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12.5, color: '#9ca3af', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <span>›</span>
          <Link href="/guides" style={{ color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>Guides</Link>
          <span>›</span>
          <span style={{ color: '#6b7280', fontWeight: 600 }}>{guide.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px 72px' }}>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#9ca3af' }}>
            {guide.readTime}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 9, background: '#d1d5db' }} />
          <span style={{ fontSize: 11.5, color: '#9ca3af', fontWeight: 500 }}>
            Updated {new Date(guide.dateModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(26px,4.5vw,40px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1, margin: '0 0 20px', color: '#1d1d1f' }}>
          {guide.title}
        </h1>

        <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.75, margin: '0 0 40px', borderBottom: '1px solid #f0f0f0', paddingBottom: 32 }}>
          {guide.intro}
        </p>

        {/* Sections */}
        {guide.sections.map((section, si) => (
          <section key={si} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 18px', color: '#1d1d1f', lineHeight: 1.25 }}>
              {section.heading}
            </h2>
            {section.blocks.map((block, bi) => (
              <Block key={bi} block={block} />
            ))}
          </section>
        ))}

        {/* Tool CTA */}
        <div style={{ margin: '48px 0', background: 'linear-gradient(135deg,rgba(79,127,250,.06),rgba(139,63,236,.06))', border: '1.5px solid rgba(79,127,250,.2)', borderRadius: 20, padding: '32px 28px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10 }}>
            Try it now — free
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 10px', color: '#1d1d1f' }}>
            {guide.toolName}
          </h3>
          <p style={{ fontSize: 14.5, color: '#6b7280', lineHeight: 1.65, margin: '0 0 20px' }}>
            No account needed. Works on Mac, Windows, iPhone, and Android.
          </p>
          <Link href={`/${guide.toolSlug}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#4F7FFA,#8B3FEC)', color: '#fff', fontSize: 14.5, fontWeight: 700, textDecoration: 'none' }}>
            {guide.ctaLabel}
          </Link>
        </div>

      </article>

      {/* More guides */}
      {otherGuides.length > 0 && (
        <section style={{ background: BG, borderTop: '1px solid #ebebeb', padding: '56px 24px 72px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 28px', textAlign: 'center' }}>
              More PDF guides
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
              {otherGuides.map(g => (
                <Link key={g.slug} href={`/guides/${g.slug}`}
                  style={{ textDecoration: 'none', display: 'block', background: '#fff', borderRadius: 14, padding: '20px 18px', border: '1.5px solid #e8eaed' }}
                  className="more-guide-card">
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8 }}>
                    {g.readTime}
                  </div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#1d1d1f', margin: '0 0 8px', letterSpacing: '-.02em', lineHeight: 1.3 }}>
                    {g.title}
                  </h3>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>Read →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .more-guide-card:hover { border-color: ${PURPLE}; box-shadow: 0 4px 16px rgba(79,127,250,.1); }
      `}</style>
    </div>
  )
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = guideMap[slug]
  if (!guide) notFound()
  return <GuideContent guide={guide} />
}
