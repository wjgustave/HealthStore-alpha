'use client'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { DtacBadge, MaturityBadge, EvidenceBadge, EffortBadge, SupervisionBadge } from '@/components/Badges'
import { useCompareBasket } from '@/components/CompareBasketProvider'
import {
  formatConditionLabels,
  sharedConditionTags,
} from '@/lib/compareConditions'

type Props = { allApps: App[] }

const DIMENSIONS = [
  { key: 'supervision', label: 'Supervision model' },
  { key: 'maturity', label: 'Deployment maturity' },
  { key: 'evidence', label: 'Evidence strength' },
  { key: 'effort', label: 'Local effort required' },
  { key: 'dtac', label: 'DTAC status' },
  { key: 'device_class', label: 'Device class' },
  { key: 'dcb0129_status', label: 'DCB0129' },
  { key: 'gdpr', label: 'Data hosting' },
  { key: 'iso27001', label: 'ISO 27001' },
  { key: 'fhir', label: 'FHIR / EHR integration' },
  { key: 'pricing', label: 'Pricing model' },
  { key: 'nhse_125k', label: 'NHSE £125k eligible' },
  { key: 'nice_refs', label: 'NICE guidance' },
  { key: 'target_patients', label: 'Target patients' },
  { key: 'prerequisites', label: 'Key prerequisites' },
]

function CellValue({ app, dim }: { app: App; dim: string }) {
  switch (dim) {
    case 'supervision': return <SupervisionBadge model={app.supervision_model} />
    case 'maturity': return <MaturityBadge level={app.maturity_level} />
    case 'evidence': return <EvidenceBadge strength={app.evidence_strength} />
    case 'effort': return <EffortBadge level={app.local_wraparound} />
    case 'dtac': return <DtacBadge status={app.dtac_status} />
    case 'device_class': return <span style={{ fontSize: 'var(--text-label)' }}>{app.device_class}</span>
    case 'dcb0129_status': return <span style={{ fontSize: 'var(--text-label)' }}>{app.dcb0129_status}</span>
    case 'gdpr': return <span style={{ fontSize: 'var(--text-label)' }}>{app.gdpr_note.split('.')[0]}</span>
    case 'iso27001': return <span style={{ fontSize: 'var(--text-label)' }}>{app.iso27001}</span>
    case 'fhir': return <span style={{ fontSize: 'var(--text-label)' }}>{(app as any).technical_information?.fhir_api_status ?? 'See app page'}</span>
    case 'pricing': return <span style={{ fontSize: 'var(--text-label)' }}>{app.indicative_price_text.slice(0, 80)}</span>
    case 'nhse_125k':
      return app.nhse_125k_eligible === true
        ? <span className="badge badge-green">Eligible</span>
        : app.nhse_125k_eligible === false
        ? <span className="badge badge-grey">Not eligible</span>
        : <span className="badge badge-amber">Unconfirmed</span>
    case 'nice_refs':
      return <div className="space-y-1">{app.nice_guidance_refs.map(r => <span key={r.ref} className="block" style={{ fontSize: 'var(--text-label)' }}>{r.ref} ({r.date})</span>)}</div>
    case 'target_patients': return <span style={{ fontSize: 'var(--text-label)' }}>{app.target_patients.slice(0, 100)}</span>
    case 'prerequisites':
      return <ul className="space-y-1">{(app.implementation_prerequisites ?? []).slice(0, 3).map((p, i) => <li key={i} style={{ fontSize: 'var(--text-label)' }}>• {p}</li>)}</ul>
    default: return <span className="text-gray-400" style={{ fontSize: 'var(--text-label)' }}>—</span>
  }
}

const LOGO_DESKTOP = { w: 140, h: 72 }
const LOGO_MOBILE = { w: 112, h: 60 }

