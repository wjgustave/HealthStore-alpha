'use client'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { useCompareBasket } from '@/components/CompareBasketProvider'
import {
  formatConditionLabels,
  sharedConditionTags,
} from '@/lib/compareConditions'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import CompareLensControl from '@/components/compare/CompareLensControl'
import CompareWorkspaceView from '@/components/compare/CompareWorkspaceView'
import type { CompareLensId } from '@/lib/compareConfig'

type Props = { allApps: App[] }

const LOGO_SIZE = 24

/** Logo + name + remove, aligned to comparison columns below. */
function CompareSummaryCard({
  app,
  onRemove,
}: {
  app: App
  onRemove: () => void
}) {
  return (
    <div className="flex items-center min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        {app.logo_path ? (
          <Image
            src={app.logo_path}
            alt=""
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className="shrink-0 object-contain"
            style={{ maxWidth: LOGO_SIZE, maxHeight: LOGO_SIZE }}
          />
        ) : (
          <div className="shrink-0" style={{ width: LOGO_SIZE, height: LOGO_SIZE }} aria-hidden />
        )}
        <Link
          href={`/apps/${app.slug}`}
          className="min-w-0 font-bold text-sm hover:underline truncate"
          style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
        >
          {app.app_name}
        </Link>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-xs hover:underline"
        style={{ color: 'var(--nhs-blue)', marginLeft: '24px' }}
        aria-label={`Remove ${app.app_name}`}
      >
        Remove
      </button>
    </div>
  )
}

export default function CompareClient({ allApps }: Props) {
  const searchParams = useSearchParams()
  const { ids: selectedIds, remove, clear, setFromUrlIds } = useCompareBasket()
  const [lens, setLens] = useState<CompareLensId>('all')
  const [differencesOnly, setDifferencesOnly] = useState(false)

  const idsParam = searchParams?.get('ids') ?? ''
  useEffect(() => {
    if (!idsParam) return
    const urlIds = idsParam.split(',').map((s) => s.trim()).filter(Boolean)
    if (urlIds.length > 0) setFromUrlIds(urlIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam])

  const selected = selectedIds.map((id) => allApps.find((a) => a.id === id)).filter(Boolean) as App[]

  const sharedTags = useMemo(() => sharedConditionTags(selected), [selected])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageBreadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Comparison tool' }]} />

      <div className="mb-8">
        <h1 className="page-title-h1">Comparison tool</h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Add up to four apps from the catalogue in the <strong>same condition area</strong>.
          Compare decision snapshot signals — where it&apos;s live, governance, pricing model, and integrations — then drill into the detail groups below.
        </p>
      </div>

      {selected.length > 0 && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {selected.length} application{selected.length !== 1 ? 's' : ''} selected
              </p>
              {sharedTags.length > 0 && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Shared condition{sharedTags.length > 1 ? 's' : ''}:{' '}
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {formatConditionLabels(sharedTags)}
                  </span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => clear()}
              className="self-start text-sm rounded-md px-2 py-1 -mx-2 -my-1 transition-colors hover:bg-[#FEF2F2] hover:text-red-600 sm:shrink-0 min-h-[44px]"
              style={{ color: 'var(--text-muted)' }}
            >
              Clear all
            </button>
          </div>

          <div className="hs-compare-panel hs-compare-workspace__controls mb-3">
            <CompareLensControl value={lens} onChange={setLens} />
            <label className="hs-compare-diff-toggle">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={e => setDifferencesOnly(e.target.checked)}
                className="hs-compare-diff-toggle__input"
              />
              <span>Differences only</span>
            </label>
          </div>

          <div className="hs-compare-panel hs-compare-panel--summary mb-3">
            <h2 className="sr-only">Selected apps summary</h2>
            <div className="hs-compare-summary-row">
              <div className="hs-compare-summary-row__spacer" aria-hidden="true" />
              <div
                className="hs-compare-summary-row__cells"
                style={{
                  gridTemplateColumns: `repeat(${selected.length}, minmax(140px, 1fr))`,
                }}
              >
                {selected.map((app) => (
                  <div key={app.id} className="hs-compare-summary-row__cell">
                    <CompareSummaryCard app={app} onRemove={() => remove(app.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selected.length === 0 ? (
        <div className="hs-surface-card text-center py-20 px-4 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-4xl mb-4" aria-hidden>
            ⚖️
          </div>
          <p className="font-semibold mb-3 max-w-lg mx-auto" style={{ color: 'var(--text-primary)' }}>
            No applications selected for the comparison tool. Browse the catalogue and add applications to compare them side by side.
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
        <CompareWorkspaceView selected={selected} lens={lens} differencesOnly={differencesOnly} />
      )}
    </div>
  )
}
