'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type BookmarkEntry = {
  appId: string
  savedAt: string
}

type BookmarkContextValue = {
  bookmarks: BookmarkEntry[]
  ids: string[]
  count: number
  isLoading: boolean
  togglingId: string | null
  error: string | null
  isSaved: (appId: string) => boolean
  toggle: (appId: string) => Promise<void>
  remove: (appId: string) => Promise<void>
  refresh: () => Promise<void>
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null)

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch('/api/bookmarks')
      if (!res.ok) {
        if (res.status === 401) {
          setBookmarks([])
          return
        }
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'Could not load saved apps.')
      }
      const data = (await res.json()) as { bookmarks?: BookmarkEntry[] }
      setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load saved apps.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const isSaved = useCallback((appId: string) => bookmarks.some(b => b.appId === appId), [bookmarks])

  const toggle = useCallback(async (appId: string) => {
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
      setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save — try again.')
    } finally {
      setTogglingId(null)
    }
  }, [])

  const remove = useCallback(async (appId: string) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove — try again.')
    } finally {
      setTogglingId(null)
    }
  }, [])

  const ids = useMemo(() => bookmarks.map(b => b.appId), [bookmarks])

  const value = useMemo(
    () => ({
      bookmarks,
      ids,
      count: bookmarks.length,
      isLoading,
      togglingId,
      error,
      isSaved,
      toggle,
      remove,
      refresh,
    }),
    [bookmarks, ids, isLoading, togglingId, error, isSaved, toggle, remove, refresh],
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
