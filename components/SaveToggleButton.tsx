'use client'

import { Bookmark } from 'lucide-react'
import { useBookmarks } from '@/components/BookmarkProvider'
import { Button } from '@/components/ui/Button'

export function SaveToggleButton({
  appId,
  className = '',
  /** PDP hero: no border ring (catalogue cards keep bordered style). */
  borderless = false,
}: {
  appId: string
  className?: string
  borderless?: boolean
}) {
  const { isSaved, toggle, togglingId, isLoading } = useBookmarks()
  const saved = isSaved(appId)
  const busy = isLoading || togglingId === appId

  return (
    <Button
      variant="toggle"
      pressed={saved}
      borderless={borderless}
      size="none"
      aria-label={saved ? 'Remove from saved apps' : 'Save app'}
      aria-pressed={saved}
      aria-busy={busy}
      disabled={busy}
      onClick={() => {
        void toggle(appId)
      }}
      className={`py-4 hs-text-label disabled:cursor-wait ${className}`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {saved ? (
          <>
            <Bookmark className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden />
            Saved
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4 shrink-0" aria-hidden />
            Save
          </>
        )}
      </span>
    </Button>
  )
}
