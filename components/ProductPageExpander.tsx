'use client'

import { useEffect, useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { usePdpSharePrintOptional } from '@/components/PdpSharePrintContext'

/**
 * @deprecated Use `PdpSharePrintProvider` from `@/components/PdpSharePrintContext`.
 */
export { PdpSharePrintProvider as PdpPrintExpandProvider } from '@/components/PdpSharePrintContext'

/**
 * Spacing wrapper removed — each expander is its own card; parent uses `space-y-3`.
 * @deprecated Use a fragment; kept for compatibility.
 */
export function ProductPageExpanderGroup({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/**
 * Per-section collapsible card: title + optional description + chevron.
 * Elevation: `hs-surface-card-sm` when collapsed, `hs-surface-card` (md) when expanded.
 * When used under `PdpSharePrintProvider`, pass `shareKey` so selective print/PDF can include or omit the section.
 */
export function ProductPageExpander({
  title,
  description,
  defaultOpen = false,
  id,
  shareKey,
  children,
}: {
  title: string
  description?: string
  defaultOpen?: boolean
  id?: string
  /** Stable id for selective share/print (PDP). */
  shareKey?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const ctx = usePdpSharePrintOptional()
  const printLayout = ctx?.printLayout ?? { mode: 'none' as const }
  const registerBlock = ctx?.registerBlock

  useEffect(() => {
    if (!shareKey || !registerBlock) return undefined
    return registerBlock(shareKey, title, description)
  }, [shareKey, title, description, registerBlock])

  const mode = printLayout.mode
  const expandForPrint =
    mode === 'all' ||
    (mode === 'include' && !!shareKey && printLayout.keys.has(shareKey))
  const hideForPrint =
    mode === 'include' && !!shareKey && !printLayout.keys.has(shareKey)

  const effectiveOpen = open || expandForPrint
  const panelId = useId()
  const headingId = useId()

  useEffect(() => {
    if (!id) return
    function sync() {
      if (typeof window !== 'undefined' && window.location.hash === `#${id}`) {
        setOpen(true)
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      className={`overflow-visible rounded-xl border bg-white transition-shadow duration-200 ease-out ${effectiveOpen ? 'hs-surface-card' : 'hs-surface-card-sm'} ${hideForPrint ? 'pdp-share-excluded-print' : ''}`.trim()}
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 p-6 text-left transition-colors hover:bg-[#F7F9FC]/80 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD800]"
        style={{ fontFamily: 'var(--font-display)' }}
        aria-expanded={effectiveOpen}
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
          className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-200 ease-out ${effectiveOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        hidden={!effectiveOpen}
        className="border-t px-6 pb-6 pt-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="pt-4">{children}</div>
      </div>
    </section>
  )
}
