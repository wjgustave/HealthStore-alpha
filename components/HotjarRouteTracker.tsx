'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    hj?: (...args: unknown[]) => void
  }
}

/**
 * Notifies Hotjar on client-side navigations (Next.js App Router).
 * Without this, SPA route changes can appear as a single page in Hotjar.
 * Skips the first run so the initial URL is not double-counted with Hotjar's default load.
 */
export default function HotjarRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstNavigation = useRef(true)

  useEffect(() => {
    if (isFirstNavigation.current) {
      isFirstNavigation.current = false
      return
    }
    const hj = window.hj
    if (typeof hj !== 'function') return
    const query = searchParams.toString()
    const url = query ? `${pathname}?${query}` : pathname
    hj('stateChange', url)
  }, [pathname, searchParams])

  return null
}
