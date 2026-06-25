'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { ConditionTag, MaturityBadge, SupervisionBadge } from '@/components/Badges'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { useBookmarks } from '@/components/BookmarkProvider'
import { SaveToggleButton } from '@/components/SaveToggleButton'

type Props = { allApps: App[] }

function SavedAppCard({ app, onRemove, removing }: { app: App; onRemove: () => void; removing: boolean }) {
  return (
    <div className="app-card flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col" style={{ padding: '1.25rem' }}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {app.logo_path ? (
              <Image src={app.logo_path} alt="" width={32} height={32} className="rounded-md flex-shrink-0" />
            ) : null}
            <div className="min-w-0">
              <h2
                className="truncate"
                style={{
                  fontFamily: 'Frutiger, Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: 'var(--text-card-title-sm)',
                  color: 'var(--text-primary)',
                  marginBottom: 2,
                }}
              >
                {app.app_name}
              </h2>
              <p style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', margin: 0 }}>{app.supplier_name}</p>
            </div>
          </div>
          {/* R7 UX-07: disable the remove control while its DELETE is in flight so rapid clicks can't fire duplicates. */}
          <button
            type="button"
            onClick={onRemove}
            disabled={removing}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-gray-100 disabled:cursor-wait disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nhs-blue)]"
            aria-label={`Remove ${app.app_name} from saved apps`}
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden />
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {app.condition_tags.map((t: string) => (
            <ConditionTag key={t} tag={t} />
          ))}
          <SupervisionBadge model={app.supervision_model} />
          <MaturityBadge level={app.maturity_level} />
        </div>

        <p
          className="line-clamp-4 mb-4"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.55 }}
        >
          {app.one_line_value_proposition}
        </p>

        <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href={`/apps/${app.slug}`}
            className="block rounded-lg py-4 text-center text-sm font-semibold transition-colors hover:!bg-[#004B8C]"
            style={{ background: STORE_ACCENT, color: '#fff' }}
          >
            View details →
          </Link>
          <SaveToggleButton appId={app.id} borderless className="w-full px-4 py-4" />
        </div>
      </div>
    </div>
  )
}

export default function SavedAppsClient({ allApps }: Props) {
  const { bookmarks, count, isLoading, remove, error, togglingId } = useBookmarks()

  const savedApps = useMemo(() => {
    const byId = new Map(allApps.map(a => [a.id, a]))
    return bookmarks
      .map(b => byId.get(b.appId))
      .filter(Boolean) as App[]
  }, [bookmarks, allApps])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageBreadcrumb items={[{ label: 'Find apps', href: '/apps' }, { label: 'Saved apps' }]} />

      <div className="mb-8">
        <h1
          className="mb-2"
          style={{
            fontFamily: 'Frutiger, Arial, sans-serif',
            fontWeight: 700,
            fontSize: 'var(--text-page-title)',
            color: 'var(--text-primary)',
          }}
        >
          Saved apps
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: '42rem' }}>
          DTx apps you have saved to revisit later. Use the comparison tool when you are ready to evaluate options side
          by side.
        </p>
      </div>

      {error ? (
        <p className="mb-4 text-sm rounded-md px-3 py-2" role="alert" style={{ background: '#FEF3F2', color: '#912018', border: '1px solid #FECDCA' }}>
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="hs-surface-card rounded-xl border p-8 bg-white text-center" style={{ borderColor: 'var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading saved apps…</p>
        </div>
      ) : savedApps.length === 0 ? (
        <div className="hs-surface-card text-center py-20 px-4 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-4xl mb-4" aria-hidden>
            🔖
          </div>
          <p className="font-semibold mb-2 max-w-lg mx-auto" style={{ color: 'var(--text-primary)' }}>
            No saved DTx apps yet
          </p>
          <p className="mb-6 max-w-lg mx-auto" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
            Browse the catalogue and save DTx apps you want to come back to.
          </p>
          <Link
            href="/apps"
            className="inline-flex items-center justify-center text-sm font-semibold rounded-lg px-5 py-3 min-h-[44px]"
            style={{ background: STORE_ACCENT, color: '#fff' }}
          >
            Find apps
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            {count === 1 ? '1 saved DTx app' : `${count} saved DTx apps`}
          </p>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))] xl:[grid-template-columns:repeat(auto-fill,minmax(360px,1fr))]">
            {savedApps.map(app => (
              <SavedAppCard key={app.id} app={app} onRemove={() => void remove(app.id)} removing={togglingId === app.id} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
