'use client'

import '@awesome.me/webawesome/dist/components/icon/icon.js'
import { useBookmarks } from '@/components/BookmarkProvider'

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
    <button
      type="button"
      aria-label={saved ? 'Remove from saved apps' : 'Save app'}
      aria-pressed={saved}
      aria-busy={busy}
      disabled={busy}
      onClick={() => {
        void toggle(appId)
      }}
      className={`rounded-lg py-4 text-sm font-semibold text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nhs-blue)] disabled:opacity-60 disabled:cursor-wait ${className} ${
        borderless ? 'border-0' : 'border'
      } ${
        saved
          ? `bg-[#E1F4F5] text-[#004B50] hover:bg-[#cde8eb] ${borderless ? '' : 'border-[#B8E0E4] hover:border-[#9fd4d9]'}`
          : `bg-white text-[#005EB8] hover:bg-[#E6F0FB] ${borderless ? '' : 'border-[#005EB8]'}`
      }`}
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        {saved ? (
          <>
            <wa-icon
              name="bookmark"
              family="classic"
              variant="solid"
              className="shrink-0 text-base leading-none inline-block align-middle text-current"
              aria-hidden
            />
            Saved
          </>
        ) : (
          <>
            <wa-icon
              name="bookmark"
              family="classic"
              variant="regular"
              className="shrink-0 text-base leading-none inline-block align-middle text-current"
              aria-hidden
            />
            Save
          </>
        )}
      </span>
    </button>
  )
}
