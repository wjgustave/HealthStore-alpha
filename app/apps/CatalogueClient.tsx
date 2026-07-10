'use client'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { getConditionAreas, supervisionLabels, type App } from '@/lib/data'
import { MaturityBadge, SupervisionBadge, ConditionTag } from '@/components/Badges'
import { CompareToggleButton } from '@/components/CompareToggleButton'
import { X } from 'lucide-react'
import { buildBrowseSearchParams, parseBrowseConditionParam } from '@/lib/catalogueSearch'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { getProductNarrative } from '@/lib/content/productNarratives'

const supervisionOptions = Object.entries(supervisionLabels).map(([id, label]) => ({ id, label }))

const conditionAreas = getConditionAreas()
const conditionOptions = [
  { id: 'all', label: 'All conditions' },
  ...conditionAreas.map(c => ({ id: c.id, label: c.label })),
]
const populatedConditionCount = conditionAreas.filter(c => c.count > 0).length

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
    <span
      className="pill hs-text-caption"
      style={{
        background: '#E6F0FB',
        color: 'var(--nhs-dark)',
        border: '1px solid var(--nhs-dark)',
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-sm p-1 transition-colors hover:bg-[#E6F0FB] hover:opacity-90"
        aria-label={`Remove ${label} filter`}
        style={{ color: 'var(--nhs-dark)' }}
      >
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

  /**
   * Draft filters — edited inside the panel. Applied only when the user clicks
   * Apply, matching GOV.UK's filter-panel submit interaction.
   */
  const [draftCondition, setDraftCondition] = useState('all')
  const [draftSupervision, setDraftSupervision] = useState<string[]>([])

  /** Panel starts collapsed (`aria-expanded=false`), same as GOV.UK. */
  const [filtersOpen, setFiltersOpen] = useState(false)

  const liveRegion = useRef<HTMLDivElement>(null)

  const replaceBrowseUrl = useCallback(
    (nextCondition: string) => {
      const suffix = buildBrowseSearchParams(nextCondition, '')
      router.replace(`/product-catalogue/digital-therapeutics${suffix}`, { scroll: false })
    },
    [router],
  )

  useEffect(() => {
    const c = parseBrowseConditionParam(searchParams.get('condition'))
    setCondition(c)
    setDraftCondition(c)
  }, [searchParams])

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
    setCondition(draftCondition)
    setSupervision(draftSupervision)
    replaceBrowseUrl(draftCondition)
    setFiltersOpen(false)
  }

  const clearAllFilters = () => {
    setSupervision([])
    setDraftSupervision([])
    setCondition('all')
    setDraftCondition('all')
    router.replace('/product-catalogue/digital-therapeutics', { scroll: false })
  }

  const activeFilters: { label: string; clear: () => void }[] = []
  if (condition !== 'all') {
    activeFilters.push({
      label: conditionOptions.find(o => o.id === condition)!.label,
      clear: () => {
        setCondition('all')
        setDraftCondition('all')
        replaceBrowseUrl('all')
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

  const filteredSorted = useMemo(() => {
    return apps
      .filter((app: App) => {
        if (supervision.length > 0 && !supervision.includes(app.supervision_model)) return false
        if (condition !== 'all' && !app.condition_tags.includes(condition)) return false
        return true
      })
      .sort((a, b) => a.app_name.localeCompare(b.app_name))
  }, [apps, supervision, condition])

  const resultCount = filteredSorted.length
  const resultText = `${resultCount.toLocaleString()} ${resultCount === 1 ? 'result' : 'results'}`
  const resultSummary = `Showing ${resultCount} of ${apps.length} apps`

  return (
    <div className="hs-page">
      <PageBreadcrumb
        items={[
          { label: 'Product catalogue', href: '/product-catalogue' },
          { label: 'Digital therapeutics' },
        ]}
      />

      <div className="mb-8">
        <h1 className="page-title-h1">
          Digital therapeutics
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
          {apps.length} apps across {populatedConditionCount} conditions and pathways · Last reviewed March 2026
        </p>
      </div>

      <div className="hs-catalogue-layout">
      <div className="hs-catalogue-layout__main">
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
                          id={`filter-condition-${o.id}`}
                          className="nhsuk-radios__input"
                          name="filter-condition"
                          type="radio"
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
                          id={`filter-supervision-${o.id}`}
                          className="nhsuk-checkboxes__input"
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
                <button type="submit" className="nhsuk-button mb-0">
                  Apply filters
                </button>
                {(draftCondition !== 'all' || draftSupervision.length > 0) && (
                  <button
                    type="button"
                    className="hs-filter-panel__clear"
                    onClick={clearAllFilters}
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
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            No apps match your filters
          </div>
          <div style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
            Try adjusting your filter criteria
          </div>
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
                      View product details
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

      {/* Related content — GOV.UK related-navigation pattern (gov.uk/personal-tax-account). */}
      <aside className="hs-related-nav" aria-labelledby="related-content-heading">
        <h2 id="related-content-heading" className="hs-related-nav__heading">
          Related content
        </h2>
        <ul className="hs-related-nav__list">
          <li>
            <Link href="/compare">Comparison tool</Link>
          </li>
          <li>
            <Link href="/funding-index">Funding index</Link>
          </li>
          <li>
            <Link href="/resources/guidance">Guidance</Link>
          </li>
          <li>
            <Link href="/how-it-helps">How it works</Link>
          </li>
          <li>
            <Link href="/resources">Resource library</Link>
          </li>
        </ul>
      </aside>
      </div>
    </div>
  )
}
