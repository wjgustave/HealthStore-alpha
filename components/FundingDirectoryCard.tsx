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
  const linked = appTags
    .map(id => apps.find(a => a.id === id || a.slug === id))
    .filter((app): app is App => Boolean(app))

  if (linked.length === 0) return null

  return (
    <div className="border-t px-4 py-4 sm:px-6" style={{ borderColor: 'var(--border)', background: '#F0F4F5' }}>
      <p className="m-0 mb-2 hs-text-caption hs-font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        Linked in this catalogue
      </p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-start">
        {linked.map(app => (
          <Link
            key={app.id}
            href={`/apps/${app.slug}`}
            className="nhsuk-link nhsuk-link--no-visited-state"
            style={{ textDecoration: 'none' }}
          >
            {app.app_name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function FundingDirectoryCard({ f, apps }: { f: FundingDirectoryRecord; apps: App[] }) {
  const titleId = `funding-title-${f.id}`
  const metaLine = `${f.sponsoring_body || 'Sponsor not stated'} · ${formatClosingSummary(f)}`

  return (
    // [Provenance: NHS] NHS Card.
    <article aria-labelledby={titleId} className="nhsuk-card overflow-hidden">
      <div className="nhsuk-card__content">
        <div className="mb-2">
          <div className="mb-2 flex justify-end">
            <FundingStatusBadge status={f.status} />
          </div>
          <h3 id={titleId} className="nhsuk-card__heading m-0 leading-snug" style={{ maxWidth: 'none' }}>
            {f.title}
          </h3>
        </div>

        {f.total_value ? (
          <p className="mb-4 m-0 hs-text-body hs-font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {f.total_value}
          </p>
        ) : (
          <p className="mb-4 m-0 hs-text-label hs-font-normal leading-tight" style={{ color: 'var(--text-muted)' }}>
            Amount not stated
          </p>
        )}

        <p className="mb-4 m-0 leading-relaxed" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
          {f.description}
        </p>

        <p className="mb-4 m-0 hs-text-label leading-snug" style={{ color: 'var(--text-muted)' }}>
          {metaLine}
        </p>

        <div className="mb-4 flex flex-wrap gap-1">
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
            className="inline-flex items-center gap-2 py-1 hs-text-label hs-font-bold transition-colors hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: 'var(--nhs-blue)', outlineColor: 'var(--nhs-blue)' }}
          >
            <span>{f.external_url_label ?? 'More information'}</span>
          </a>
        ) : null}
      </div>

      <LinkedCatalogueApps appTags={f.app_tags ?? []} apps={apps} />
    </article>
  )
}

