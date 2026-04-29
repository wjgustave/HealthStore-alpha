'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { HOME_LAYOUT_STORAGE_KEY } from '@/lib/homeLayoutStorage'
import { HomeLayoutV4, type HomeLayoutV4Props } from './HomeLayoutV4'

function HomeBelowInner(props: HomeLayoutV4Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const param = searchParams.get('home')

  useEffect(() => {
    try {
      localStorage.setItem(HOME_LAYOUT_STORAGE_KEY, 'v2')
    } catch {
      /* ignore */
    }
    if (param == null) return

    const next = new URLSearchParams(searchParams.toString())
    next.delete('home')
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname || '/', { scroll: false })
  }, [param, pathname, router, searchParams])

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 pt-10">
      <HomeLayoutV4 {...props} />
    </div>
  )
}

function HomeBelowFallback() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-sm text-[var(--text-muted)]">Loading homepage…</p>
    </div>
  )
}

export default function HomeBelowHeroInteractive(props: HomeLayoutV4Props) {
  return (
    <Suspense fallback={<HomeBelowFallback />}>
      <HomeBelowInner {...props} />
    </Suspense>
  )
}

export type { HomeFragmentsProps } from './HomeFragments'
