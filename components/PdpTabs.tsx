'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { usePdpSharePrintOptional } from '@/components/PdpSharePrintContext'

export type PdpTab = {
  id: string
  label: string
  anchors?: string[]
  panel: ReactNode
}

/**
 * NHS Design System–styled tabs for the PDP main column.
 * https://service-manual.nhs.uk/design-system/components/tabs
 */
export function PdpTabs({ tabs }: { tabs: PdpTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const ctx = usePdpSharePrintOptional()
  const printing = (ctx?.printLayout.mode ?? 'none') !== 'none'

  const anchorHashes = useMemo(
    () => new Set(tabs.flatMap(t => t.anchors ?? [])),
    [tabs],
  )

  const tabForHash = useCallback(
    (hash: string) => tabs.find(t => t.anchors?.includes(hash)),
    [tabs],
  )

  const scrollToHash = useCallback((hash: string) => {
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const activateForHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const match = tabForHash(hash)
    if (!match) return
    flushSync(() => setActive(match.id))
    scrollToHash(hash)
  }, [tabForHash, scrollToHash])

  useEffect(() => {
    activateForHash()
    window.addEventListener('hashchange', activateForHash)
    return () => window.removeEventListener('hashchange', activateForHash)
  }, [activateForHash])

  // Snapshot deep-links use plain <a href="#…">; intercept so the target tab opens
  // before scroll (content lives inside hidden panels) and same-hash re-clicks work.
  useEffect(() => {
    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest('a[href^="#"]')
      if (!(link instanceof HTMLAnchorElement)) return
      const hash = link.hash.replace(/^#/, '')
      if (!hash || !anchorHashes.has(hash)) return
      const match = tabForHash(hash)
      if (!match) return
      event.preventDefault()
      if (window.location.hash !== link.hash) {
        window.location.hash = hash
      } else {
        flushSync(() => setActive(match.id))
        scrollToHash(hash)
      }
    }
    document.addEventListener('click', onAnchorClick)
    return () => document.removeEventListener('click', onAnchorClick)
  }, [anchorHashes, tabForHash, scrollToHash])

  function focusTab(index: number) {
    const clamped = (index + tabs.length) % tabs.length
    const tab = tabs[clamped]
    if (!tab) return
    setActive(tab.id)
    tabRefs.current[clamped]?.focus()
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        focusTab(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        focusTab(index - 1)
        break
      case 'Home':
        e.preventDefault()
        focusTab(0)
        break
      case 'End':
        e.preventDefault()
        focusTab(tabs.length - 1)
        break
      default:
        break
    }
  }

  return (
    // [Provenance: NHS] Official NHS Tabs CSS. `js-enabled` activates the NHS
    // tab-strip styling (NHS gates it on JS); our React controls active state.
    <div className="nhsuk-tabs js-enabled">
      <h2 className="nhsuk-tabs__title">Contents</h2>
      <ul
        className="nhsuk-tabs__list print:hidden"
        role="tablist"
        aria-label="Product information sections"
      >
        {tabs.map((t, i) => {
          const selected = t.id === active
          return (
            <li
              key={t.id}
              className={`nhsuk-tabs__list-item${selected ? ' nhsuk-tabs__list-item--selected' : ''}`}
              role="presentation"
            >
              <button
                type="button"
                ref={el => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`${baseId}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                className="nhsuk-tabs__tab"
                onClick={() => setActive(t.id)}
                onKeyDown={e => onKeyDown(e, i)}
              >
                {t.label}
              </button>
            </li>
          )
        })}
      </ul>

      {tabs.map(t => {
        const selected = t.id === active
        const show = selected || printing
        return (
          <div
            key={t.id}
            role="tabpanel"
            id={`${baseId}-panel-${t.id}`}
            aria-labelledby={`${baseId}-tab-${t.id}`}
            className={`nhsuk-tabs__panel${show ? '' : ' nhsuk-tabs__panel--hidden'}`}
            hidden={!show}
            tabIndex={0}
          >
            {printing ? (
              <h2 className="mb-4 mt-2 hs-text-card-title-sm hs-font-bold" style={{ color: 'var(--nhs-blue)' }}>
                {t.label}
              </h2>
            ) : null}
            {t.panel}
          </div>
        )
      })}
    </div>
  )
}
