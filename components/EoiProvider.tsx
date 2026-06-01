'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type ExpressionOfInterestEntry = {
  id: string
  appId: string
  appName: string
  submittedByUserId: string | null
  submittedByName: string | null
  submittedByEmail: string | null
  organisationName: string | null
  role: string | null
  phone: string | null
  populationEstimate: string | null
  timeline: string | null
  notes: string | null
  createdAt: string
}

export type ExpressionOfInterestSubmission = {
  appId: string
  appName: string
  phone?: string
  population_estimate?: string
  timeline?: string
  notes?: string
}

type EoiContextValue = {
  expressionsOfInterest: ExpressionOfInterestEntry[]
  count: number
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  submit: (payload: ExpressionOfInterestSubmission) => Promise<void>
}

const EoiContext = createContext<EoiContextValue | null>(null)

export function EoiProvider({ children }: { children: React.ReactNode }) {
  const [expressionsOfInterest, setExpressionsOfInterest] = useState<ExpressionOfInterestEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch('/api/express-interest')
      if (!res.ok) {
        if (res.status === 401) {
          setExpressionsOfInterest([])
          return
        }
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'Could not load expressions of interest.')
      }
      const data = (await res.json()) as { expressionsOfInterest?: ExpressionOfInterestEntry[] }
      setExpressionsOfInterest(Array.isArray(data.expressionsOfInterest) ? data.expressionsOfInterest : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load expressions of interest.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const submit = useCallback(async (payload: ExpressionOfInterestSubmission) => {
    const res = await fetch('/api/express-interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(data.error || 'Could not register your expression of interest.')
    }
    const data = (await res.json()) as { expressionsOfInterest?: ExpressionOfInterestEntry[] }
    if (Array.isArray(data.expressionsOfInterest)) {
      setExpressionsOfInterest(data.expressionsOfInterest)
    }
  }, [])

  const value = useMemo(
    () => ({
      expressionsOfInterest,
      count: expressionsOfInterest.length,
      isLoading,
      error,
      refresh,
      submit,
    }),
    [expressionsOfInterest, isLoading, error, refresh, submit],
  )

  return <EoiContext.Provider value={value}>{children}</EoiContext.Provider>
}

export function useEoi() {
  const ctx = useContext(EoiContext)
  if (!ctx) {
    throw new Error('useEoi must be used within EoiProvider')
  }
  return ctx
}
