'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bookmark } from 'lucide-react'
import type { App } from '@/lib/data'
import { useBookmarks } from '@/components/BookmarkProvider'
import { WidgetShell, WidgetHeading, WidgetMessage, WidgetError } from '@/components/ui/WidgetShell'

export function SavedAppsWidget({ apps, limit = 4 }: { apps: App[]; limit?: number }) {
  const { bookmarks, count, status, refresh } = useBookmarks()
  const byId = new Map(apps.map(a => [a.id, a]))
  const recent = bookmarks.slice(0, limit)

  return (
    <WidgetShell footerHref="/saved-apps" footerLabel="View all saved apps">
      <WidgetHeading
        icon={<Bookmark className="h-4 w-4" style={{ color: 'var(--nhs-blue)' }} aria-hidden />}
        title="Saved apps"
        count={status === 'ready' ? count : undefined}
      />

      {status === 'loading' ? (
        <WidgetMessage>Loading…</WidgetMessage>
      ) : status === 'error' ? (
        <WidgetError message="Couldn’t load your saved apps." onRetry={() => void refresh()} />
      ) : count === 0 ? (
        <WidgetMessage>You have not saved any apps yet.</WidgetMessage>
      ) : (
        <ul className="m-0 min-h-0 flex-1 list-none space-y-3 p-0">
          {recent.map(b => {
            const app = byId.get(b.appId)
            if (!app) return null
            return (
              <li key={b.appId}>
                <Link
                  href={`/apps/${app.slug}`}
                  className="flex items-center gap-2.5 rounded-lg p-1 -m-1 transition-colors hover:bg-[#F7F9FC]"
                >
                  {app.logo_path ? (
                    <Image src={app.logo_path} alt="" width={28} height={28} className="rounded-md flex-shrink-0" />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {app.app_name}
                    </span>
                    <span className="block truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                      {app.supplier_name}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </WidgetShell>
  )
}
