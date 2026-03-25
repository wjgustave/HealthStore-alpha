'use client'

import { useEffect, useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Spacing wrapper removed — each expander is its own card; parent uses `space-y-3`.
 * @deprecated Use a fragment; kept for compatibility.
 */
export function ProductPageExpanderGroup({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/**
 * Per-section collapsible card: title + optional description + chevron;
 * White bordered card with `hs-surface-card` elevation; vertical rhythm via parent `space-y-3`.
 */
export function ProductPageExpander({
  title,
  description,
  defaultOpen = false,
  id,
  children,
}: {
  title: string
  description?: string
  defaultOpen?: boolean
  id?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const headingId = useId()

  useEffect(() => {
    if (id !== 'clinical-evidence') return
    function sync() {
      if (typeof window !== 'undefined' && window.location.hash === '#clinical-evidence') {
        setOpen(true)
        requestAnimationFrame(() => {
          document.getElementById('clinical-evidence')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [id])

  return (
    <section
      id={id}
      className="hs-surface-card overflow-hidden rounded-xl border bg-white"
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 p-6 text-left transition-colors hover:bg-[#F7F9FC]/80 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD800]"
        style={{ fontFamily: 'var(--font-display)' }}
        aria-expanded={open}
        aria-controls={panelId}
        aria-labelledby={headingId}
        onClick={() => setOpen(o => !o)}
      >
        <div className="min-w-0 flex-1">
          <span
            id={headingId}
            role="heading"
            aria-level={2}
            className="block font-bold leading-snug"
            style={{ fontSize: 'var(--text-card-title)', color: '#005EB8' }}
          >
            {title}
          </span>
          {description ? (
            <p
              className="mt-1 leading-normal"
              style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}
            >
              {description}
            </p>
          ) : null}
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="border-t px-6 pb-6 pt-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="pt-4">{children}</div>
      </div>
    </section>
  )
}
