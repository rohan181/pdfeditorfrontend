import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight, FilePen, Eye, Merge, Minimize2, PenTool, Sparkles, Split, ScanText } from 'lucide-react'
import { CardLink, Container, Eyebrow, Heading, Text } from '@/components/ui'
import { toolMetaMap } from '@/lib/toolMeta'
import { PRODUCT_PRIORITY_TOOL_SLUGS, getToolAccessPresentation } from '@/lib/toolDiscovery'

const ICONS: Record<(typeof PRODUCT_PRIORITY_TOOL_SLUGS)[number], LucideIcon> = {
  'pdf-editor': FilePen,
  'pdf-merger': Merge,
  'pdf-compressor': Minimize2,
  'pdf-signer': PenTool,
  'ai-pdf-form-filler': Sparkles,
  'pdf-viewer': Eye,
  'pdf-splitter': Split,
  'pdf-ocr': ScanText,
}

const FI = { fontFamily:'var(--font-dm,system-ui,sans-serif)' }
const MONO: React.CSSProperties = { fontFamily:'ui-monospace,SFMono-Regular,Menlo,"Cascadia Code","Courier New",monospace' }

export default function SitePopularTools() {
  return (
    <section className="home-responsive-section popular-tools-section ds-popular-tools">
      <Container>
        <div className="ds-section-intro">
          <Eyebrow>Verified product priorities</Eyebrow>
          <Heading as="h2">Popular tools for common PDF tasks</Heading>
          <Text size="small" className="ds-section-copy">
            These starting points reflect EditPDF AI’s verified priority workflows—not an invented usage ranking. You can also{' '}
            <Link prefetch={false} href="/#tools">browse every tool by category</Link>.
          </Text>
        </div>
        <div className="popular-tools-grid" style={{display:'flex',flexWrap:'wrap',gap:12}}>
          {PRODUCT_PRIORITY_TOOL_SLUGS.map(slug => {
            const tool = toolMetaMap[slug]
            if (!tool) return null
            const Icon = ICONS[slug]
            const access = getToolAccessPresentation(tool.access)
            const isAi = tool.access !== 'core'
            const iconColor = isAi ? '#6D28D9' : '#1D4ED8'
            return (
              <CardLink
                key={slug}
                href={`/${slug}`}
                prefetch={false}
                variant="tool"
                className="pop-tool-link"
                aria-label={`${tool.name}: ${tool.desc}. ${access.summary}`}
                style={{
                  '--hl-bg': iconColor+'0d', '--hl-border': iconColor+'40', '--hl-shadow': iconColor+'18',
                  display:'inline-flex',alignItems:'center',gap:10,padding:'11px 18px',
                } as React.CSSProperties}
              >
                <span style={{width:32,height:32,borderRadius:9,background:isAi?'#F5F3FF':'#EFF6FF',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}} aria-hidden="true">
                  <Icon size={15} color={iconColor} strokeWidth={2}/>
                </span>
                <span style={{display:'flex',flexDirection:'column',gap:3,minWidth:0}}>
                  <span style={{...FI,fontSize:13.5,fontWeight:700,color:'#0F172A',lineHeight:1.15}}>{tool.name}</span>
                  <span style={{...MONO,fontSize:9,fontWeight:700,letterSpacing:'0.06em',color:isAi?'#6D28D9':'#047857'}}>
                    {access.badges.map(badge => badge.label).join(' + ')}
                  </span>
                </span>
                <ChevronRight size={13} color="#64748B" strokeWidth={2} aria-hidden="true"/>
              </CardLink>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
