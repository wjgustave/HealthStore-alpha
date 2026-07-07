'use client'

import { useEffect, useState } from 'react'
import type { PdpOnThisPageLink } from '@/lib/pdpOnThisPage'

const SCROLL_OFFSET_PX = 120

function isSectionVisible(el: HTMLElement): boolean {
  return el.getClientRects().length > 0
}

/**
 * In-page section nav — sticky sidebar beside PDP content.
 * Active section: bold label + 5px vertical line (GOV.UK contents-list pattern).
 */
export default function PdpOnThisPage({ links }: { links: PdpOnThisPageLink[] }) {
  const [activeId, setActiveId] = useState<string | null>(links[0]?.id ?? null)

  useEffect(() => {
    if (links.length === 0) return

    const sectionIds = links.map((l) => l.id)

    const visibleSections = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el != null && isSectionVisible(el))

    const updateFromScroll = () => {
      const marker = window.scrollY + SCROLL_OFFSET_PX
      const sections = visibleSections()
      if (sections.length === 0) return

      let current = sections[0].id
      for (const section of sections) {
        const top = section.getBoundingClientRect().top + window.scrollY
        if (top <= marker) {
          current = section.id
        }
      }
      setActiveId(current)
    }

    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (hash && sectionIds.includes(hash)) {
        setActiveId(hash)
      } else {
        updateFromScroll()
      }
    }

    syncFromHash()
    updateFromScroll()

    window.addEventListener('scroll', updateFromScroll, { passive: true })
    window.addEventListener('hashchange', syncFromHash)

    return () => {
      window.removeEventListener('scroll', updateFromScroll)
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [links])

  if (links.length < 2) return null

  return (
    <nav className="hs-on-this-page" aria-label="On this page">
      <strong className="hs-on-this-page__title">On this page</strong>
      <ul className="hs-on-this-page__list">
        {links.map((link) => {
          const isActive = link.id === activeId
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`hs-on-this-page__link${isActive ? ' hs-on-this-page__link--active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
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
