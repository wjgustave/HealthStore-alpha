import Link from 'next/link'
import { FundingStatusBadge, ConditionTag } from '@/components/Badges'
import type { App } from '@/lib/data'
import { isVisibleCondition } from '@/lib/visibleConditions'

/** Shape of rows in `content/funding/funding.json` used by the funding directory. */
export type FundingDirectoryRecord = {
  id: string
  title: string
  sponsoring_body: string
  description: string
  total_value: string | null
  closing_date: string | null
  closing_date_note: string | null
  status: string
  condition_tags: string[]
  app_tags: string[]
  notes?: string | null
  external_url?: string | null
  external_url_label?: string | null
}

function formatClosingSummary(f: FundingDirectoryRecord): string {
  const note = f.closing_date_note?.trim()
  if (f.closing_date) {
    const d = new Date(f.closing_date)
    if (!Number.isNaN(d.getTime())) {
      const formatted = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      return note ? `${formatted} — ${note}` : formatted
    }
  }
  if (note) return note
  return 'Ongoing — confirm with sponsor'
}

function LinkedCatalogueApps({ appTags, apps }: { appTags: string[]; apps: App[] }) {
  if (!appTags.length) return null
  return (
    <div className="border-t px-4 py-3 sm:px-6" style={{ borderColor: 'var(--border)', background: '#F7F9FC' }}>
      <p className="m-0 mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        Linked in this catalogue
      </p>
      <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
        {appTags.map(id => {
          const app = apps.find(a => a.id === id || a.slug === id)
          return app ? (
            <Link
              key={id}
              href={`/apps/${app.slug}`}
              className="badge badge-blue hover:underline"
            >
              {app.app_name}
            </Link>
          ) : null
        })}
      </div>
    </div>
  )
}

export function FundingDirectoryCard({ f, apps }: { f: FundingDirectoryRecord; apps: App[] }) {
  const titleId = `funding-title-${f.id}`
  const metaLine = `${f.sponsoring_body || 'Sponsor not stated'} · ${formatClosingSummary(f)}`

  return (
    <article
      aria-labelledby={titleId}
      className="hs-surface-card overflow-hidden rounded-xl border bg-white"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3
            id={titleId}
            className="m-0 flex-1 text-base font-bold leading-snug"
            style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
          >
            {f.title}
          </h3>
          <FundingStatusBadge status={f.status} />
        </div>

        {f.total_value ? (
          <p className="mb-3 m-0 text-[16px] font-bold leading-tight" style={{ color: 'var(--nhs-blue, #005EB8)' }}>
            {f.total_value}
          </p>
        ) : (
          <p className="mb-3 m-0 text-sm font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>
            Amount not stated
          </p>
        )}

        <p className="mb-3 m-0 leading-relaxed" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
          {f.description}
        </p>

        <p className="mb-3 m-0 text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
          {metaLine}
        </p>

        <div className="mb-3 flex flex-wrap gap-1">
          {f.condition_tags
            .filter(isVisibleCondition)
            .map(t => (
              <ConditionTag key={t} tag={t} />
            ))}
        </div>

        {f.notes ? (
          <p className="mb-4 m-0 leading-relaxed" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
            {f.notes}
          </p>
        ) : null}

        {f.external_url ? (
          <a
            href={f.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold transition-colors hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: 'var(--nhs-blue, #005EB8)', outlineColor: 'var(--nhs-blue, #005EB8)' }}
          >
            <span>{f.external_url_label ?? 'More information'}</span>
            <span aria-hidden className="translate-y-px">
              →
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>

      <LinkedCatalogueApps appTags={f.app_tags ?? []} apps={apps} />
    </article>
  )
}

