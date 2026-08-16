'use client'
import React from 'react'
import Link from 'next/link'
import { toolMetaMap } from '@/lib/toolMeta'
import { ORGANIZATION_ID } from '@/lib/seo/site'

export interface ToolSEOStep    { title: string; body: string }
export interface ToolSEOFAQ     { q: string; a: string }
export interface ToolSEOUser    { who: string; why: string }
export interface ToolSEOFormats { input: string[]; output?: string[]; limit?: string }

interface Props {
  steps:    ToolSEOStep[]
  faqs:     ToolSEOFAQ[]
  whatIs?:  string[]
  users?:   ToolSEOUser[]
  related?: { slug: string; label: string }[]
  formats?: ToolSEOFormats
  privacy?: string
  toolSlug?: string
  showSteps?: boolean
  showFaq?: boolean
  includeSchema?: boolean
}

const PURPLE  = '#4F7FFA'
const BG      = '#f7f8fa'

const BASE = 'https://www.editpdfai.com'

const GUIDES_BY_TOOL: Record<string, { href: string; label: string }[]> = {
  'pdf-editor': [{ href: '/guides/how-to-edit-a-pdf-without-adobe', label: 'How to edit a PDF without Adobe Acrobat' }],
  'pdf-compressor': [{ href: '/guides/how-to-reduce-pdf-file-size', label: 'How to reduce PDF file size without losing quality' }],
  'ai-pdf-form-filler': [{ href: '/guides/how-to-fill-out-a-pdf-form-automatically', label: 'How to fill out a PDF form automatically with AI' }],
  'pdf-signer': [{ href: '/guides/how-to-sign-a-pdf-online', label: 'How to sign a PDF online without printing' }],
  'pdf-ocr': [{ href: '/guides/how-to-make-a-scanned-pdf-searchable', label: 'How to make a scanned PDF searchable' }],
  'pdf-merger': [{ href: '/guides/how-to-merge-pdf-files', label: 'How to merge PDF files on any device' }],
  'pdf-redactor': [{ href: '/guides/how-to-redact-sensitive-information-from-a-pdf', label: 'How to permanently redact sensitive information from a PDF' }],
  'word-to-pdf': [{ href: '/guides/pdf-vs-word-which-format-to-use', label: 'PDF vs Word: which document format should you use?' }],
  'pdf-to-word': [{ href: '/guides/pdf-vs-word-which-format-to-use', label: 'PDF vs Word: which document format should you use?' }],
}

