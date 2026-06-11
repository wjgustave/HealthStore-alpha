'use client'

import { createContext, useContext } from 'react'
import type { DesignId } from '@/lib/design/config'
import { DEFAULT_DESIGN } from '@/lib/design/config'

const DesignContext = createContext<DesignId>(DEFAULT_DESIGN)

export function DesignProvider({
  design,
  children,
}: {
  design: DesignId
  children: React.ReactNode
}) {
  return <DesignContext.Provider value={design}>{children}</DesignContext.Provider>
}

/** Active design id for client components that need to branch layout/markup. */
export function useDesign(): DesignId {
  return useContext(DesignContext)
}

/** Convenience: true when the editorial (v2) design is active. */
export function useIsEditorial(): boolean {
  return useContext(DesignContext) === 'b'
}
