'use client'
import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { App } from '@/lib/data'
import { DtacBadge, MaturityBadge, EvidenceBadge, EffortBadge, SupervisionBadge, ConditionTag } from '@/components/Badges'
import { X } from 'lucide-react'

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

const conditionOptions = [
  { id: 'all', label: 'All conditions' },
  { id: 'copd', label: 'COPD' },
  { id: 'cardiac_rehab', label: 'Cardiac rehabilitation' },
]

const sortOptions = [
  { id: 'az', label: 'A–Z' },
  { id: 'condition', label: 'By condition' },
  { id: 'maturity', label: 'Most mature first' },
  { id: 'evidence', label: 'Strongest evidence' },
  { id: 'effort', label: 'Lowest effort first' },
]

const maturityOrder: Record<string, number> = { scaled: 0, multi_site_live: 1, limited_live: 2, pilot: 3 }
const evidenceOrder: Record<string, number> = { established: 0, promising: 1, scaled: 0, emerging: 2 }
const effortOrder: Record<string, number> = { low: 0, medium: 1, high: 2 }
const conditionColours: Record<string, string> = {
  copd: '#005EB8', insomnia: '#330072', weight_management: '#007F3B', msk: '#D5840D', eating_disorders: '#DA291C', cardiac_rehab: '#AE2573',
}

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

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: '#E6F0FB', color: '#003087' }}>
      {label}
      <button onClick={onRemove} className="hover:opacity-70" aria-label={`Remove ${label} filter`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

export default function CatalogueClient({ apps }: { apps: App[] }) {
  const [supervision, setSupervision] = useState('all')
  const [effort, setEffort] = useState('all')
  const [dtac, setDtac] = useState('all')
  const [condition, setCondition] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('az')
  const liveRegion = useRef<HTMLDivElement>(null)

  const activeFilters: { label: string; clear: () => void }[] = []
  if (supervision !== 'all') activeFilters.push({ label: supervisionOptions.find(o => o.id === supervision)!.label, clear: () => setSupervision('all') })
  if (effort !== 'all') activeFilters.push({ label: effortOptions.find(o => o.id === effort)!.label, clear: () => setEffort('all') })
  if (dtac !== 'all') activeFilters.push({ label: dtacOptions.find(o => o.id === dtac)!.label, clear: () => setDtac('all') })
  if (condition !== 'all') activeFilters.push({ label: conditionOptions.find(o => o.id === condition)!.label, clear: () => setCondition('all') })
  if (search) activeFilters.push({ label: `"${search}"`, clear: () => setSearch('') })

  const filtered = useMemo(() => {
    let result = apps.filter(app => {
      if (supervision !== 'all' && app.supervision_model !== supervision) return false
      if (effort !== 'all' && app.local_wraparound !== effort) return false
      if (dtac !== 'all' && app.dtac_status !== dtac) return false
      if (condition !== 'all' && !app.condition_tags.includes(condition)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!app.app_name.toLowerCase().includes(q) &&
            !app.supplier_name.toLowerCase().includes(q) &&
            !app.one_line_value_proposition.toLowerCase().includes(q)) return false
      }
      return true
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'az': return a.app_name.localeCompare(b.app_name)
        case 'condition': return (a.condition_tags[0] ?? '').localeCompare(b.condition_tags[0] ?? '')
        case 'maturity': return (maturityOrder[a.maturity_level] ?? 9) - (maturityOrder[b.maturity_level] ?? 9)
        case 'evidence': return (evidenceOrder[a.evidence_strength] ?? 9) - (evidenceOrder[b.evidence_strength] ?? 9)
        case 'effort': return (effortOrder[a.local_wraparound] ?? 9) - (effortOrder[b.local_wraparound] ?? 9)
        default: return 0
      }
    })

    return result
  }, [apps, supervision, effort, dtac, condition, search, sort])

  const resultText = `Showing ${filtered.length} of ${apps.length} apps`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Browse digital therapeutics
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {apps.length} apps across {conditionOptions.length - 1} condition areas · Last reviewed March 2026
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
            <FilterSelect label="Condition" value={condition} onChange={setCondition} options={conditionOptions} />
            <FilterSelect label="Supervision model" value={supervision} onChange={setSupervision} options={supervisionOptions} />
            <FilterSelect label="Local effort" value={effort} onChange={setEffort} options={effortOptions} />
            <FilterSelect label="DTAC status" value={dtac} onChange={setDtac} options={dtacOptions} />
            <button onClick={() => { setSupervision('all'); setEffort('all'); setDtac('all'); setCondition('all'); setSearch('') }}
              className="w-full text-sm py-2 rounded-lg border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Clear filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {resultText}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Sort:</label>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-sm rounded-lg border px-2 py-1.5 bg-white"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                {sortOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(f => (
                <FilterPill key={f.label} label={f.label} onRemove={f.clear} />
              ))}
            </div>
          )}

          {/* aria-live region */}
          <div ref={liveRegion} aria-live="polite" aria-atomic="true" className="sr-only">
            {resultText}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No apps match your filters</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Try adjusting your filter criteria</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filtered.map((app: App) => {
                const accent = conditionColours[app.condition_tags[0]] ?? '#005EB8'
                return (
                  <div key={app.id} className="app-card rounded-xl bg-white border flex flex-col"
                    style={{ borderColor: 'var(--border)' }}>
                    <div style={{ height: 4, background: accent, borderRadius: '10px 10px 0 0' }} />
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: '0.75rem' }}>
                        <div className="flex items-center gap-2.5">
                          {app.logo_path && (
                            <Image src={app.logo_path} alt="" width={32} height={32} className="rounded-md flex-shrink-0" />
                          )}
                          <div>
                            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                              {app.app_name}
                            </h3>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{app.supplier_name}</p>
                          </div>
                        </div>
                        {app.nhse_125k_eligible && (
                          <span className="badge badge-green" style={{ fontSize: 10, flexShrink: 0 }}>★ NHSE £125k</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1" style={{ marginBottom: '0.75rem' }}>
                        {app.condition_tags.map((t: string) => <ConditionTag key={t} tag={t} />)}
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
                          <div key={label} style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
                            {badge}
                          </div>
                        ))}
                      </div>

                      <Link href={`/apps/${app.slug}`}
                        className="rounded-lg py-2.5 text-sm font-semibold text-center block"
                        style={{ background: accent, color: '#fff' }}>
                        View full assessment →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
