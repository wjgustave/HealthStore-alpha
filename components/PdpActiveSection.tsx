'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { usePdpSharePrintOptional } from '@/components/PdpSharePrintContext'

const PdpActiveSectionContext = createContext<string | null>(null)

export function PdpActiveSectionProvider({
  activeId,
  children,
}: {
  activeId: string | null
  children: ReactNode
}) {
  return (
    <PdpActiveSectionContext.Provider value={activeId}>
      {children}
    </PdpActiveSectionContext.Provider>
  )
}

/** Active "On this page" section id, or null when the page is not section-switching. */
export function usePdpActiveSection(): string | null {
  return useContext(PdpActiveSectionContext)
}

/**
 * Keeps the section mounted (share/print registration) but hides it when another
 * nav item is selected. No-ops outside a switcher, and while printing.
 */
export function PdpSectionPanel({
  id,
  children,
}: {
  id?: string
  children: ReactNode
}) {
  const activeId = usePdpActiveSection()
  const printing = (usePdpSharePrintOptional()?.printLayout.mode ?? 'none') !== 'none'
  const hide = Boolean(id && activeId && id !== activeId && !printing)

  return (
    <div data-pdp-section-id={id} hidden={hide || undefined}>
      {children}
    </div>
  )
}
