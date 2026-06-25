'use client'

import { useEffect, useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
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

    return (
      <section
        id={id}
        className={`overflow-visible rounded-xl border bg-white transition-shadow duration-200 ease-out ${effectiveOpen ? 'hs-surface-card' : 'hs-surface-card-sm'} ${hideForPrint ? 'pdp-share-excluded-print' : ''}`.trim()}
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
              style={{ fontSize: 'var(--text-card-title)', color: 'var(--nhs-blue)' }}
            >
              {title}
            </span>
            {description ? (
              <p className="mt-1 leading-normal" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
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
        <div id={panelId} hidden={!effectiveOpen} className="border-t px-6 pb-6 pt-0" style={{ borderColor: 'var(--border)' }}>
          <div className="pt-4">{children}</div>
        </div>
      </section>
    )
  }

  const ToggleButton = (
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      className="flex-shrink-0 rounded-md border px-2 py-1 text-xs font-semibold transition-colors hover:bg-[#F7F9FC]"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      aria-expanded={open}
      aria-controls={panelId}
    >
      {open ? 'Hide' : 'Show'}
    </button>
  )

  if (variant === 'inline') {
    return (
      <div className="mt-5 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
        <div className="mb-0 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="mb-0.5 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            {description ? (
              <p className="mb-0 text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</p>
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
      <div className="mb-0 flex items-start justify-between gap-3">
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
