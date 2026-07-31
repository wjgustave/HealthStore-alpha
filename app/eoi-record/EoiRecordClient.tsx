'use client'

import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { useEoi } from '@/components/EoiProvider'
import { formatHomeDate } from '@/components/home/formatDate'

const TIMELINE_LABELS: Record<string, string> = {
  immediate: 'Within 3 months',
  medium: '3–6 months',
  planning: '6–12 months',
  exploratory: 'Exploratory only',
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return formatHomeDate(iso)
  }
}

export default function EoiRecordClient({
  appSlugById,
}: {
  appSlugById: Record<string, string>
}) {
  const { expressionsOfInterest, count, isLoading, error } = useEoi()

  const procurementCta = (
    <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
      <h2
        className="mb-1"
        style={{
          fontFamily: 'Frutiger, Arial, sans-serif',
          fontWeight: 600,
          fontSize: 'var(--text-section-alt)',
          color: 'var(--text-primary)',
        }}
      >
        Next steps
      </h2>
      <p className="mb-4" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: '36rem' }}>
        Once expressions of interest have been reviewed, proceed to procurement confirmation.
      </p>
      <button
        type="button"
        disabled
        className="inline-flex items-center justify-center rounded-xl px-6 py-4 hs-text-label hs-font-bold cursor-not-allowed opacity-40"
        style={{ background: 'var(--nhs-blue)', color: '#fff' }}
      >
        Procurement confirmation
      </button>
    </div>
  )

  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'EOI record' }]} />

      <div className="mb-8">
        <h1 className="page-title-h1 mb-2">EOI record</h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: '42rem' }}>
          A shared record of submitted expression of interest.
        </p>
      </div>

      {error ? (
        <p
          className="mb-4 hs-text-label rounded-md px-4 py-2"
          role="alert"
          style={{ background: '#FEF3F2', color: '#912018', border: '1px solid #FECDCA' }}
        >
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="hs-surface-card rounded-xl border p-8 bg-white text-center" style={{ borderColor: 'var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading expressions of interest…</p>
        </div>
      ) : count === 0 ? (
        <div className="hs-surface-card text-center py-16 px-4 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div className="hs-text-section mb-4" aria-hidden>
            📩
          </div>
          <p className="hs-font-bold mb-2 max-w-lg mx-auto" style={{ color: 'var(--text-primary)' }}>
            No expressions of interest yet
          </p>
          <p className="mb-6 max-w-lg mx-auto" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
            When you or a colleague expresses interest in an app, it will appear here as a shared audit trail.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center hs-text-label hs-font-bold rounded-lg px-6 py-4 min-h-[44px]"
            style={{ background: 'var(--nhs-blue)', color: '#fff' }}
          >
            Product catalogue
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 hs-text-label" style={{ color: 'var(--text-muted)' }}>
            {count === 1 ? '1 expression of interest' : `${count} expressions of interest`}
          </p>
          <div className="hs-surface-card overflow-hidden rounded-xl border bg-white" style={{ borderColor: 'var(--border)' }}>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {expressionsOfInterest.map(eoi => {
                const slug = appSlugById[eoi.appId]
                const timelineLabel = eoi.timeline ? TIMELINE_LABELS[eoi.timeline] : null
                return (
                  <li key={eoi.id} className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <div className="min-w-0">
                        <div className="hs-font-bold" style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}>
                          {slug ? (
                            <Link href={`/apps/${slug}`} className="hover:underline" style={{ color: 'var(--nhs-blue)' }}>
                              {eoi.appName}
                            </Link>
                          ) : (
                            eoi.appName
                          )}
                        </div>
                        <div className="mt-1 hs-text-label" style={{ color: 'var(--text-secondary)' }}>
                          {eoi.submittedByName || 'Unknown user'}
                          {eoi.organisationName ? ` · ${eoi.organisationName}` : ''}
                        </div>
                      </div>
                      <div className="shrink-0 hs-text-label" style={{ color: 'var(--text-muted)' }}>
                        {formatDateTime(eoi.createdAt)}
                      </div>
                    </div>
                    {(timelineLabel || eoi.populationEstimate || eoi.notes) ? (
                      <div className="mt-2 flex flex-col gap-1 hs-text-caption" style={{ color: 'var(--text-muted)' }}>
                        {timelineLabel ? <div><span className="hs-font-bold">Timeline:</span> {timelineLabel}</div> : null}
                        {eoi.populationEstimate ? <div><span className="hs-font-bold">Population:</span> {eoi.populationEstimate}</div> : null}
                        {eoi.notes ? <div><span className="hs-font-bold">Notes:</span> {eoi.notes}</div> : null}
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}

      {procurementCta}
    </div>
  )
}
