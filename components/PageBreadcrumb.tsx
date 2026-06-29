import Link from 'next/link'

export type PageBreadcrumbItem = { label: string; href?: string }

const HOME_CRUMB: PageBreadcrumbItem = { label: 'Home', href: '/' }

/**
 * Breadcrumb. [Provenance: NHS]
 *
 * Renders the official NHS Breadcrumb (`.nhsuk-breadcrumb`). Ancestor crumbs are
 * links; the current page is shown as a plain item to preserve product behaviour.
 * The NHS mobile back-link (`.nhsuk-breadcrumb__back`) points at the parent crumb.
 */
export function PageBreadcrumb({
  items,
  className = '',
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

  // Ancestors shown in the list; the parent is also used for the mobile back link.
  const ancestors = trail.slice(0, -1)
  const current = trail[trail.length - 1]
  const parent = ancestors[ancestors.length - 1]

  return (
    <nav className={`nhsuk-breadcrumb${className ? ` ${className}` : ''}`} aria-label="Breadcrumb">
      <ol className="nhsuk-breadcrumb__list">
        {ancestors.map((item, i) => (
          <li key={`${i}-${item.label}`} className="nhsuk-breadcrumb__item">
            {item.href ? (
              <Link className="nhsuk-breadcrumb__link" href={item.href}>
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </li>
        ))}
        <li className="nhsuk-breadcrumb__item" aria-current="page">
          {current.label}
        </li>
      </ol>
      {parent?.href ? (
        <p className="nhsuk-breadcrumb__back">
          <Link className="nhsuk-breadcrumb__backlink" href={parent.href}>
            Back to {parent.label}
          </Link>
        </p>
      ) : null}
    </nav>
  )
}
