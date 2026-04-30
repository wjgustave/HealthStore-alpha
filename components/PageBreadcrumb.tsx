import Link from 'next/link'
import { Fragment } from 'react'

export type PageBreadcrumbItem = { label: string; href?: string }

const HOME_CRUMB: PageBreadcrumbItem = { label: 'Home', href: '/' }

/**
 * Site IA: Home is L1 (always first when `includeHome`). Find apps, Comparison tool, and Funding directory are L2
 * peers under Home in the primary nav; deeper routes append under the Find-apps branch as needed.
 * Styling matches catalogue: NHS blue links, `/` separators, current page in primary text.
 */
export function PageBreadcrumb({
  items,
  className = 'mb-4',
  includeHome = true,
}: {
  items: PageBreadcrumbItem[]
  className?: string
  /** When true (default), prepends `Home` → `/`. Callers must not pass Home in `items`. */
  includeHome?: boolean
}) {
  if (items.length === 0 && !includeHome) return null

  const trail = includeHome ? [HOME_CRUMB, ...items] : items
  if (trail.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1
          return (
            <Fragment key={`${i}-${item.label}`}>
              {i > 0 ? <li aria-hidden>/</li> : null}
              <li {...(isLast ? { 'aria-current': 'page' as const } : {})}>
                {isLast || !item.href ? (
                  <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="font-medium transition-colors hover:underline"
                    style={{ color: '#005EB8' }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
