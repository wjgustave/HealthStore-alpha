'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { parseHomeVariant } from '@/lib/homeVariant'
import { HomeLayoutOriginal } from './HomeLayoutOriginal'
import { HomeLayoutV4, type HomeLayoutV4Props } from './HomeLayoutV4'

const STORAGE_KEY = 'healthstore_home_layout'

function HomeBelowInner(props: HomeLayoutV4Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const param = searchParams.get('home')
  const variant = parseHomeVariant(param ?? undefined)

  useEffect(() => {
    if (param === 'v3' || param === 'v4') {
      try {
        localStorage.setItem(STORAGE_KEY, 'v2')
      } catch {
        /* ignore */
      }
      router.replace('/?home=v2')
      return
    }
    if (param === 'v1' || param === 'v2') {
      try {
        localStorage.setItem(STORAGE_KEY, param)
      } catch {
        /* ignore */
      }
      return
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as string | null
      if (stored === 'v3' || stored === 'v4') {
        try {
          localStorage.setItem(STORAGE_KEY, 'v2')
        } catch {
          /* ignore */
        }
        router.replace('/?home=v2')
        return
      }
      if (stored === 'v1' || stored === 'v2') {
        router.replace(`/?home=${stored}`)
      }
    } catch {
      /* ignore */
    }
  }, [param, router])

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 pt-10">
      {variant === 'v1' && <HomeLayoutOriginal {...props} />}
      {variant === 'v2' && <HomeLayoutV4 {...props} />}
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
