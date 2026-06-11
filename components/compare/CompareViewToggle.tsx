'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  COMPARE_VIEW_IDS,
  COMPARE_VIEW_LABELS,
  COMPARE_VIEW_STORAGE_KEY,
  coerceCompareViewId,
  type CompareViewId,
} from '@/lib/compareConfig'

type Props = {
  value: CompareViewId
  onChange: (view: CompareViewId) => void
}

export function useCompareView(): [CompareViewId, (view: CompareViewId) => void] {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const viewFromUrl = coerceCompareViewId(searchParams?.get('view'))

  const [view, setView] = useState<CompareViewId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COMPARE_VIEW_STORAGE_KEY)
      if (stored) return coerceCompareViewId(stored)
    }
    return viewFromUrl
  })

  useEffect(() => {
    setView(viewFromUrl)
  }, [viewFromUrl])

  const setCompareView = useCallback(
    (next: CompareViewId) => {
      setView(next)
      if (typeof window !== 'undefined') {
        localStorage.setItem(COMPARE_VIEW_STORAGE_KEY, next)
      }
      const params = new URLSearchParams(searchParams?.toString() ?? '')
      params.set('view', next)
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  return [view, setCompareView]
}

export default function CompareViewToggle({ value, onChange }: Props) {
  return (
    <div
      className="hs-compare-view-toggle"
      role="group"
      aria-label="Comparison layout"
    >
      <span className="hs-compare-view-toggle__label">Layout</span>
      {COMPARE_VIEW_IDS.map(id => {
        const isActive = value === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            className="hs-compare-view-toggle__btn"
            data-active={isActive ? 'true' : undefined}
          >
            {COMPARE_VIEW_LABELS[id].long}
          </button>
        )
      })}
    </div>
  )
}
