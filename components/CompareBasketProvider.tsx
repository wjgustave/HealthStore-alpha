'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { App } from '@/lib/data'
import {
  canAddToSelection,
  formatConditionLabels,
  sanitizeIdsForCompare,
  sharedConditionTags,
} from '@/lib/compareConditions'
import { useToast } from './ui/Toast'

const LS_KEY = 'healthstore-compare-basket'

function readStoredIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function resolveApps(ids: string[], allApps: App[]): App[] {
  return ids.map(i => allApps.find(a => a.id === i)).filter(Boolean) as App[]
}

type CompareBasketContextValue = {
  ids: string[]
  count: number
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  canAdd: (id: string) => boolean
  isInBasket: (id: string) => boolean
  setFromUrlIds: (ids: string[]) => void
  /** Non-empty when the basket has apps; for disabled compare buttons on other conditions. */
  incompatibleCompareTooltip: string
}

const CompareBasketContext = createContext<CompareBasketContextValue | null>(null)

export function CompareBasketProvider({
  allApps,
  children,
}: {
  allApps: App[]
  children: React.ReactNode
}) {
  const toast = useToast()
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    const stored = readStoredIds()
    if (stored.length > 0) {
      setIds(sanitizeIdsForCompare(stored, allApps))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time hydrate from localStorage
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(ids))
    } catch {
      /* ignore quota / private mode */
    }
  }, [ids])

  const isInBasket = useCallback((id: string) => ids.includes(id), [ids])

  const canAdd = useCallback(
    (id: string) => {
      if (ids.includes(id)) return true
      if (ids.length >= 4) return false
      const app = allApps.find(a => a.id === id)
      if (!app) return false
      const selectedApps = resolveApps(ids, allApps)
      if (selectedApps.length === 0) return true
      return canAddToSelection(selectedApps, app)
    },
    [ids, allApps],
  )

  const toggle = useCallback(
    (id: string) => {
      if (ids.includes(id)) {
        setIds(prev => prev.filter(x => x !== id))
        toast.info('Removed from the comparison tool.')
        return
      }
      if (ids.length >= 4) {
        toast.info('The comparison tool is full (maximum 4 apps).')
        return
      }
      const app = allApps.find(a => a.id === id)
      if (!app) return
      const selectedApps = resolveApps(ids, allApps)
      if (selectedApps.length > 0 && !canAddToSelection(selectedApps, app)) {
        toast.info('You can only compare apps for the same condition.')
        return
      }
      setIds(prev => (prev.includes(id) || prev.length >= 4 ? prev : [...prev, id]))
      toast.success(`Added to the comparison tool (${ids.length + 1}/4).`)
    },
    [ids, allApps, toast],
  )

  const remove = useCallback(
    (id: string) => {
      setIds(prev => prev.filter(x => x !== id))
      toast.info('Removed from the comparison tool.')
    },
    [toast],
  )

  const clear = useCallback(() => {
    const previous = ids
    setIds([])
    // R7 UX-08: destructive one-click clear is recoverable via an Undo toast rather than a confirm dialog.
    if (previous.length > 0) {
      toast.info('Comparison tool cleared.', {
        action: { label: 'Undo', onClick: () => setIds(previous) },
      })
    } else {
      toast.info('Comparison tool cleared.')
    }
  }, [ids, toast])

  const setFromUrlIds = useCallback(
    (next: string[]) => {
      setIds(sanitizeIdsForCompare(next, allApps))
    },
    [allApps],
  )

  const incompatibleCompareTooltip = useMemo(() => {
    if (ids.length === 0) return ''
    const apps = resolveApps(ids, allApps)
    const tags = sharedConditionTags(apps)
    const label =
      tags.length > 0 ? formatConditionLabels(tags) : 'the selected condition'
    return `The comparison tool is currently being used to compare ${label} apps. Clear the comparison tool to use it for an alternative condition.`
  }, [ids, allApps])

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      toggle,
      remove,
      clear,
      canAdd,
      isInBasket,
      setFromUrlIds,
      incompatibleCompareTooltip,
    }),
    [
      ids,
      toggle,
      remove,
      clear,
      canAdd,
      isInBasket,
      setFromUrlIds,
      incompatibleCompareTooltip,
    ],
  )

  return (
    <CompareBasketContext.Provider value={value}>{children}</CompareBasketContext.Provider>
  )
}

export function useCompareBasket() {
  const ctx = useContext(CompareBasketContext)
  if (!ctx) {
    throw new Error('useCompareBasket must be used within CompareBasketProvider')
  }
  return ctx
}
