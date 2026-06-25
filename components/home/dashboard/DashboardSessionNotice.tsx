'use client'

import { Info } from 'lucide-react'
import { useBookmarks } from '@/components/BookmarkProvider'
import { useEoi } from '@/components/EoiProvider'
import { Button } from '@/components/ui/Button'

/**
 * Soft "session may have expired" notice on the dashboard (ERR-5). The providers
 * treat a 401 as empty so public browsing stays calm; in the logged-in dashboard
 * a 401 instead reads as a gentle prompt to refresh, rather than blank widgets.
 */
export function DashboardSessionNotice() {
  const { sessionExpired: bookmarksExpired } = useBookmarks()
  const { sessionExpired: eoiExpired } = useEoi()
  if (!bookmarksExpired && !eoiExpired) return null

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm"
      style={{ background: '#FFF8E1', borderColor: '#F2C94C', color: '#8a6d00' }}
    >
      <Info className="h-4 w-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">
        Your session may have expired, so some details might be out of date. Refresh the page to reload them.
      </span>
      <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
        Refresh
      </Button>
    </div>
  )
}
