'use client'

import type { ReactNode } from 'react'
import { Collapsible } from '@/components/Collapsible'

/**
 * @deprecated Use `PdpSharePrintProvider` from `@/components/PdpSharePrintContext`.
 */
export { PdpSharePrintProvider as PdpPrintExpandProvider } from '@/components/PdpSharePrintContext'

/**
 * @deprecated Use a fragment; kept for compatibility.
 */
export function ProductPageExpanderGroup({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/**
 * @deprecated Use `<Collapsible variant="expander">` from `@/components/Collapsible`.
 */
export function ProductPageExpander(props: {
  title: string
  description?: string
  defaultOpen?: boolean
  id?: string
  shareKey?: string
  children: ReactNode
}) {
  return <Collapsible variant="expander" {...props} />
}
