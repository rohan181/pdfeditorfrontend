'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import toolMeta from '@/lib/toolMeta'
import { TOOL_CATEGORIES, getCategoryTools, getToolAccessPresentation } from '@/lib/toolDiscovery'

const HomeAllTools = dynamic(() => import('./HomeAllTools'), {
  ssr: false,
  loading: () => <ToolsPlaceholder />,
})

function ToolsPlaceholder() {
  return (
    <section
      className="home-responsive-section tools-fallback-section"
      id="tools"
      aria-labelledby="tools-fallback-heading"
      style={{ minHeight: 900, padding: '88px 28px', background: '#f8f8fa', borderTop: '1px solid #f0f0f0' }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <p style={{ margin: '0 0 12px', color: '#5b6472', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          All PDF tools
        </p>
        <h2 id="tools-fallback-heading" style={{ margin: '0 0 16px', color: '#1d1d1f', fontSize: 'clamp(28px,3.5vw,46px)', lineHeight: .96, letterSpacing: '-.05em' }}>
          Find the right PDF tool by task
        </h2>
        <p style={{margin:'0 0 40px',maxWidth:760,color:'#5b6472',fontSize:15,lineHeight:1.7}}>
          Browse all {toolMeta.length} active tools in seven clear categories. Interactive task search loads as this section enters view.
        </p>
        <nav className="tools-fallback-grid" aria-label="PDF tool categories" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 18 }}>
          {TOOL_CATEGORIES.map(category => (
            <section id={`tools-${category.id}`} key={category.id} style={{padding:22,background:'#fff',border:'1px solid #E2E8F0',borderRadius:16}}>
              <h3 style={{margin:'0 0 8px',color:category.color,fontSize:18}}>{category.label}</h3>
              <p style={{margin:'0 0 16px',color:'#5b6472',fontSize:13,lineHeight:1.6}}>{category.description}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {getCategoryTools(category).map(tool => {
                  const access = getToolAccessPresentation(tool.access)
                  return (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      aria-label={`${tool.name}: ${tool.desc}. ${access.summary}`}
                      style={{minHeight:44,display:'inline-flex',alignItems:'center',padding:'7px 10px',color:category.color,background:`${category.color}0d`,borderRadius:8,textDecoration:'none',fontSize:12,fontWeight:650}}
                    >
                      {tool.name} · {access.badges.map(badge => badge.label).join(' + ')}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default function LazyHomeAllTools() {
  const boundaryRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const boundary = boundaryRef.current
    if (!boundary) return

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(boundary)
    return () => observer.disconnect()
  }, [])

  return <div ref={boundaryRef}>{shouldLoad ? <HomeAllTools /> : <ToolsPlaceholder />}</div>
}
