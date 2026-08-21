'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpRight,
  ChevronDown,
  FilePenLine,
  FileSearch,
  FileType2,
  Layers3,
  Minimize2,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import toolMeta, { type ToolMeta } from '@/lib/toolMeta'
import {
  TOOL_CATEGORIES,
  getCategoryTools,
  getToolAccessPresentation,
  getToolCategory,
  searchTools,
  type ToolCategory,
  type ToolCategoryId,
} from '@/lib/toolDiscovery'

const CATEGORY_ICONS: Record<ToolCategoryId, LucideIcon> = {
  ai: Sparkles,
  edit: FilePenLine,
  convert: FileType2,
  organize: Layers3,
  compress: Minimize2,
  protect: ShieldCheck,
  extract: FileSearch,
}

const BADGE_STYLES = {
  free: { background: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' },
  ai: { background: '#F5F3FF', color: '#6D28D9', borderColor: '#DDD6FE' },
  pro: { background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' },
}

function AccessBadges({ tool }: { tool: ToolMeta }) {
  const access = getToolAccessPresentation(tool.access)
  return (
    <div className="tool-directory-access" aria-label={`Access: ${access.badges.map(badge => badge.label).join(' and ')}. ${access.summary}`}>
      {access.badges.map(badge => (
        <span key={badge.label} style={BADGE_STYLES[badge.kind]}>{badge.label}</span>
      ))}
    </div>
  )
}

function ToolCard({ tool }: { tool: ToolMeta }) {
  const category = getToolCategory(tool.slug) ?? TOOL_CATEGORIES[0]
  const Icon = CATEGORY_ICONS[category.id]
  const access = getToolAccessPresentation(tool.access)

  return (
    <Link
      href={`/${tool.slug}`}
      prefetch={false}
      className="tool-directory-card"
      aria-label={`${tool.name}: ${tool.desc}. ${access.summary}`}
      style={{ '--tool-accent': category.color } as React.CSSProperties}
    >
      <div className="tool-directory-card-head">
        <span className="tool-directory-icon" aria-hidden="true"><Icon size={19} strokeWidth={1.9} /></span>
        <AccessBadges tool={tool} />
      </div>
      <span className="tool-directory-name">{tool.name}</span>
      <span className="tool-directory-description">{tool.desc}</span>
      <span className="tool-directory-access-copy">{access.summary}</span>
      <span className="tool-directory-open">Open {tool.name}<ArrowUpRight size={13} aria-hidden="true" /></span>
    </Link>
  )
}

function CategorySection({
  category,
  mobileOpen,
  onToggle,
}: {
  category: ToolCategory
  mobileOpen: boolean
  onToggle: () => void
}) {
  const Icon = CATEGORY_ICONS[category.id]
  const tools = getCategoryTools(category)
  const panelId = `tools-${category.id}-panel`

  return (
    <section id={`tools-${category.id}`} className="tool-directory-category" aria-labelledby={`tools-${category.id}-heading`}>
      <div className="tool-directory-category-header">
        <span className="tool-directory-category-icon" style={{ color: category.color, background: `${category.color}12`, borderColor: `${category.color}2b` }} aria-hidden="true">
          <Icon size={21} strokeWidth={1.9} />
        </span>
        <span className="tool-directory-category-copy">
          <h3 id={`tools-${category.id}-heading`}>{category.label}</h3>
          <span>{category.description}</span>
        </span>
        <span className="tool-directory-count" style={{ color: category.color, background: `${category.color}0d` }}>{tools.length} {tools.length === 1 ? 'tool' : 'tools'}</span>
        <button
          type="button"
          className="tool-directory-category-toggle"
          onClick={onToggle}
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          aria-label={`${mobileOpen ? 'Collapse' : 'Expand'} ${category.label}`}
        >
          <ChevronDown size={19} aria-hidden="true" />
        </button>
      </div>
      <div id={panelId} className={`tool-directory-grid${mobileOpen ? ' is-open' : ''}`}>
        {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </section>
  )
}

export default function HomeAllTools() {
  const [search, setSearch] = useState('')
  const [openCategory, setOpenCategory] = useState<ToolCategoryId | null>('ai')
  const query = search.trim()
  const results = useMemo(() => searchTools(query), [query])
  return (
    <section id="tools" className="tools-directory home-responsive-section" aria-labelledby="tools-directory-heading">
      <div className="tools-directory-inner">
        <header className="tools-directory-intro">
          <span className="tools-directory-eyebrow">All PDF tools</span>
          <h2 id="tools-directory-heading">Find the right PDF tool by task</h2>
          <p>Search all {toolMeta.length} active tools by name or task, or browse the seven categories below.</p>
        </header>

        <div className="tool-search-wrap">
          <Search size={19} aria-hidden="true" />
          <label className="sr-only" htmlFor="tool-directory-search">Search all PDF tools</label>
          <input
            id="tool-directory-search"
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search by task: combine files, shrink a PDF, add a signature…"
            autoComplete="off"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="Clear tool search"><X size={17} aria-hidden="true" /></button>
          )}
        </div>

        <div className="tool-access-legend" aria-label="Tool access labels">
          <span><b className="is-free">Free</b> Core workflow, no account required</span>
          <span><b className="is-ai">AI</b> Signed-in Free allowance applies</span>
          <span><b className="is-pro">Pro</b> Removes the daily AI-action cap</span>
        </div>

        {!query && (
          <nav className="tool-category-jumps" aria-label="Jump to a tool category">
            {TOOL_CATEGORIES.map(category => {
              const Icon = CATEGORY_ICONS[category.id]
              return (
                <a key={category.id} href={`#tools-${category.id}`} style={{ '--category-color': category.color } as React.CSSProperties}>
                  <Icon size={15} aria-hidden="true" />{category.label}
                </a>
              )
            })}
          </nav>
        )}

        <div className="tool-search-results" role="status" aria-live="polite" aria-atomic="true">
          {query ? `${results.length} ${results.length === 1 ? 'tool' : 'tools'} found for “${query}”` : ''}
        </div>

        {query ? (
          results.length > 0 ? (
            <div className="tool-directory-grid is-search-results">
              {results.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          ) : (
            <div className="tool-search-empty" role="status">
              <FileSearch size={28} aria-hidden="true" />
              <h3>No matching tool found</h3>
              <p>Try a task such as “combine files,” “remove password,” “OCR,” or “Word to PDF.”</p>
              <button type="button" onClick={() => setSearch('')}>Browse all categories</button>
            </div>
          )
        ) : (
          <>
            <div className="tool-directory-categories">
              {TOOL_CATEGORIES.map(category => (
                <CategorySection
                  key={category.id}
                  category={category}
                  mobileOpen={openCategory === category.id}
                  onToggle={() => setOpenCategory(current => current === category.id ? null : category.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
