'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bookmark, ChevronRight } from 'lucide-react'
import type { App } from '@/lib/data'
import { useBookmarks } from '@/components/BookmarkProvider'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

export function SavedAppsWidget({ apps, limit = 4 }: { apps: App[]; limit?: number }) {
  const { bookmarks, count, isLoading } = useBookmarks()
  const byId = new Map(apps.map(a => [a.id, a]))
  const recent = bookmarks.slice(0, limit)

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border bg-white p-5 shadow-md" style={{ borderColor: 'var(--border)' }}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
          <Bookmark className="h-4 w-4" style={{ color: 'var(--nhs-blue)' }} aria-hidden />
          Saved apps
        </h3>
        <span
          className="min-w-[1.5rem] rounded-md px-2 py-0.5 text-center text-xs font-bold text-white"
          style={{ background: 'var(--nhs-blue)' }}
        >
          {count}
        </span>
      </div>

      {isLoading ? (
        <p className="flex-1 text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
      ) : count === 0 ? (
        <p className="flex-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          You have not saved any apps yet.
        </p>
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

      <Link
        href="/saved-apps"
        className="mt-5 flex shrink-0 items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
        style={{ borderColor: 'var(--border)', color: '#005EB8' }}
      >
        View all saved apps
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}
