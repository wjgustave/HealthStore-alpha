'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { HomeLayoutV4 } from '@/components/home/HomeLayoutV4'
import { DashboardV2 } from './DashboardV2'
import { DashboardV3 } from './DashboardV3'
import { DashboardV4 } from './DashboardV4'
import type { DashboardVariantProps } from './types'

const STORAGE_KEY = 'healthstore_dashboard_view'

const VIEWS = [
  { id: 'v1', label: 'Version 1 (current)' },
  { id: 'v2', label: 'Version 2' },
  { id: 'v3', label: 'Version 3' },
  { id: 'v4', label: 'Version 4' },
] as const

type ViewId = (typeof VIEWS)[number]['id']

function isViewId(value: string | null | undefined): value is ViewId {
  return value === 'v1' || value === 'v2' || value === 'v3' || value === 'v4'
}

export function DashboardSwitcher(props: DashboardVariantProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlView = searchParams.get('view')

  // The URL is the single source of truth for the active view (SSR-safe, defaults to V1).
  const view: ViewId = isViewId(urlView) ? urlView : 'v1'

  // When arriving without an explicit ?view=, restore the last choice from localStorage by
  // reflecting it into the URL (no setState in the effect — mirrors HomeBelowInner).
  useEffect(() => {
    if (isViewId(urlView)) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (isViewId(stored) && stored !== 'v1') {
        const params = new URLSearchParams(searchParams.toString())
        params.set('view', stored)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
    } catch {
      /* ignore */
    }
  }, [urlView, pathname, router, searchParams])

  function selectView(next: ViewId) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Prototype views
        </span>
        <div
          role="tablist"
          aria-label="Dashboard design versions"
          className="inline-flex flex-wrap items-center gap-1 rounded-lg border bg-white p-1"
          style={{ borderColor: 'var(--border)' }}
        >
          {VIEWS.map(v => {
            const active = v.id === view
            return (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectView(v.id)}
                className="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  background: active ? 'var(--nhs-blue)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {v.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        {view === 'v1' ? <HomeLayoutV4 {...props} /> : null}
        {view === 'v2' ? <DashboardV2 {...props} /> : null}
        {view === 'v3' ? <DashboardV3 {...props} /> : null}
        {view === 'v4' ? <DashboardV4 {...props} /> : null}
      </div>
    </div>
  )
}
