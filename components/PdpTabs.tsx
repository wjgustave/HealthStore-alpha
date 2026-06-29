'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { usePdpSharePrintOptional } from '@/components/PdpSharePrintContext'

export type PdpTab = {
  id: string
  label: string
  anchors?: string[]
  panel: ReactNode
}

export function PdpTabs({ tabs }: { tabs: PdpTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const ctx = usePdpSharePrintOptional()
  const printing = (ctx?.printLayout.mode ?? 'none') !== 'none'

  useEffect(() => {
    function activateForHash() {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash) return
      const match = tabs.find(t => t.anchors?.includes(hash))
      if (!match) return
      setActive(match.id)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
    }
    const raf = requestAnimationFrame(activateForHash)
    window.addEventListener('hashchange', activateForHash)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('hashchange', activateForHash)
    }
  }, [tabs])

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
    <div className="hs-tabs">
      <h2 className="hs-tabs__title">Contents</h2>
      <ul
        className="hs-tabs__list print:hidden"
        role="tablist"
        aria-label="Product information sections"
      >
        {tabs.map((t, i) => {
          const selected = t.id === active
          return (
            <li key={t.id} className="hs-tabs__item" role="presentation">
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
                className="hs-tabs__tab"
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
            className={`hs-tabs__panel${show ? '' : ' hs-tabs__panel--hidden'}`}
            hidden={!show}
            tabIndex={0}
          >
            {printing ? (
              <h2 className="mb-4 mt-2 text-lg font-bold" style={{ color: '#005eb8' }}>
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
