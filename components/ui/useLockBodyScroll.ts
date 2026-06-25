'use client'

import { useEffect } from 'react'

/** Locks `document.body` scroll while `active`, restoring the previous value. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}
