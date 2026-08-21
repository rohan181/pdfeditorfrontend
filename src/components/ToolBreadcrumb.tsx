import Link from 'next/link'
import toolMeta from '@/lib/toolMeta'
import { getCategoryHref, getToolCategory } from '@/lib/toolDiscovery'

interface ToolBreadcrumbProps {
  toolName: string
}

export default function ToolBreadcrumb({ toolName }: ToolBreadcrumbProps) {
  const tool = toolMeta.find(item => item.name === toolName)
  const category = tool ? getToolCategory(tool.slug) : undefined

  return (
    <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: '#64748b' }}>
      <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, listStyle: 'none', margin: 0, padding: 0 }}>
        <li>
          <Link href="/" prefetch={false} style={{ color: '#475569', textDecoration: 'none', fontWeight: 650 }}>
            EditPDF AI
          </Link>
        </li>
        <li aria-hidden="true" style={{ color: '#94a3b8' }}>/</li>
        <li>
          <Link href="/#tools" prefetch={false} style={{ color: '#475569', textDecoration: 'none', fontWeight: 650 }}>
            All tools
          </Link>
        </li>
        {category && (
          <>
            <li aria-hidden="true" style={{ color: '#94a3b8' }}>/</li>
            <li>
              <Link href={getCategoryHref(category)} prefetch={false} style={{ color: category.color, textDecoration: 'none', fontWeight: 650 }}>
                {category.label}
              </Link>
            </li>
          </>
        )}
        <li aria-hidden="true" style={{ color: '#94a3b8' }}>/</li>
        <li aria-current="page" style={{ color: '#64748b' }}>{toolName}</li>
      </ol>
    </nav>
  )
}
