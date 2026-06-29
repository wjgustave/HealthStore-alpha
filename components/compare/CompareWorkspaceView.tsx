'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import {
  COMPARE_GROUPS,
  getRowsForGroup,
  groupMatchesLens,
  isDecisionCriticalGroup,
  type CompareGroupDef,
  type CompareLensId,
  type CompareRowDef,
} from '@/lib/compareConfig'
import { getCompareRowTextValue } from '@/lib/compareFieldFormat'
import { renderCompareRow } from '@/components/compare/compareRowRenderers'

type Props = {
  selected: App[]
  lens: CompareLensId
  differencesOnly: boolean
  /** R7 UX-04: turn the "Differences only" filter back off from the empty state. */
  onShowAllRows?: () => void
}

function rowHasDifference(row: CompareRowDef, apps: App[]): boolean {
  if (apps.length < 2) return true
  const values = apps.map(app => getCompareRowTextValue(app, row.key).trim().toLowerCase())
  return new Set(values).size > 1
}

export default function CompareWorkspaceView({ selected, lens, differencesOnly, onShowAllRows }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const g of COMPARE_GROUPS) {
      initial[g.id] = isDecisionCriticalGroup(g.id)
    }
    return initial
  })

  const visibleRowCount = useMemo(() => {
    let count = 0
    for (const group of COMPARE_GROUPS) {
      const rows = getRowsForGroup(group.id).filter(
        row => !differencesOnly || rowHasDifference(row, selected),
      )
      if (openGroups[group.id] !== false) count += rows.length
    }
    return count
  }, [differencesOnly, selected, openGroups])

  // R7 UX-04: total differing rows across all groups (ignoring open/closed) so we can show a
  // real empty state instead of a blank workspace when "Differences only" hides everything.
  const differingRowsTotal = useMemo(() => {
    let count = 0
    for (const group of COMPARE_GROUPS) {
      count += getRowsForGroup(group.id).filter(row => rowHasDifference(row, selected)).length
    }
    return count
  }, [selected])

  const noDifferences = differencesOnly && selected.length >= 2 && differingRowsTotal === 0

  function toggleGroup(groupId: string) {
    setOpenGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  return (
    <div className="hs-compare-workspace">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {noDifferences
          ? 'The selected DTx apps are identical on every comparison dimension. Showing the differences-only filter empty state.'
          : differencesOnly
            ? `Showing rows with differences. ${visibleRowCount} comparison dimensions visible.`
            : `Showing all comparison dimensions. ${visibleRowCount} rows across ${COMPARE_GROUPS.length} groups.`}
      </p>

      {noDifferences ? (
        <div
          className="hs-compare-workspace__empty rounded-xl border bg-white px-6 py-12 text-center"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="mx-auto mb-1 max-w-md hs-font-bold" style={{ color: 'var(--text-primary)' }}>
            No differences to show
          </p>
          <p className="mx-auto mb-6 max-w-md hs-text-label" style={{ color: 'var(--text-muted)' }}>
            The selected DTx apps match on every comparison dimension. Turn off the filter to see the full comparison.
          </p>
          <button
            type="button"
            onClick={onShowAllRows}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border px-6 hs-text-label hs-font-bold transition-colors hover:bg-[#E6F0FB]"
            style={{ borderColor: 'var(--nhs-blue)', color: 'var(--nhs-blue)' }}
          >
            Show all rows
          </button>
        </div>
      ) : (
        <div className="hs-compare-workspace__groups">
          {COMPARE_GROUPS.map(group => (
            <CompareWorkspaceGroup
              key={group.id}
              group={group}
              selected={selected}
              isOpen={openGroups[group.id] ?? isDecisionCriticalGroup(group.id)}
              onToggle={() => toggleGroup(group.id)}
              differencesOnly={differencesOnly}
              emphasized={groupMatchesLens(group.id, lens)}
            />
          ))}
        </div>
      )}

      <div className="hs-compare-summary-row hs-compare-workspace__footer mt-6">
        <div className="hs-compare-summary-row__spacer" aria-hidden="true" />
        <div
          className="hs-compare-workspace__row-cells"
          style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(140px, 1fr))` }}
        >
          {selected.map(app => (
            <div key={app.id} className="hs-compare-workspace__cell">
              <Link
                href={`/apps/${app.slug}`}
                className="block text-center hs-text-label hs-font-bold rounded-lg py-2 min-h-[44px] flex items-center justify-center transition-colors hover:!bg-[#004B8C]"
                style={{ background: STORE_ACCENT, color: '#fff' }}
              >
                View {app.app_name} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CompareWorkspaceGroup({
  group,
  selected,
  isOpen,
  onToggle,
  differencesOnly,
  emphasized,
}: {
  group: CompareGroupDef
  selected: App[]
  isOpen: boolean
  onToggle: () => void
  differencesOnly: boolean
  emphasized: boolean
}) {
  const rows = getRowsForGroup(group.id).filter(
    row => !differencesOnly || rowHasDifference(row, selected),
  )

  if (rows.length === 0) return null

  const panelId = `compare-group-${group.id}`

  return (
    <section
      className={`hs-compare-workspace__group ${emphasized ? 'hs-compare-workspace__group--emphasized' : ''}`}
    >
      <button
        type="button"
        className="hs-compare-workspace__group-toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{group.title}</span>
      </button>
      {isOpen ? (
        <div id={panelId} className="hs-compare-workspace__panel">
          {rows.map(row => (
            <div
              key={row.key}
              className={`hs-compare-workspace__row ${row.decisionCritical ? 'hs-compare-workspace__row--critical' : ''}`}
            >
              <div className="hs-compare-workspace__row-label">
                {row.decisionCritical ? (
                  <span className="hs-compare-row__critical-label">
                    <span className="hs-compare-row__critical-marker" aria-hidden />
                    {row.label}
                  </span>
                ) : (
                  row.label
                )}
              </div>
              <div
                className="hs-compare-workspace__row-cells"
                style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(140px, 1fr))` }}
              >
                {selected.map(app => (
                  <div key={app.id} className="hs-compare-workspace__cell">
                    <span className="sr-only">{app.app_name}: </span>
                    {renderCompareRow(row, app)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
