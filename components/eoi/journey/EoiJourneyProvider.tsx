'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Shared state for the express-interest journey, which is split across one
 * route per step (GOV.UK one-question-per-page):
 *
 *   /apps/[slug]/express-interest                 start
 *   /apps/[slug]/express-interest/details         your details
 *   /apps/[slug]/express-interest/verify          one-time code
 *   /apps/[slug]/express-interest/support         what support do you need
 *   /apps/[slug]/express-interest/timing          timing and context
 *   /apps/[slug]/express-interest/check-answers   check your answers (submits)
 *   /apps/[slug]/express-interest/confirmation    confirmation panel
 *
 * The provider lives in the route-group layout, so it stays mounted while the
 * user navigates between steps. Answers are mirrored to sessionStorage so a
 * refresh or browser-back does not lose them. Steps guard themselves: if their
 * prerequisites are missing (e.g. arriving at /support without a verified
 * email) they redirect back to the right step.
 */

export const HELP_OPTIONS = [
  { id: 'assess_fit', label: 'Assess pathway fit' },
  { id: 'business_case', label: 'Build or review a business case' },
  { id: 'assurance', label: 'Clarify assurance and local work' },
  { id: 'commercial_route', label: 'Commercial route and buyer pack' },
  { id: 'implementation', label: 'Implementation planning' },
  { id: 'other', label: 'Other' },
] as const

export const TIMELINE_OPTIONS = [
  { id: 'immediate', label: 'Within 3 months' },
  { id: 'medium', label: '3 to 6 months' },
  { id: 'planning', label: '6 to 12 months' },
  { id: 'exploratory', label: 'Exploratory only' },
] as const

export const PROTOTYPE_OTP = '123456'

export type FieldError = { field: string; message: string }

export type EoiApp = { id: string; name: string; slug: string }

export type EoiJourneyData = {
  name: string
  email: string
  role: string
  organisation: string
  phone: string
  help: string[]
  helpOtherDetails: string
  timeline: string
  population: string
  notes: string
  /** True once the one-time code has been entered correctly. */
  verified: boolean
}

const EMPTY_DATA: EoiJourneyData = {
  name: '',
  email: '',
  role: '',
  organisation: '',
  phone: '',
  help: [],
  helpOtherDetails: '',
  timeline: '',
  population: '',
  notes: '',
  verified: false,
}

type StoredJourney = { data: EoiJourneyData; reference: string | null }

type EoiJourneyContextValue = {
  app: EoiApp
  /** `/apps/[slug]/express-interest` */
  basePath: string
  data: EoiJourneyData
  update: (patch: Partial<EoiJourneyData>) => void
  /** Reference number once submitted; null before. */
  reference: string | null
  /** Records the reference and clears the stored answers. */
  completeSubmission: (reference: string) => void
  /** True once sessionStorage has been read on the client (guards wait for this). */
  hydrated: boolean
  /** All required "Your details" fields present and plausible. */
  detailsComplete: boolean
}

const EoiJourneyContext = createContext<EoiJourneyContextValue | null>(null)

function storageKey(slug: string) {
  return `hs-eoi-journey:${slug}`
}

export function EoiJourneyProvider({ app, children }: { app: EoiApp; children: ReactNode }) {
  const [data, setData] = useState<EoiJourneyData>(EMPTY_DATA)
  const [reference, setReference] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Restore after mount (not in the initializer) to keep SSR/client markup consistent.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(app.slug))
      if (raw) {
        const stored = JSON.parse(raw) as StoredJourney
        if (stored.data) setData({ ...EMPTY_DATA, ...stored.data })
        if (stored.reference) setReference(stored.reference)
      }
    } catch {
      // Ignore corrupt/unavailable storage — start fresh.
    }
    setHydrated(true)
  }, [app.slug])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(storageKey(app.slug), JSON.stringify({ data, reference } satisfies StoredJourney))
    } catch {
      // Storage full/unavailable — journey still works in memory.
    }
  }, [hydrated, data, reference, app.slug])

  const update = useCallback((patch: Partial<EoiJourneyData>) => {
    setData((d) => ({ ...d, ...patch }))
  }, [])

  const completeSubmission = useCallback((ref: string) => {
    setReference(ref)
    setData(EMPTY_DATA)
  }, [])

  const detailsComplete =
    data.name.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) &&
    data.role.trim() !== '' &&
    data.organisation.trim() !== ''

  const value = useMemo<EoiJourneyContextValue>(
    () => ({
      app,
      basePath: `/apps/${app.slug}/express-interest`,
      data,
      update,
      reference,
      completeSubmission,
      hydrated,
      detailsComplete,
    }),
    [app, data, update, reference, completeSubmission, hydrated, detailsComplete],
  )

  return <EoiJourneyContext.Provider value={value}>{children}</EoiJourneyContext.Provider>
}

export function useEoiJourney(): EoiJourneyContextValue {
  const ctx = useContext(EoiJourneyContext)
  if (!ctx) throw new Error('useEoiJourney must be used within EoiJourneyProvider')
  return ctx
}
