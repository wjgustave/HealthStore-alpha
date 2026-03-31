'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { buildBrowseSearchParams, filterAppsBySearchQuery, parseBrowseConditionParam } from '@/lib/catalogueSearch'

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supervision, setSupervision] = useState('all')
  const [evidence, setEvidence] = useState('all')
  const [condition, setCondition] = useState('all')
  const [demoOnly, setDemoOnly] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const conditionRef = useRef(condition)
  const liveRegion = useRef<HTMLDivElement>(null)

  useEffect(() => {
    conditionRef.current = condition
  }, [condition])

  const replaceBrowseUrl = useCallback(
    (nextCondition: string, nextQ: string) => {
      const suffix = buildBrowseSearchParams(nextCondition, nextQ)
      router.replace(`/apps/browse${suffix}`, { scroll: false })
    },
    [router],
  )

  useEffect(() => {
    const c = parseBrowseConditionParam(searchParams.get('condition'))
    const q = searchParams.get('q') ?? ''
    setCondition(c)
    setSearchInput(q)
  }, [searchParams])

  const scheduleUrlFromSearch = useCallback(
    (q: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        replaceBrowseUrl(conditionRef.current, q)
      }, 350)
    },
    [replaceBrowseUrl],
  )

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
  }, [])

  const onConditionChange = (v: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setCondition(v)
    replaceBrowseUrl(v, searchInput)
  }

  const onSearchInputChange = (v: string) => {
    setSearchInput(v)
    scheduleUrlFromSearch(v)
  }

  const clearSearchOnly = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setSearchInput('')
    replaceBrowseUrl(condition, '')
  }

  const activeFilters: { label: string; clear: () => void }[] = []
  if (supervision !== 'all') activeFilters.push({ label: supervisionOptions.find(o => o.id === supervision)!.label, clear: () => setSupervision('all') })
  if (evidence !== 'all') activeFilters.push({ label: evidenceOptions.find(o => o.id === evidence)!.label, clear: () => setEvidence('all') })
  if (condition !== 'all') activeFilters.push({ label: conditionOptions.find(o => o.id === condition)!.label, clear: () => {
    setCondition('all')
    replaceBrowseUrl('all', searchInput)
  } })
  if (demoOnly) activeFilters.push({ label: 'Demo available', clear: () => setDemoOnly(false) })
  if (searchInput.trim()) {
    const st = searchInput.trim()
    activeFilters.push({
      label: `Search: “${st.length > 28 ? `${st.slice(0, 28)}…` : st}”`,
      clear: clearSearchOnly,
    })
  }

  const attrFiltered = useMemo(() => {
    return apps.filter((app: App) => {
      if (supervision !== 'all' && app.supervision_model !== supervision) return false
      if (evidence !== 'all' && app.evidence_strength !== evidence) return false
      if (condition !== 'all' && !app.condition_tags.includes(condition)) return false
      if (demoOnly && !catalogueDemoAvailable(app)) return false
      return true
    })
  }, [apps, supervision, evidence, condition, demoOnly])

  const filtered = useMemo(
    () => filterAppsBySearchQuery(attrFiltered, searchInput),
    [attrFiltered, searchInput],
  )

  const filteredSorted = useMemo(
    () => [...filtered].sort((a, b) => a.app_name.localeCompare(b.app_name)),
    [filtered],
  )

  const resultText = `Showing ${filteredSorted.length} of ${apps.length} apps`

  const hasAttrResults = attrFiltered.length > 0
  const searchOnlyEmpty = hasAttrResults && filteredSorted.length === 0 && searchInput.trim().length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <li>
            <Link href="/apps" className="font-medium transition-colors hover:underline" style={{ color: '#005EB8' }}>
              Browse apps
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li style={{ color: 'var(--text-primary)' }} aria-current="page">
            Digital therapeutics
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="page-title-h1">
          Browse digital therapeutics
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
          {apps.length} apps across {conditionOptions.length - 1} condition areas · Last reviewed March 2026
        </p>
      </div>

      <div className="hs-surface-card rounded-xl bg-white border p-4 mb-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col gap-4">
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>{resultText}</p>
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="catalogue-search" className="block font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
                Search
              </label>
              <input
                id="catalogue-search"
                type="search"
                value={searchInput}
                onChange={e => onSearchInputChange(e.target.value)}
                placeholder="Filter by app name, supplier, or condition"
                className="w-full min-h-[44px] text-sm rounded-lg border px-3 py-2.5 bg-white"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 min-w-0">
                <FilterSelect label="Condition" value={condition} onChange={onConditionChange} options={conditionOptions} />
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
                    if (debounceTimer.current) clearTimeout(debounceTimer.current)
                    setSupervision('all')
                    setEvidence('all')
                    setCondition('all')
                    setDemoOnly(false)
                    setSearchInput('')
                    router.replace('/apps/browse', { scroll: false })
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
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((f, i) => (
            <FilterPill key={`${i}-${f.label}`} label={f.label} onRemove={f.clear} />
          ))}
        </div>
      )}

      <div ref={liveRegion} aria-live="polite" aria-atomic="true" className="sr-only">
        {resultText}
      </div>

      {filteredSorted.length === 0 ? (
        <div className="hs-surface-card text-center py-16 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }} aria-hidden>
            🔍
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            {searchOnlyEmpty ? 'No apps match your search' : 'No apps match your filters'}
          </div>
          <div style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: searchOnlyEmpty ? 16 : 0 }}>
            {searchOnlyEmpty
              ? 'Try different words, clear the search box, or browse all apps.'
              : 'Try adjusting your filter criteria'}
          </div>
          {searchOnlyEmpty ? (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:!bg-[#004B8C]"
                style={{ background: STORE_ACCENT }}
                onClick={clearSearchOnly}
              >
                Clear search
              </button>
              <Link
                href="/apps/browse"
                className="inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F7F9FC]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                Browse all apps
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))] xl:[grid-template-columns:repeat(auto-fill,minmax(360px,1fr))] 2xl:[grid-template-columns:repeat(auto-fill,minmax(380px,1fr))]"
        >
          {filteredSorted.map((app: App) => {
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
