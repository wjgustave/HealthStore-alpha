'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { DtacBadge, MaturityBadge, EvidenceBadge, EffortBadge, SupervisionBadge } from '@/components/Badges'

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

export default function CompareClient({ allApps }: Props) {
  const searchParams = useSearchParams()
  const initIds = searchParams?.get('ids')?.split(',').filter(Boolean) ?? []

  const [selectedIds, setSelectedIds] = useState<string[]>(initIds.slice(0, 4))

  const selected = selectedIds.map(id => allApps.find(a => a.id === id)).filter(Boolean) as App[]

  const toggleApp = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Compare apps
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>Select up to 4 apps to compare side by side</p>
      </div>

      {/* App selector */}
      <div className="bg-white rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)' }}>
        <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          Select apps to compare ({selectedIds.length}/4)
        </div>
        <div className="flex flex-wrap gap-2">
          {allApps.map(app => {
            const sel = selectedIds.includes(app.id)
            return (
              <button key={app.id} onClick={() => toggleApp(app.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
                style={{
                  borderColor: sel ? STORE_ACCENT : 'var(--border)',
                  background: sel ? STORE_ACCENT : '#fff',
                  color: sel ? '#fff' : 'var(--text-secondary)',
                }}>
                {sel ? '✓ ' : ''}{app.app_name}
              </button>
            )
          })}
        </div>
      </div>

      {selected.length < 2 ? (
        <div className="text-center py-20 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-4xl mb-4">⚖️</div>
          <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Select at least 2 apps to compare</div>
          <div style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>Use the selector above</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full border-collapse" style={{ fontSize: 'var(--text-body)' }}>
            <thead>
              <tr>
                <th className="text-left p-4 border-b border-r font-semibold uppercase tracking-wide"
                  style={{ fontSize: 'var(--text-label)', borderColor: 'var(--border)', color: 'var(--text-muted)', width: 180, background: '#F7F9FC' }}>
                  Dimension
                </th>
                {selected.map(app => (
                    <th key={app.id} className="p-4 border-b border-r text-left" style={{ borderColor: 'var(--border)', background: '#FAFBFC' }}>
                      <Link href={`/apps/${app.slug}`} className="font-bold hover:underline"
                        style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)', fontSize: 'var(--text-card-title-sm)' }}>
                        {app.app_name}
                      </Link>
                      <div className="font-normal mt-0.5" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>{app.supplier_name}</div>
                    </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((dim, i) => (
                <tr key={dim.key} style={{ background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <td className="p-4 border-b border-r font-medium uppercase tracking-wide"
                    style={{ fontSize: 'var(--text-label)', borderColor: 'var(--border)', color: 'var(--text-muted)', background: '#F7F9FC' }}>
                    {dim.label}
                  </td>
                  {selected.map(app => (
                    <td key={app.id} className="p-4 border-b border-r align-top" style={{ borderColor: 'var(--border)' }}>
                      <CellValue app={app} dim={dim.key} />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Evidence summary row */}
              <tr>
                <td className="p-4 border-b border-r font-medium uppercase tracking-wide"
                  style={{ fontSize: 'var(--text-label)', borderColor: 'var(--border)', color: 'var(--text-muted)', background: '#F7F9FC' }}>
                  Evidence summary
                </td>
                {selected.map(app => (
                  <td key={app.id} className="p-4 border-b border-r align-top" style={{ borderColor: 'var(--border)' }}>
                    <p className="leading-relaxed" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
                      {app.evidence_summary.slice(0, 200)}…
                    </p>
                  </td>
                ))}
              </tr>
              {/* CTA row */}
              <tr>
                <td className="p-4" style={{ background: '#F7F9FC' }} />
                {selected.map(app => (
                    <td key={app.id} className="p-4">
                      <Link href={`/apps/${app.slug}`}
                        className="block text-center text-sm font-semibold rounded-lg py-2"
                        style={{ background: STORE_ACCENT, color: '#fff' }}>
                        Full assessment →
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
