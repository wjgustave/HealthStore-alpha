'use client'
import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { evidenceLabels, type App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import {
  catalogueDemoAvailable,
  getCataloguePriceLabel,
  hasLinkedFunding,
} from '@/lib/catalogueCardSignals'
import { EvidenceBadge, SupervisionBadge, ConditionTag } from '@/components/Badges'
import { CompareToggleButton } from '@/components/CompareToggleButton'
import { Check, X } from 'lucide-react'

function CatalogueSignalDotRow({ tone, label }: { tone: 'green' | 'orange' | 'blue'; label: string }) {
  const stroke =
    tone === 'green' ? 'var(--nhs-green)' : tone === 'orange' ? 'var(--nhs-amber)' : 'var(--nhs-blue)'
  return (
    <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
      <Check
        className="shrink-0 w-3.5 h-3.5"
        strokeWidth={3.25}
        style={{ color: stroke }}
        aria-hidden
      />
      <span
        className="font-light leading-tight text-[12px] sm:text-[13px] lg:text-[14px]"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
    </div>
  )
}

const supervisionOptions = [
  { id: 'all', label: 'All models' },
  { id: 'self_management_only', label: 'Self-management' },
  { id: 'guided_self_help', label: 'Guided self-help' },
  { id: 'active_remote_management', label: 'Active remote management' },
]

const evidenceOptions = [
  { id: 'all', label: 'Any evidence level' },
  ...Object.entries(evidenceLabels).map(([id, label]) => ({ id, label })),
]

const conditionOptions = [
  { id: 'all', label: 'All conditions' },
  { id: 'copd', label: 'COPD' },
  { id: 'cardiac_rehab', label: 'Cardiac rehabilitation' },
]

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <div>
      <label className="block font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full min-h-[44px] text-sm rounded-lg border px-3 py-2.5 bg-white"
        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    </div>
  )
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium"
      style={{ background: '#E6F0FB', color: '#003087' }}>
      {label}
      <button type="button" onClick={onRemove} className="rounded-sm p-0.5 transition-colors hover:bg-white/60 hover:opacity-90" aria-label={`Remove ${label} filter`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

export default function CatalogueClient({ apps }: { apps: App[] }) {
  const [supervision, setSupervision] = useState('all')
  const [evidence, setEvidence] = useState('all')
  const [condition, setCondition] = useState('all')
  const [demoOnly, setDemoOnly] = useState(false)
  const liveRegion = useRef<HTMLDivElement>(null)

  const activeFilters: { label: string; clear: () => void }[] = []
  if (supervision !== 'all') activeFilters.push({ label: supervisionOptions.find(o => o.id === supervision)!.label, clear: () => setSupervision('all') })
  if (evidence !== 'all') activeFilters.push({ label: evidenceOptions.find(o => o.id === evidence)!.label, clear: () => setEvidence('all') })
  if (condition !== 'all') activeFilters.push({ label: conditionOptions.find(o => o.id === condition)!.label, clear: () => setCondition('all') })
  if (demoOnly) activeFilters.push({ label: 'Demo available', clear: () => setDemoOnly(false) })

  const filtered = useMemo(() => {
    const result = apps
      .filter(app => {
        if (supervision !== 'all' && app.supervision_model !== supervision) return false
        if (evidence !== 'all' && app.evidence_strength !== evidence) return false
        if (condition !== 'all' && !app.condition_tags.includes(condition)) return false
        if (demoOnly && !catalogueDemoAvailable(app)) return false
        return true
      })
      .sort((a, b) => a.app_name.localeCompare(b.app_name))

    return result
  }, [apps, supervision, evidence, condition, demoOnly])

  const resultText = `Showing ${filtered.length} of ${apps.length} apps`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="page-title-h1">
          Browse digital therapeutics
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
          {apps.length} apps across {conditionOptions.length - 1} condition areas · Last reviewed March 2026
        </p>
      </div>

      {/* Toolbar: result count + filters — full width above grid */}
      <div className="hs-surface-card rounded-xl bg-white border p-4 mb-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col gap-4">
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>{resultText}</p>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 min-w-0">
              <FilterSelect label="Condition" value={condition} onChange={setCondition} options={conditionOptions} />
              <FilterSelect label="Supervision model" value={supervision} onChange={setSupervision} options={supervisionOptions} />
              <FilterSelect label="Evidence level" value={evidence} onChange={setEvidence} options={evidenceOptions} />
            </div>
            <div className="flex flex-wrap items-end gap-4 shrink-0 xl:ml-auto">
              <div className="flex min-h-[44px] items-center gap-2.5">
                <input
                  id="catalogue-demo-only"
                  type="checkbox"
                  checked={demoOnly}
                  onChange={e => setDemoOnly(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border accent-[#003087]"
                  style={{ borderColor: 'var(--border)' }}
                />
                <label
                  htmlFor="catalogue-demo-only"
                  className="cursor-pointer select-none text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Demo available
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSupervision('all')
                  setEvidence('all')
                  setCondition('all')
                  setDemoOnly(false)
                }}
                className="min-h-[44px] text-sm px-4 rounded-lg border transition-colors hover:bg-[#F7F9FC] hover:border-[var(--text-muted-low-con)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                Clear filters
              </button>
            </div>
          </div>
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

      <div ref={liveRegion} aria-live="polite" aria-atomic="true" className="sr-only">
        {resultText}
      </div>

      {filtered.length === 0 ? (
        <div className="hs-surface-card text-center py-16 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }} aria-hidden>
            🔍
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No apps match your filters</div>
          <div style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>Try adjusting your filter criteria</div>
        </div>
      ) : (
        <div
          className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))] xl:[grid-template-columns:repeat(auto-fill,minmax(360px,1fr))] 2xl:[grid-template-columns:repeat(auto-fill,minmax(380px,1fr))]"
        >
          {filtered.map((app: App) => {
            const priceLabel = getCataloguePriceLabel(app)
            const showDemo = catalogueDemoAvailable(app)
            const showFunding = hasLinkedFunding(app)
            return (
            <div key={app.id} className="app-card flex h-full min-h-0 flex-col rounded-xl border bg-white" style={{ borderColor: 'var(--border)' }}>
              <div className="flex min-h-0 flex-1 flex-col" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: '0.75rem' }}>
                  <div className="flex items-center gap-2.5">
                    {app.logo_path && (
                      <Image src={app.logo_path} alt="" width={32} height={32} className="rounded-md flex-shrink-0" />
                    )}
                    <div>
                      <h3
                        style={{
                          fontFamily: 'Frutiger, Arial, sans-serif',
                          fontWeight: 700,
                          fontSize: 'var(--text-card-title-sm)',
                          color: 'var(--text-primary)',
                          marginBottom: 2,
                        }}
                      >
                        {app.app_name}
                      </h3>
                      <p style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', margin: 0 }}>{app.supplier_name}</p>
                    </div>
                  </div>
                  {app.nhse_125k_eligible && app.slug !== 'clinitouch' && (
                    <span className="badge badge-green" style={{ flexShrink: 0 }}>
                      ★ NHSE £125k
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1" style={{ marginBottom: '0.75rem' }}>
                  {app.condition_tags.map((t: string) => (
                    <ConditionTag key={t} tag={t} />
                  ))}
                  <SupervisionBadge model={app.supervision_model} />
                  <EvidenceBadge strength={app.evidence_strength} />
                </div>

                <p
                  className="line-clamp-5"
                  style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}
                >
                  {app.one_line_value_proposition}
                </p>

                <div className="mt-auto flex min-w-0 flex-col">
                  {priceLabel || showDemo || showFunding ? (
                    <>
                      <div className="mb-[10px] flex flex-row flex-wrap items-center gap-x-2 gap-y-1 sm:mb-3 lg:mb-[15px] xl:flex-nowrap xl:gap-x-1.5 2xl:gap-x-2">
                        {priceLabel ? <CatalogueSignalDotRow tone="green" label={priceLabel} /> : null}
                        {showDemo ? <CatalogueSignalDotRow tone="orange" label="Demo available" /> : null}
                        {showFunding ? <CatalogueSignalDotRow tone="blue" label="Funding opportunities" /> : null}
                      </div>
                      <div
                        className="mb-[12px] border-t border-solid sm:mb-4 lg:mb-5"
                        style={{
                          borderTopColor: 'color-mix(in srgb, var(--text-muted) 15%, var(--border))',
                        }}
                        aria-hidden
                      />
                    </>
                  ) : null}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Link
                      href={`/apps/${app.slug}`}
                      className="block rounded-lg py-4 text-center text-sm font-semibold transition-colors hover:!bg-[#004B8C] sm:col-span-2"
                      style={{ background: STORE_ACCENT, color: '#fff' }}
                    >
                      View details →
                    </Link>
                    <CompareToggleButton appId={app.id} className="w-full sm:col-span-1" />
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
