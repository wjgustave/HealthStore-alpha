'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useToast } from './ui/Toast'

export type BookmarkEntry = {
  appId: string
  savedAt: string
}

/** Load lifecycle so widgets can tell a failed fetch apart from a genuinely empty list (UX-03). */
export type LoadStatus = 'loading' | 'ready' | 'error'

type BookmarkContextValue = {
  bookmarks: BookmarkEntry[]
  ids: string[]
  count: number
  isLoading: boolean
  status: LoadStatus
  /** True when the last load returned 401 (session likely expired). */
  sessionExpired: boolean
  togglingId: string | null
  error: string | null
  isSaved: (appId: string) => boolean
  toggle: (appId: string) => Promise<void>
  remove: (appId: string) => Promise<void>
  refresh: () => Promise<void>
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null)

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast()
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [sessionExpired, setSessionExpired] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    setStatus('loading')
    try {
      const res = await fetch('/api/bookmarks')
      if (!res.ok) {
        if (res.status === 401) {
          setBookmarks([])
          setSessionExpired(true)
          setStatus('ready')
          return
        }
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'Could not load saved apps.')
      }
      const data = (await res.json()) as { bookmarks?: BookmarkEntry[] }
      setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : [])
      setSessionExpired(false)
      setStatus('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load saved apps.')
      setStatus('error')
      toast.error('Couldn’t load your saved apps.')
    }
  }, [toast])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const isSaved = useCallback((appId: string) => bookmarks.some(b => b.appId === appId), [bookmarks])

  const toggle = useCallback(
    async (appId: string) => {
      setTogglingId(appId)
      setError(null)
      try {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId }),
        })
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(data.error || 'Could not save — try again.')
        }
        const data = (await res.json()) as { bookmarks?: BookmarkEntry[] }
        const next = Array.isArray(data.bookmarks) ? data.bookmarks : []
        const nowSaved = next.some(b => b.appId === appId)
        setBookmarks(next)
        if (nowSaved) toast.success('Saved to your saved apps.')
        else toast.info('Removed from saved apps.')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not save — try again.'
        setError(message)
        toast.error(message)
      } finally {
        setTogglingId(null)
      }
    },
    [toast],
  )

  const remove = useCallback(
    async (appId: string) => {
      setTogglingId(appId)
      setError(null)
      try {
        const res = await fetch(`/api/bookmarks/${encodeURIComponent(appId)}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(data.error || 'Could not remove — try again.')
        }
        const data = (await res.json()) as { bookmarks?: BookmarkEntry[] }
        setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : [])
        toast.info('Removed from saved apps.')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not remove — try again.'
        setError(message)
        toast.error(message)
      } finally {
        setTogglingId(null)
      }
    },
    [toast],
  )

  const ids = useMemo(() => bookmarks.map(b => b.appId), [bookmarks])

  const value = useMemo(
    () => ({
      bookmarks,
      ids,
      count: bookmarks.length,
      isLoading: status === 'loading',
      status,
      sessionExpired,
      togglingId,
      error,
      isSaved,
      toggle,
      remove,
      refresh,
    }),
    [bookmarks, ids, status, sessionExpired, togglingId, error, isSaved, toggle, remove, refresh],
  )

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext)
  if (!ctx) {
    throw new Error('useBookmarks must be used within BookmarkProvider')
  }
  return ctx
}
