'use client'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { getConditionAreas, supervisionLabels, type App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { MaturityBadge, SupervisionBadge, ConditionTag } from '@/components/Badges'
import { CompareToggleButton } from '@/components/CompareToggleButton'
import { X } from 'lucide-react'
import { buildBrowseSearchParams, filterAppsBySearchQuery, parseBrowseConditionParam } from '@/lib/catalogueSearch'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { getProductNarrative } from '@/lib/content/productNarratives'

const supervisionOptions = Object.entries(supervisionLabels).map(([id, label]) => ({ id, label }))

const conditionOptions = [
  { id: 'all', label: 'All conditions' },
  ...getConditionAreas().map(c => ({ id: c.id, label: c.label })),
]

/**
 * Nested facet accordion — mirrors GOV.UK `.app-c-filter-section` (details/summary
 * with a chevron that flips when open). Collapsed by default, like the live
 * gov.uk/search/all panel.
 */
function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="hs-filter-section group">
      <summary className="hs-filter-section__summary">
        <span className="hs-filter-section__heading">{title}</span>
      </summary>
      <div className="hs-filter-section__content">{children}</div>
    </details>
  )
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="pill hs-text-caption" style={{ background: '#E6F0FB', color: '#003087', borderColor: '#E6F0FB' }}>
      {label}
      <button type="button" onClick={onRemove} className="rounded-sm p-1 transition-colors hover:bg-white/60 hover:opacity-90" aria-label={`Remove ${label} filter`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

export default function CatalogueClient({ apps }: { apps: App[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterPanelId = useId()

  /** Applied filters — drive the result list. */
  const [condition, setCondition] = useState('all')
  const [supervision, setSupervision] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState('')

  /**
   * Draft filters — edited inside the panel. Applied only when the user clicks
   * Apply, matching GOV.UK's filter-panel submit interaction.
   */
  const [draftCondition, setDraftCondition] = useState('all')
  const [draftSupervision, setDraftSupervision] = useState<string[]>([])

  /** Panel starts collapsed (`aria-expanded=false`), same as GOV.UK. */
  const [filtersOpen, setFiltersOpen] = useState(false)

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const conditionRef = useRef(condition)
  const liveRegion = useRef<HTMLDivElement>(null)

  useEffect(() => {
    conditionRef.current = condition
  }, [condition])

  const replaceBrowseUrl = useCallback(
    (nextCondition: string, nextQ: string) => {
      const suffix = buildBrowseSearchParams(nextCondition, nextQ)
      router.replace(`/apps/condition-catalogue${suffix}`, { scroll: false })
    },
    [router],
  )

  useEffect(() => {
    const c = parseBrowseConditionParam(searchParams.get('condition'))
    const q = searchParams.get('q') ?? ''
    setCondition(c)
    setDraftCondition(c)
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

  const onSearchInputChange = (v: string) => {
    setSearchInput(v)
    scheduleUrlFromSearch(v)
  }

  const clearSearchOnly = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setSearchInput('')
    replaceBrowseUrl(condition, '')
  }

  const toggleDraftSupervision = (id: string) => {
    setDraftSupervision(prev => (prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]))
  }

  const openFilters = () => {
    // Sync draft from applied so reopening shows the current selection.
    setDraftCondition(condition)
    setDraftSupervision(supervision)
    setFiltersOpen(true)
  }

  const closeFilters = () => setFiltersOpen(false)

  const toggleFilters = () => {
    if (filtersOpen) closeFilters()
    else openFilters()
  }

  const applyFilters = (e?: FormEvent) => {
    e?.preventDefault()
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setCondition(draftCondition)
    setSupervision(draftSupervision)
    replaceBrowseUrl(draftCondition, searchInput)
    setFiltersOpen(false)
  }

  const clearAllFilters = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setSupervision([])
    setDraftSupervision([])
    setCondition('all')
    setDraftCondition('all')
    setSearchInput('')
    router.replace('/apps/condition-catalogue', { scroll: false })
  }

  const activeFilters: { label: string; clear: () => void }[] = []
  if (condition !== 'all') {
    activeFilters.push({
      label: conditionOptions.find(o => o.id === condition)!.label,
      clear: () => {
        setCondition('all')
        setDraftCondition('all')
        replaceBrowseUrl('all', searchInput)
      },
    })
  }
  for (const s of supervision) {
    activeFilters.push({
      label: supervisionLabels[s] ?? s,
      clear: () => {
        const next = supervision.filter(id => id !== s)
        setSupervision(next)
        setDraftSupervision(next)
      },
    })
  }
  if (searchInput.trim()) {
    const st = searchInput.trim()
    activeFilters.push({
      label: `Search: “${st.length > 28 ? `${st.slice(0, 28)}…` : st}”`,
      clear: clearSearchOnly,
    })
  }

  const attrFiltered = useMemo(() => {
    return apps.filter((app: App) => {
      if (supervision.length > 0 && !supervision.includes(app.supervision_model)) return false
      if (condition !== 'all' && !app.condition_tags.includes(condition)) return false
      return true
    })
  }, [apps, supervision, condition])

  const filtered = useMemo(
    () => filterAppsBySearchQuery(attrFiltered, searchInput),
    [attrFiltered, searchInput],
  )

  const filteredSorted = useMemo(
    () => [...filtered].sort((a, b) => a.app_name.localeCompare(b.app_name)),
    [filtered],
  )

  const resultCount = filteredSorted.length
  const resultText = `${resultCount.toLocaleString()} ${resultCount === 1 ? 'result' : 'results'}`
  const resultSummary = `Showing ${resultCount} of ${apps.length} apps`

  const hasAttrResults = attrFiltered.length > 0
  const searchOnlyEmpty = hasAttrResults && filteredSorted.length === 0 && searchInput.trim().length > 0

  return (
    <div className="hs-page">
      <PageBreadcrumb
        items={[
          { label: 'Find apps', href: '/apps' },
          { label: 'Condition catalogue' },
        ]}
      />

      <div className="mb-8">
        <h1 className="page-title-h1">
          Condition catalogue
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
          {apps.length} apps across {conditionOptions.length - 1} condition areas · Last reviewed March 2026
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="catalogue-search" className="block hs-font-bold mb-2 uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
          Search
        </label>
        <input
          id="catalogue-search"
          type="search"
          value={searchInput}
          onChange={e => onSearchInputChange(e.target.value)}
          placeholder="Filter by app name, supplier, or condition"
          className="w-full min-h-[44px] hs-text-label rounded-lg border px-4 py-2 bg-white"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          autoComplete="off"
        />
      </div>

      {/*
        GOV.UK filter-panel interaction (gov.uk/search/all):
        - Header row: expandable "Filter" link + result count
        - Content region expands vertically below the header
        - Nested details sections for each facet
        - Apply button submits draft selections and collapses the panel
        Colours / form controls use NHS tokens and nhsuk-radios / nhsuk-checkboxes.
      */}
      <div className="hs-filter-panel mb-6">
        <div className="hs-filter-panel__header">
          <button
            type="button"
            id={`${filterPanelId}-button`}
            className="hs-filter-panel__button"
            aria-expanded={filtersOpen}
            aria-controls={`${filterPanelId}-content`}
            onClick={toggleFilters}
          >
            <span className="hs-filter-panel__button-inner">Filter</span>
          </button>
          <h2 id={`${filterPanelId}-count`} className="hs-filter-panel__count">
            {resultText}
          </h2>
        </div>

        {filtersOpen ? (
          <div
            id={`${filterPanelId}-content`}
            className="hs-filter-panel__content"
            role="region"
            aria-labelledby={`${filterPanelId}-button`}
          >
            <form onSubmit={applyFilters}>
              <FilterSection title="Condition">
                <fieldset className="nhsuk-fieldset">
                  <legend className="nhsuk-u-visually-hidden">Condition</legend>
                  <div className="nhsuk-radios">
                    {conditionOptions.map(o => (
                      <div key={o.id} className="nhsuk-radios__item">
                        <input
                          className="nhsuk-radios__input"
                          id={`filter-condition-${o.id}`}
                          type="radio"
                          name="filter-condition"
                          checked={draftCondition === o.id}
                          onChange={() => setDraftCondition(o.id)}
                        />
                        <label className="nhsuk-radios__label" htmlFor={`filter-condition-${o.id}`}>
                          {o.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </FilterSection>

              <FilterSection title="Supervision model">
                <fieldset className="nhsuk-fieldset">
                  <legend className="nhsuk-u-visually-hidden">Supervision model</legend>
                  <div className="nhsuk-checkboxes">
                    {supervisionOptions.map(o => (
                      <div key={o.id} className="nhsuk-checkboxes__item">
                        <input
                          className="nhsuk-checkboxes__input"
                          id={`filter-supervision-${o.id}`}
                          type="checkbox"
                          checked={draftSupervision.includes(o.id)}
                          onChange={() => toggleDraftSupervision(o.id)}
                        />
                        <label className="nhsuk-checkboxes__label" htmlFor={`filter-supervision-${o.id}`}>
                          {o.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </FilterSection>

              <div className="hs-filter-panel__actions">
                <button type="submit" className="nhsuk-button mb-0 hs-filter-panel__apply">
                  Apply
                </button>
                {(condition !== 'all' || supervision.length > 0 || draftCondition !== 'all' || draftSupervision.length > 0) && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="hs-filter-panel__clear"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : null}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((f, i) => (
            <FilterPill key={`${i}-${f.label}`} label={f.label} onRemove={f.clear} />
          ))}
        </div>
      )}

      <div ref={liveRegion} aria-live="polite" aria-atomic="true" className="sr-only">
        {resultSummary}
      </div>

      {filteredSorted.length === 0 ? (
        <div className="hs-surface-card text-center py-16 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          <div className="hs-text-page-title mb-4" style={{ marginBottom: '0.75rem' }} aria-hidden>
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
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                className="rounded-lg px-4 py-2 hs-text-label hs-font-bold text-white transition-colors hover:!bg-[#004B8C]"
                style={{ background: STORE_ACCENT }}
                onClick={clearSearchOnly}
              >
                Clear search
              </button>
              <Link
                href="/apps/condition-catalogue"
                className="inline-flex items-center rounded-lg border px-4 py-2 hs-text-label hs-font-bold transition-colors hover:bg-[#F0F4F5]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                Browse all apps
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))] xl:[grid-template-columns:repeat(auto-fill,minmax(360px,1fr))] 2xl:[grid-template-columns:repeat(auto-fill,minmax(380px,1fr))]"
        >
          {filteredSorted.map((app: App) => {
            const narrative = getProductNarrative(app.slug)
            const cardDescription =
              narrative?.decision_summary?.one_line_proposition ?? app.one_line_value_proposition
            return (
            <div key={app.id} className="app-card flex h-full min-h-0 flex-col">
              <div className="flex min-h-0 flex-1 flex-col" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: '0.75rem' }}>
                  <div className="flex items-center gap-2">
                    {app.logo_path && (
                      <Image src={app.logo_path} alt="" width={32} height={32} className="rounded-md flex-shrink-0" />
                    )}
                    <div>
                      <h3
                        style={{
                          fontFamily: 'Frutiger, Arial, sans-serif',
                          fontWeight: 600,
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

                <p
                  className="line-clamp-5"
                  style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}
                >
                  {cardDescription}
                </p>

                <div className="flex flex-wrap gap-1" style={{ marginBottom: '1rem' }}>
                  {app.condition_tags.map((t: string) => (
                    <ConditionTag key={t} tag={t} />
                  ))}
                  <SupervisionBadge model={app.supervision_model} />
                  <MaturityBadge level={app.maturity_level} hideEstablished />
                </div>

                <div className="mt-auto flex min-w-0 flex-col">
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      href={`/apps/${app.slug}`}
                      className="nhsuk-button mb-0 inline-flex w-full items-center justify-center gap-2 py-4 text-center align-top no-underline hs-text-label hs-font-bold"
                    >
                      View details →
                    </Link>
                    <CompareToggleButton appId={app.id} solid size="none" className="w-full" />
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
