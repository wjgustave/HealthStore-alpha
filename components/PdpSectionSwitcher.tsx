'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import PdpOnThisPage from '@/components/PdpOnThisPage'
import { PdpActiveSectionProvider } from '@/components/PdpActiveSection'
import type { PdpOnThisPageLink } from '@/lib/pdpOnThisPage'

const SWITCHER_ID = 'hs-pdp-section-switcher'

/**
 * Sticky PDP contents list + one visible main-column section at a time.
 * Deep links keep using `#section-id`; snapshot cards that already point at those
 * hashes switch the panel instead of scrolling a long page.
 */
export default function PdpSectionSwitcher({
  links,
  title,
  children,
}: {
  links: PdpOnThisPageLink[]
  title?: string
  children: ReactNode
}) {
  const ids = useMemo(() => links.map((l) => l.id), [links])
  const fallbackId = links[0]?.id ?? null
  const [activeId, setActiveId] = useState<string | null>(fallbackId)

  const applyHash = useCallback(
    (hash: string) => {
      if (hash && ids.includes(hash)) {
        setActiveId(hash)
        return
      }
      setActiveId(fallbackId)
    },
    [ids, fallbackId],
  )

  useEffect(() => {
    applyHash(window.location.hash.replace(/^#/, ''))
  }, [applyHash])

  useEffect(() => {
    function onHashChange() {
      applyHash(window.location.hash.replace(/^#/, ''))
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
    }
  }, [applyHash])

  useEffect(() => {
    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest('a[href^="#"]')
      if (!(link instanceof HTMLAnchorElement)) return
      const hash = link.hash.replace(/^#/, '')
      if (!hash || !ids.includes(hash)) return
      event.preventDefault()
      setActiveId(hash)
      if (window.location.hash !== `#${hash}`) {
        history.pushState(null, '', `#${hash}`)
      }
      document.getElementById(SWITCHER_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    document.addEventListener('click', onAnchorClick)
    return () => document.removeEventListener('click', onAnchorClick)
  }, [ids])

  if (links.length < 2) return children

  return (
    <PdpActiveSectionProvider activeId={activeId}>
      <div
        id={SWITCHER_ID}
        className="hs-pdp-with-sidebar hs-pdp-section-switcher"
        data-pdp-active-section={activeId ?? undefined}
      >
        <aside className="hs-pdp-with-sidebar__aside">
          <PdpOnThisPage links={links} title={title} activeId={activeId} />
        </aside>
        <div className="hs-pdp-with-sidebar__main">{children}</div>
      </div>
    </PdpActiveSectionProvider>
  )
}
