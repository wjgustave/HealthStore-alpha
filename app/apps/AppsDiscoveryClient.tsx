'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutGrid, Search } from 'lucide-react'
import { ConditionIcon } from '@/components/HealthIcons'
import type { App } from '@/lib/data'
import { createCatalogueFuseForApps } from '@/lib/catalogueSearch'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

type ConditionArea = { id: string; label: string; colour: string; count: number; icon: string }

export default function AppsDiscoveryClient({
  conditionAreas,
  apps,
  totalAppCount,
}: {
  conditionAreas: ConditionArea[]
  apps: App[]
  totalAppCount: number
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [openSuggestions, setOpenSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const fuse = useMemo(() => createCatalogueFuseForApps(apps), [apps])

  const suggestions = useMemo(() => {
    const t = query.trim()
    if (t.length < 2) return []
    return fuse.search(t).slice(0, 8).map(r => r.item)
  }, [fuse, query])

  const goToBrowse = useCallback(
    (q: string) => {
      const p = new URLSearchParams()
      const qt = q.trim()
      if (qt) p.set('q', qt)
      const s = p.toString()
      router.push(s ? `/apps/condition-catalogue?${s}` : '/apps/condition-catalogue')
      setOpenSuggestions(false)
      setActiveIndex(-1)
    },
    [router],
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    goToBrowse(query)
  }

  useEffect(() => {
    if (!openSuggestions) setActiveIndex(-1)
  }, [openSuggestions])

  return (
    <div>
      <PageBreadcrumb items={[{ label: 'Find apps' }]} />
      <div style={{ marginBottom: 40, maxWidth: 720 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px' }}>Find apps</h1>
        <p style={{ color: '#4c6272', margin: 0, lineHeight: 1.6 }}>
          Search by app name, supplier, or condition. Or use the condition catalogue to find relevant digital therapeutics.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mb-10 max-w-2xl" role="search" aria-label="Search catalogue">
        <label htmlFor="apps-hub-search" className="sr-only">
          Search by app name, supplier, or condition
        </label>
        <div className="relative">
          <div
            className="flex items-stretch rounded-xl border bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-offset-2"
            style={{ borderColor: 'var(--border)', outlineColor: 'var(--nhs-blue)' }}
          >
            <span className="flex items-center pl-4" style={{ color: 'var(--text-muted)' }} aria-hidden>
              <Search className="w-5 h-5 shrink-0" strokeWidth={2} />
            </span>
            <input
              ref={inputRef}
              id="apps-hub-search"
              type="search"
              autoComplete="off"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setOpenSuggestions(true)
                setActiveIndex(-1)
              }}
              onFocus={() => setOpenSuggestions(true)}
              onBlur={() => {
                window.setTimeout(() => setOpenSuggestions(false), 180)
              }}
              onKeyDown={e => {
                if (!openSuggestions || suggestions.length === 0) {
                  if (e.key === 'Enter') goToBrowse(query)
                  return
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveIndex(i => (i + 1) % suggestions.length)
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1))
                } else if (e.key === 'Escape') {
                  setOpenSuggestions(false)
                } else if (e.key === 'Enter' && activeIndex >= 0) {
                  e.preventDefault()
                  const item = suggestions[activeIndex]
                  goToBrowse(item.app_name)
                }
              }}
              placeholder="Search by app name, supplier, or condition"
              className="min-h-[52px] flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              aria-autocomplete="list"
              aria-controls={suggestions.length > 0 ? listId : undefined}
              aria-expanded={openSuggestions && suggestions.length > 0}
            />
            <button
              type="submit"
              className="hs-btn hs-btn-primary"
              style={{ borderRadius: 0, padding: '12px 20px' }}
            >
              Search
            </button>
          </div>
          {openSuggestions && suggestions.length > 0 ? (
            <ul
              id={listId}
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-xl border bg-white py-1 shadow-lg"
              style={{ borderColor: 'var(--border)' }}
            >
              {suggestions.map((item, idx) => (
                <li key={item.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={idx === activeIndex}
                    className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#F7F9FC]"
                    style={{
                      background: idx === activeIndex ? '#E6F0FB' : undefined,
                      color: 'var(--text-primary)',
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => goToBrowse(item.app_name)}
                  >
                    <span className="font-semibold">{item.app_name}</span>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>{item.supplier_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </form>

      <section aria-labelledby="condition-catalogue-heading" style={{ marginTop: 40 }}>
        <h2
          id="condition-catalogue-heading"
          style={{ fontSize: '1.3rem', fontWeight: 700, color: '#212b32', marginBottom: 16 }}
        >
          Condition catalogue
        </h2>
        <div className="hs-card-grid">
          {conditionAreas.map(c => (
            <Link
              key={c.id}
              href={`/apps/condition-catalogue?condition=${encodeURIComponent(c.id)}`}
              className="hs-card"
              style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${c.colour}18`, color: c.colour }}
              >
                <ConditionIcon condition={c.id} className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold" style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginTop: 4 }}>
                  {c.count} {c.count === 1 ? 'app' : 'apps'}
                </div>
                <span className="mt-2 inline-block text-sm font-semibold text-[var(--nhs-blue)] group-hover:underline">View apps</span>
              </div>
            </Link>
          ))}

          <Link
            href="/apps/condition-catalogue"
            className="hs-card"
            style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(0, 94, 184, 0.1)', color: 'var(--nhs-blue)' }}
              aria-hidden
            >
              <LayoutGrid className="h-7 w-7" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold" style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                All apps
              </div>
              <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginTop: 4 }}>
                {totalAppCount} digital therapeutics in the catalogue
              </div>
              <span className="mt-2 inline-block text-sm font-semibold text-[var(--nhs-blue)] group-hover:underline">Browse entire catalogue</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
