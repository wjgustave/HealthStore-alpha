'use client'

import type { PdpOnThisPageLink } from '@/lib/pdpOnThisPage'

/**
 * In-page section nav — sticky sidebar beside PDP content.
 * Active section: bold label + 5px vertical line (GOV.UK contents-list pattern).
 * Selection is controlled by PdpSectionSwitcher (hash + one visible panel).
 */
export default function PdpOnThisPage({
  links,
  title = 'On this page',
  activeId = null,
}: {
  links: PdpOnThisPageLink[]
  /** Heading above the contents list — defaults to "On this page" (PDP passes the product name). */
  title?: string
  activeId?: string | null
}) {
  if (links.length < 2) return null

  const current = activeId ?? links[0]?.id ?? null

  return (
    <nav className="hs-on-this-page" aria-label="On this page">
      <strong className="hs-on-this-page__title">{title}</strong>
      <ul className="hs-on-this-page__list">
        {links.map((link) => {
          const isActive = link.id === current
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`hs-on-this-page__link${isActive ? ' hs-on-this-page__link--active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {link.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