/** App logo + name + corner remove control (pattern from healthstore-m compare). */
function CompareAppHeaderColumn({
  app,
  onRemove,
  layout,
}: {
  app: App
  onRemove: () => void
  layout: 'mobile' | 'desktop'
}) {
  const { w, h } = layout === 'desktop' ? LOGO_DESKTOP : LOGO_MOBILE

  const logoBox = (
    <div className="relative inline-block shrink-0">
      {app.logo_path ? (
        <div
          className="hs-surface-card relative rounded-xl bg-white border"
          style={{
            width: w,
            height: h,
            borderColor: 'var(--border)',
          }}
        >
          <Image
            src={app.logo_path}
            alt=""
            fill
            sizes={`${w}px`}
            className="object-contain p-3"
          />
        </div>
      ) : (
        <div
          className="rounded-xl bg-[#F7F9FC] border flex items-center justify-center"
          style={{
            width: w,
            height: h,
            borderColor: 'var(--border)',
          }}
          aria-hidden
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10 w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-90 shadow-sm"
        style={{ background: '#FEE2E2', color: '#DC2626' }}
        aria-label={`Remove ${app.app_name}`}
      >
        <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  )

  if (layout === 'mobile') {
    return (
      <div className="flex items-center gap-4">
        {logoBox}
        <div className="min-w-0 flex-1 text-left">
          <Link
            href={`/apps/${app.slug}`}
            className="text-sm font-bold hover:underline block"
            style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
          >
            {app.app_name}
          </Link>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {app.supplier_name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      {logoBox}
      <Link
        href={`/apps/${app.slug}`}
        className="block mt-2 text-sm font-bold hover:underline"
        style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
      >
        {app.app_name}
      </Link>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {app.supplier_name}
      </p>
    </div>
  )
}

export default function CompareClient({ allApps }: Props) {
  const searchParams = useSearchParams()
  const { ids: selectedIds, remove, clear, setFromUrlIds } = useCompareBasket()

  const idsParam = searchParams?.get('ids') ?? ''
  useEffect(() => {
    if (!idsParam) return
    const urlIds = idsParam.split(',').map(s => s.trim()).filter(Boolean)
    if (urlIds.length > 0) setFromUrlIds(urlIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam])

  const selected = selectedIds.map(id => allApps.find(a => a.id === id)).filter(Boolean) as App[]

  const sharedTags = useMemo(() => sharedConditionTags(selected), [selected])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="page-title-h1">Compare apps</h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Add up to four apps from the catalogue in the <strong>same condition area</strong>. Remove apps here or clear the list to compare a different condition.
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
              className="self-start text-sm transition-colors hover:text-red-600 sm:shrink-0"
              style={{ color: 'var(--text-muted)' }}
            >
              Clear all
            </button>
          </div>

          <div className="hs-surface-card bg-white rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)' }}>
            <div className="md:hidden flex flex-col gap-5">
              {selected.map(app => (
                <CompareAppHeaderColumn
                  key={app.id}
                  app={app}
                  layout="mobile"
                  onRemove={() => remove(app.id)}
                />
              ))}
            </div>
            {/* Padding so corner remove controls are not clipped by overflow-x */}
            <div className="hidden md:block overflow-x-auto py-2 px-2 -mx-2">
              <div
                className="grid gap-4 mx-auto"
                style={{
                  gridTemplateColumns: `180px repeat(${selected.length}, minmax(136px, 1fr))`,
                }}
              >
                <div aria-hidden />
                {selected.map(app => (
                  <CompareAppHeaderColumn
                    key={app.id}
                    app={app}
                    layout="desktop"
                    onRemove={() => remove(app.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selected.length === 0 ? (
        <div className="hs-surface-card text-center py-20 px-4 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-4xl mb-4" aria-hidden>⚖️</div>
          <p className="font-semibold mb-3 max-w-lg mx-auto" style={{ color: 'var(--text-primary)' }}>
            No applications selected for comparison. Browse the catalogue and add applications to compare them side by side.
          </p>
          <Link
            href="/apps"
            className="inline-flex items-center justify-center text-sm font-semibold rounded-lg px-5 py-3 min-h-[44px]"
            style={{ background: STORE_ACCENT, color: '#fff' }}
          >
            Browse all apps
          </Link>
        </div>
      ) : (
        <div className="hs-surface-card overflow-x-auto rounded-xl border bg-white" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full border-collapse" style={{ fontSize: 'var(--text-body)' }}>
            <caption className="sr-only">
              {selected.length === 1
                ? 'Application details by dimension.'
                : 'Comparison of selected apps by dimension; each column is one product.'}
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Dimension</th>
                {selected.map(app => (
                  <th key={app.id} scope="col">{app.app_name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((dim, i) => (
                <tr key={dim.key} style={{ background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <th scope="row" className="p-4 border-b border-r font-medium uppercase tracking-wide text-left"
                    style={{ fontSize: 'var(--text-label)', borderColor: 'var(--border)', color: 'var(--text-muted)', background: '#F7F9FC' }}>
                    {dim.label}
                  </th>
                  {selected.map(app => (
                    <td key={app.id} className="p-4 border-b border-r align-top" style={{ borderColor: 'var(--border)' }}>
                      <CellValue app={app} dim={dim.key} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="p-4 border-b border-r font-medium uppercase tracking-wide text-left"
                  style={{ fontSize: 'var(--text-label)', borderColor: 'var(--border)', color: 'var(--text-muted)', background: '#F7F9FC' }}>
                  Evidence summary
                </th>
                {selected.map(app => (
                  <td key={app.id} className="p-4 border-b border-r align-top" style={{ borderColor: 'var(--border)' }}>
                    <p className="leading-relaxed" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
                      {app.evidence_summary.slice(0, 200)}…
                    </p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4" style={{ background: '#F7F9FC' }} />
                {selected.map(app => (
                    <td key={app.id} className="p-4">
                      <Link href={`/apps/${app.slug}`}
                        className="block text-center text-sm font-semibold rounded-lg py-2"
                        style={{ background: STORE_ACCENT, color: '#fff' }}>
                        View details →
                      </Link>
                    </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
