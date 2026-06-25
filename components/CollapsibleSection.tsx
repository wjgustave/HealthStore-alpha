'use client'

import type { ReactNode } from 'react'
import { Collapsible } from '@/components/Collapsible'

type Props = {
  title: string
  description?: string
  defaultOpen?: boolean
  children: ReactNode
}

/** @deprecated Use `<Collapsible variant="card">` from `@/components/Collapsible`. */
export function CollapsibleSection(props: Props) {
  return <Collapsible variant="card" {...props} />
}

/** @deprecated Use `<Collapsible variant="inline">` from `@/components/Collapsible`. */
export function CollapsibleInline(props: Props) {
  return <Collapsible variant="inline" {...props} />
}
