'use client'

import { useEffect, useId, useState, type ReactNode } from 'react'
import { SectionHeader } from '@/components/Badges'
import { usePdpSharePrintOptional } from '@/components/PdpSharePrintContext'

export type CollapsibleVariant = 'card' | 'inline' | 'expander'

/**
 * Unified show/hide section (decision COLL-1). One component, three variants:
 *  - `card`     — `.hs-surface-card` with a SectionHeader and a Show/Hide text toggle.
 *  - `inline`   — lighter, top-border separated block for nesting inside a card.
 *  - `expander` — full-width chevron header with PDP hash deep-linking and selective
 *                 print registration (folds in the former `ProductPageExpander`, COLL-2).
 *
 * Shared core: `useId`, open state, and `aria-expanded` / `aria-controls` / `hidden`.
 */
export function Collapsible({
  variant = 'card',
  title,
  description,
  defaultOpen,
  id,
  shareKey,
  children,
}: {
  variant?: CollapsibleVariant
  title: string
  description?: string
  /** Defaults: open for `card`/`inline`, closed for `expander`. */
  defaultOpen?: boolean
  /** `expander` only — hash deep-link target. */
  id?: string
  /** `expander` only — stable key for selective share/print on the PDP. */
  shareKey?: string
  children: ReactNode
}) {
  const isExpander = variant === 'expander'
  const [open, setOpen] = useState(defaultOpen ?? !isExpander)
  const panelId = useId()
  const headingId = useId()

  const ctx = usePdpSharePrintOptional()
  const printLayout = ctx?.printLayout ?? { mode: 'none' as const }
  const registerBlock = ctx?.registerBlock

  useEffect(() => {
    if (!isExpander || !shareKey || !registerBlock) return undefined
    return registerBlock(shareKey, title, description)
  }, [isExpander, shareKey, title, description, registerBlock])

  useEffect(() => {
    if (!isExpander || !id) return
    function sync() {
      if (typeof window !== 'undefined' && window.location.hash === `#${id}`) {
        setOpen(true)
        requestAnimationFrame(() => {
          document.getElementById(id!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [isExpander, id])

  if (isExpander) {
    const mode = printLayout.mode
    const expandForPrint =
      mode === 'all' || (mode === 'include' && !!shareKey && printLayout.keys.has(shareKey))
    const hideForPrint = mode === 'include' && !!shareKey && !printLayout.keys.has(shareKey)
    const effectiveOpen = open || expandForPrint

    // [Provenance: NHS] Official NHS Expander (`.nhsuk-details.nhsuk-expander`),
    // kept controlled so PDP print/hash deep-linking still drive the open state.
    return (
      <details
        id={id}
        className={`nhsuk-details nhsuk-expander ${hideForPrint ? 'pdp-share-excluded-print' : ''}`.trim()}
        open={effectiveOpen}
        onToggle={e => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="nhsuk-details__summary" aria-controls={panelId}>
          <span className="nhsuk-details__summary-text" id={headingId}>
            {title}
          </span>
          {description ? (
            <span className="nhsuk-hint" style={{ display: 'block', marginTop: '0.25rem' }}>
              {description}
            </span>
          ) : null}
        </summary>
        <div id={panelId} className="nhsuk-details__text">
          {children}
        </div>
      </details>
    )
  }

  const ToggleButton = (
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      className="flex-shrink-0 rounded-md border px-2 py-1 hs-text-caption hs-font-bold transition-colors hover:bg-[#F0F4F5]"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      aria-expanded={open}
      aria-controls={panelId}
    >
      {open ? 'Hide' : 'Show'}
    </button>
  )

  if (variant === 'inline') {
    return (
      <div className="mt-6 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
        <div className="mb-0 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 hs-text-label hs-font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            {description ? (
              <p className="mb-0 hs-text-caption" style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</p>
            ) : null}
          </div>
          {ToggleButton}
        </div>
        <div id={panelId} hidden={!open} className="mt-4">
          {children}
        </div>
      </div>
    )
  }

  return (
    <section className="hs-surface-card p-6">
      <div className="mb-0 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <SectionHeader title={title} description={description} />
        </div>
        <div className="mt-1">{ToggleButton}</div>
      </div>
      <div id={panelId} hidden={!open} className="pt-2">
        {children}
      </div>
    </section>
  )
}
