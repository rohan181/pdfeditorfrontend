import Link from 'next/link'
import Image from 'next/image'
import { Upload, Lock, Sparkles, FilePen, Layers, FileType, KeyRound, Minimize2, FileSearch } from 'lucide-react'
import {
  PROCESSING_PRIVACY_SUMMARY,
  PRODUCT_ACCESS_SUMMARY,
  TOOL_CATALOGUE_SUMMARY,
} from '@/lib/productMessaging'
import { TRUSTPILOT_PROFILE_URL } from '@/lib/entity'
import { ButtonLink, Container } from '@/components/ui'
import { toolMetaMap } from '@/lib/toolMeta'
import { PRODUCT_PRIORITY_TOOL_SLUGS, TOOL_CATEGORIES, getCategoryHref } from '@/lib/toolDiscovery'

const FI  = { fontFamily: 'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

const CATEGORY_ICONS = {
  ai: Sparkles,
  edit: FilePen,
  convert: FileType,
  organize: Layers,
  compress: Minimize2,
  protect: KeyRound,
  extract: FileSearch,
}

const toolCols = [
  { title: 'Priority tools', color: '#1d4ed8', links: [
    ...PRODUCT_PRIORITY_TOOL_SLUGS.map(slug => [toolMetaMap[slug]?.name ?? slug, `/${slug}`]),
    ['Browse all PDF tools', '/#tools'],
  ]},
  { title: 'Categories', color: '#6d28d9', links: TOOL_CATEGORIES.map(category => [category.label, getCategoryHref(category)]) },
  { title: 'Guides',    color: '#155e75', links: [
    ['Edit PDF Without Adobe',   '/guides/how-to-edit-a-pdf-without-adobe'],
    ['Reduce PDF File Size',     '/guides/how-to-reduce-pdf-file-size'],
    ['Fill a PDF Form with AI',  '/guides/how-to-fill-out-a-pdf-form-automatically'],
    ['Sign a PDF Online',        '/guides/how-to-sign-a-pdf-online'],
    ['Make a PDF Searchable',    '/guides/how-to-make-a-scanned-pdf-searchable'],
    ['Merge PDF Files',          '/guides/how-to-merge-pdf-files'],
  ]},
  { title: 'Company', color: '#374151', links: [
    ['Pricing',         '/pricing'],
    ['About Us',        '/about'],
    ['Privacy Policy',  '/privacy'],
    ['Terms of Service','/terms'],
    ['Contact',         '/contact'],
    ['Support',         '/support'],
  ]},
]

export default function SiteFooter() {
  return (
    <footer className="home-footer" style={{ background: '#f5f5f7', borderTop: '1px solid #e5e5ea', padding: '56px 28px 0' }}>
      <style>{`
        .sf-footer-grid { display:grid; grid-template-columns:1.45fr repeat(4,minmax(0,1fr)); gap:28px; align-items:start; margin-bottom:48px; }
        @media(max-width:900px){ .sf-footer-grid{ grid-template-columns:1fr 1fr !important; gap:32px !important; } }
        .sf-mobile-cols { display:none; }
        @media(max-width:600px){
          .sf-footer-grid{ grid-template-columns:1fr !important; gap:20px !important; }
          .sf-desktop-cols { display:none !important; }
          .sf-mobile-cols { display:grid; gap:8px; }
          .sf-mobile-col { border:1px solid #dedee3; border-radius:12px; background:#fff; overflow:hidden; }
          .sf-mobile-col summary { display:flex; align-items:center; justify-content:space-between; gap:12px; min-height:52px; padding:0 16px; cursor:pointer; list-style:none; }
          .sf-mobile-col summary::-webkit-details-marker { display:none; }
          .sf-mobile-col summary span:last-child { font-size:20px; color:#6b7280; transition:transform .15s ease; }
          .sf-mobile-col[open] summary span:last-child { transform:rotate(45deg); }
          .sf-mobile-links { padding:0 12px 10px; border-top:1px solid #ececf0; }
          .sf-mobile-links .sf-link { padding:0 4px; }
          .sf-categories { display:none !important; }
          .sf-bottom-bar { align-items:stretch !important; }
          .sf-bottom-copy { width:100%; }
          .sf-bottom-cta { width:100%; min-height:48px; }
        }
        .sf-link { display:block; font-size:13px; color:#5b6472; text-decoration:none; font-weight:500; margin-bottom:10px; letter-spacing:-0.01em; transition:color .12s, transform .12s; }
        .sf-link:hover { color:#1d1d1f; transform:translateX(3px); }
        .sf-bot-link { font-size:11px; color:#5b6472; text-decoration:none; font-weight:500; transition:color .12s; }
        .sf-bot-link:hover { color:#374151; }
      `}</style>

      <Container flush>
        <div className="sf-footer-grid">

          {/* Brand */}
          <div>
            <Link prefetch={false} href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginBottom: 14 }}>
              <Image src="/logo-v2.svg" alt="EditPDF AI" width={600} height={200} sizes="144px" style={{ height: 48, width: 'auto', display: 'block' }} />
            </Link>

            <p style={{ ...FI, fontSize: 13, color: '#5b6472', lineHeight: 1.7, maxWidth: 220, margin: '0 0 16px' }}>
              {PRODUCT_ACCESS_SUMMARY}
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(22,163,74,.06)', border: '1px solid rgba(22,163,74,.16)', borderRadius: 10, marginBottom: 20, maxWidth: 240 }}>
              <Lock size={13} color="#16a34a" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ ...FI, fontSize: 11.5, color: '#374151', lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: '#166534' }}>How processing works.</strong> {PROCESSING_PRIVACY_SUMMARY}
              </p>
            </div>

            <div className="sf-categories" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {TOOL_CATEGORIES.map(category => {
                const Icon = CATEGORY_ICONS[category.id]
                return (
                  <span key={category.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...MONO, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${category.color}12`, color: category.color, letterSpacing: '.06em' }}>
                    <Icon size={9} strokeWidth={2.5} />{category.shortLabel.toUpperCase()}
                  </span>
                )
              })}
            </div>
            <a
              href={TRUSTPILOT_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...FI, minHeight: 44, display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18, color: 'var(--color-text)', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}
            >
              View the EditPDF AI profile on Trustpilot <span aria-hidden="true">↗</span>
            </a>
            <p style={{ ...MONO, fontSize: 10, color: '#5b6472', letterSpacing: '0.04em' }}>
              © {new Date().getFullYear()} EditPDF AI. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {toolCols.map(({ title, color, links }) => (
            <div className="sf-desktop-cols" key={title}>
              <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                {title}
              </div>
              {links.map(([l, h]) => (
                <Link prefetch={false} key={l} href={h} className="sf-link" style={FI}>{l}</Link>
              ))}
            </div>
          ))}

          <div className="sf-mobile-cols">
            {toolCols.map(({ title, color, links }) => (
              <details className="sf-mobile-col" key={title}>
                <summary>
                  <span style={{ ...MONO, fontSize: 11, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {title}
                  </span>
                  <span aria-hidden="true">+</span>
                </summary>
                <div className="sf-mobile-links">
                  {links.map(([l, h]) => (
                    <Link prefetch={false} key={l} href={h} className="sf-link" style={FI}>{l}</Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sf-bottom-bar" style={{ borderTop: '1px solid #e5e5ea', padding: '16px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div className="sf-bottom-copy" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ ...MONO, fontSize: 10, color: '#5b6472', letterSpacing: '0.04em' }}>
              {TOOL_CATALOGUE_SUMMARY.toUpperCase()}
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
                <Link prefetch={false} key={l} href={h} className="sf-bot-link" style={FI}>{l}</Link>
              ))}
            </div>
          </div>
          <ButtonLink prefetch={false} href="/pdf-editor" size="small" className="sf-bottom-cta">
            <Upload size={11} strokeWidth={2.5} /> Upload PDF
          </ButtonLink>
        </div>
      </Container>
    </footer>
  )
}
