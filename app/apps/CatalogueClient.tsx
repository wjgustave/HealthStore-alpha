'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { App } from '@/lib/data'
import { DtacBadge, MaturityBadge, EvidenceBadge, EffortBadge, SupervisionBadge } from '@/components/Badges'

const supervisionOptions = [
  { id: 'all', label: 'All models' },
  { id: 'self_management_only', label: 'Self-management only' },
  { id: 'guided_self_help', label: 'Guided self-help' },
  { id: 'non_continuous_review', label: 'Non-continuous review' },
  { id: 'active_remote_management', label: 'Active remote management' },
]

const effortOptions = [
  { id: 'all', label: 'Any effort level' },
  { id: 'low', label: 'Low effort' },
  { id: 'medium', label: 'Medium effort' },
  { id: 'high', label: 'High effort' },
]

const dtacOptions = [
  { id: 'all', label: 'Any DTAC status' },
  { id: 'passed', label: 'DTAC Passed' },
  { id: 'passed_refresh_required', label: 'Passed – refresh required' },
  { id: 'required_not_confirmed', label: 'Not confirmed' },
]

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full text-sm rounded-lg border px-3 py-2 bg-white"
        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    </div>
  )
}

export default function CatalogueClient({ apps }: { apps: App[] }) {
  const searchParams = useSearchParams()
  const [supervision, setSupervision] = useState('all')
  const [effort, setEffort] = useState('all')
  const [dtac, setDtac] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return apps.filter(app => {
      if (supervision !== 'all' && app.supervision_model !== supervision) return false
      if (effort !== 'all' && app.local_wraparound !== effort) return false
      if (dtac !== 'all' && app.dtac_status !== dtac) return false
      if (search) {
        const q = search.toLowerCase()
        if (!app.app_name.toLowerCase().includes(q) &&
            !app.supplier_name.toLowerCase().includes(q) &&
            !app.one_line_value_proposition.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [apps, supervision, effort, dtac, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          NICE HTE19 COPD digital therapeutics
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          4 apps · All recommended under NICE HTG736 (December 2024) · Last reviewed March 2026
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Filters */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="rounded-xl bg-white border p-5 space-y-4" style={{ borderColor: 'var(--border)' }}>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Search
              </label>
              <input type="text" placeholder="App name, supplier…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full text-sm rounded-lg border px-3 py-2"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <FilterSelect label="Supervision model" value={supervision} onChange={setSupervision} options={supervisionOptions} />
            <FilterSelect label="Local effort" value={effort} onChange={setEffort} options={effortOptions} />
            <FilterSelect label="DTAC status" value={dtac} onChange={setDtac} options={dtacOptions} />
            <button onClick={() => { setSupervision('all'); setEffort('all'); setDtac('all'); setSearch('') }}
              className="w-full text-sm py-2 rounded-lg border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Clear filters
            </button>
          </div>

          {/* NICE box */}
          <div className="rounded-xl border p-4 mt-4" style={{ borderColor: '#005EB8', background: '#E6F0FB' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#003087', marginBottom: 6 }}>NICE HTG736</div>
            <p style={{ fontSize: 11, color: '#003087', lineHeight: 1.6, margin: '0 0 8px' }}>
              All four apps are recommended during a 3-year evidence generation period ending ~December 2027.
            </p>
            <a href="https://www.nice.org.uk/guidance/htg736" target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: '#005EB8', fontWeight: 600 }}>
              View NICE guidance ↗
            </a>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Showing {filtered.length} of {apps.length} apps
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No apps match your filters</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Try adjusting your filter criteria</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }}>
              {filtered.map((app: App) => (
                <div key={app.id} className="app-card rounded-xl bg-white border flex flex-col"
                  style={{ borderColor: 'var(--border)' }}>
                  <div style={{ height: 4, background: '#005EB8', borderRadius: '10px 10px 0 0' }} />
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                          {app.app_name}
                        </h3>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{app.supplier_name}</p>
                      </div>
                      {app.nhse_125k_eligible && (
                        <span className="badge badge-green" style={{ fontSize: 10, flexShrink: 0 }}>★ NHSE £125k</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1" style={{ marginBottom: '0.75rem' }}>
                      <SupervisionBadge model={app.supervision_model} />
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1, marginBottom: '1rem' }}>
                      {app.one_line_value_proposition}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 0.75rem', marginBottom: '1rem' }}>
                      {[
                        { label: 'Maturity', badge: <MaturityBadge level={app.maturity_level} /> },
                        { label: 'Evidence', badge: <EvidenceBadge strength={app.evidence_strength} /> },
                        { label: 'Local effort', badge: <EffortBadge level={app.local_wraparound} /> },
                        { label: 'DTAC', badge: <DtacBadge status={app.dtac_status} /> },
                      ].map(({ label, badge }) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
                          {badge}
                        </div>
                      ))}
                    </div>

                    <Link href={`/apps/${app.slug}`}
                      className="rounded-lg py-2.5 text-sm font-semibold text-center block"
                      style={{ background: '#005EB8', color: '#fff' }}>
                      View full assessment →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