export default function ToolSEOSection({ steps, faqs, whatIs, users, related, formats, privacy, toolSlug, showSteps = true, showFaq = true, includeSchema = true }: Props) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const relatedTools = related ?? []
  const relevantGuides = toolSlug ? GUIDES_BY_TOOL[toolSlug] ?? [] : []

  const toolMeta = toolSlug ? toolMetaMap[toolSlug] : null

  const breadcrumbSchema = toolSlug && toolMeta ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: toolMeta.name, item: `${BASE}/${toolSlug}` },
    ],
  } : null

  const softwareSchema = toolSlug && toolMeta ? {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolMeta.name,
    description: toolMeta.desc,
    url: `${BASE}/${toolSlug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@id': ORGANIZATION_ID },
  } : null

  // Lets answer engines (Google AI Overviews, ChatGPT, Perplexity) cite the
  // exact steps directly instead of only indexing the FAQ text.
  const howToSchema = steps.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: toolMeta ? `How to use ${toolMeta.name}` : 'How it works',
    ...(toolSlug ? { url: `${BASE}/${toolSlug}` } : {}),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  } : null

  return (
    <div className="tool-seo-section" style={{ fontFamily: 'var(--font-inter,system-ui,sans-serif)', color: '#1d1d1f' }}>
      {includeSchema && showFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {includeSchema && breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
      {includeSchema && softwareSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      )}
      {includeSchema && showSteps && howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}

      {/* ── What is + Who uses ── */}
      {(whatIs || users) && (
        <section aria-label={toolMeta ? `About ${toolMeta.name}` : 'About this PDF tool'} style={{ background: '#fff', borderTop: '1px solid #ebebeb', padding: '64px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {whatIs && (
              <div className="tool-seo-intro" style={{ maxWidth: 720, marginBottom: users ? 56 : 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
                  Clear, practical guidance
                </div>
                <h2 style={{ fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1, color: '#1d1d1f', marginBottom: 20 }}>
                  {whatIs[0]}
                </h2>
                {whatIs.slice(1).map((p, i) => (
                  <p key={i} style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 14, marginTop: 0 }}>{p}</p>
                ))}
              </div>
            )}
            {users && (
              <div>
                <h2 style={{ fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 800, letterSpacing: '-.04em', color: '#1d1d1f', marginBottom: 10 }}>
                  Practical examples
                </h2>
                <p style={{ fontSize: 14.5, color: '#6b7280', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 680 }}>
                  Common ways people use this tool in real documents and day-to-day workflows.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
                  {users.map((u, i) => (
                    <div className="tool-seo-card" key={i} style={{ background: BG, borderRadius: 14, padding: '18px 16px', border: '1.5px solid #e8eaed' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1d1d1f', marginBottom: 6, letterSpacing: '-.02em' }}>{u.who}</div>
                      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{u.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      {showSteps && <section style={{ background: BG, borderTop: '1px solid #ebebeb', padding: '56px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 36px', textAlign: 'center' }}>
            How it works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {steps.map((s, i) => (
              <div className="tool-seo-card" key={i} style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', border: '1.5px solid #e8eaed' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{i + 1}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 7px', letterSpacing: '-.02em' }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Formats + Privacy ── */}
      {(formats || privacy) && (
        <section style={{ background: '#fff', borderTop: '1px solid #ebebeb', padding: '40px 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {formats && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>
                    {formats.output ? 'Input formats' : 'Supported formats'}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {formats.input.map(f => (
                      <span key={f} style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, border: '1px solid #bfdbfe', letterSpacing: '.02em' }}>{f}</span>
                    ))}
                  </div>
                </div>
                {formats.output && formats.output.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Output format</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {formats.output.map(f => (
                        <span key={f} style={{ background: '#f0fdf4', color: '#15803d', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, border: '1px solid #bbf7d0', letterSpacing: '.02em' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {formats.limit && (
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>File limit</div>
                    <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{formats.limit}</div>
                  </div>
                )}
              </div>
            )}

            {privacy && (
              <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="#1d4ed8" opacity=".15"/>
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#1d4ed8', marginBottom: 3 }}>Privacy &amp; security</div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>{privacy}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {showFaq && <section style={{ padding: '56px 24px 72px', background: BG, borderTop: '1px solid #ebebeb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 32px', textAlign: 'center' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((f, i) => (
              <details className="tool-seo-faq" key={i} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e8eaed', overflow: 'hidden' }}>
                <summary style={{
                  padding: '16px 20px', fontWeight: 700, fontSize: 14.5, color: '#1d1d1f',
                  cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  letterSpacing: '-.01em',
                }}>
                  {f.q}
                  <span className="tool-seo-faq-icon" aria-hidden="true" style={{ fontSize: 18, color: PURPLE, marginLeft: 12, flexShrink: 0, lineHeight: 1 }}>+</span>
                </summary>
                <div style={{ padding: '0 20px 16px', fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Related tools ── */}
      {relatedTools.length > 0 && (
        <section style={{ background: '#fff', borderTop: '1px solid #ebebeb', padding: '56px 24px 72px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 28px', textAlign: 'center' }}>
              Related tools
            </h2>
            <nav aria-label="Related PDF tools" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14 }}>
              {relatedTools.map(r => {
                const meta = toolMetaMap[r.slug]
                return (
                  <Link
                    className="tool-seo-related"
                    key={r.slug}
                    href={`/${r.slug}`}
                    prefetch={false}
                    style={{
                      display: 'block', textDecoration: 'none',
                      background: BG, borderRadius: 14, padding: '18px 18px 16px',
                      border: '1.5px solid #e8eaed',
                      transition: 'border-color .15s, box-shadow .15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = PURPLE
                      ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(79,127,250,.12)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e8eaed'
                      ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f', marginBottom: 6, letterSpacing: '-.02em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {r.label}
                      <span style={{ fontSize: 16, color: PURPLE, flexShrink: 0, marginLeft: 8 }}>→</span>
                    </div>
                    {meta && <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{meta.desc}</p>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </section>
      )}

      {relevantGuides.length > 0 && (
        <section style={{ background: BG, borderTop: '1px solid #ebebeb', padding: '44px 24px 56px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(19px,2.3vw,26px)', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 18px' }}>
              Step-by-step guides
            </h2>
            {relevantGuides.map(guide => (
              <Link className="tool-seo-guide" prefetch={false} key={guide.href} href={guide.href} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 18px', background: '#fff', border: '1.5px solid #e8eaed', borderRadius: 14, color: '#1d1d1f', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                <span>{guide.label}</span>
                <span aria-hidden="true" style={{ color: PURPLE }}>Read guide →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {toolSlug && toolMeta && (
        <section aria-label={`${toolMeta.name} actions`} style={{ background: '#fff', borderTop: '1px solid #ebebeb', padding: '64px 24px 72px' }}>
          <div className="tool-seo-cta" style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '40px 24px', borderRadius: 20, background: 'linear-gradient(135deg,#eff6ff 0%,#f5f3ff 100%)', border: '1.5px solid #dbeafe' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
              Free online PDF tool
            </div>
            <h2 style={{ fontSize: 'clamp(23px,3vw,34px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1, margin: '0 0 12px', color: '#0f172a' }}>
              Ready to use {toolMeta.name}?
            </h2>
            <p style={{ maxWidth: 560, margin: '0 auto 24px', fontSize: 14.5, lineHeight: 1.7, color: '#475569' }}>
              {toolMeta.desc} Return to the tool above to choose your file, or browse the complete PDF toolkit for another task.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="tool-seo-primary-action"
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ border: 0, borderRadius: 999, padding: '12px 22px', background: '#2563eb', color: '#fff', fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}
              >
                Use {toolMeta.name}
              </button>
              <Link className="tool-seo-secondary-action" prefetch={false} href="/#tools" style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '12px 22px', background: '#fff', border: '1.5px solid #cbd5e1', color: '#334155', textDecoration: 'none', fontSize: 13.5, fontWeight: 700 }}>
                Browse all PDF tools
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
