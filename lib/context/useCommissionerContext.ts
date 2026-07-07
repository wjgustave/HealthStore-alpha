'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  CommissionerContext,
  DEFAULT_CONTEXT,
  contextFromSearchParams,
  contextToSearchParams,
  mergeContext,
} from './types'

const COOKIE_NAME = 'hs-commissioner-context'
const MAX_AGE = 60 * 60 * 24 * 30

function readCookie(): CommissionerContext | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return null
  }
}

function writeCookie(ctx: CommissionerContext) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(ctx))}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
}

export function useCommissionerContext() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [context, setContextState] = useState<CommissionerContext>(DEFAULT_CONTEXT)

  useEffect(() => {
    const fromUrl = contextFromSearchParams(searchParams)
    const hasUrl = searchParams.toString().length > 0
    const fromCookie = readCookie()
    const merged = mergeContext(DEFAULT_CONTEXT, hasUrl ? fromUrl : fromCookie ?? DEFAULT_CONTEXT)
    setContextState(merged)
    writeCookie(merged)
  }, [searchParams])

  const setContext = useCallback(
    (patch: Partial<CommissionerContext>, options?: { navigateTo?: string }) => {
      setContextState((prev) => {
        const next = mergeContext(prev, patch)
        writeCookie(next)
        const qs = contextToSearchParams(next).toString()
        const target = options?.navigateTo ?? `${window.location.pathname}?${qs}`
        router.push(target)
        return next
      })
    },
    [router]
  )

  return { context, setContext }
}
