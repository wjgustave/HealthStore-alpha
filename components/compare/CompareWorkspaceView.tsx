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
}

function rowHasDifference(row: CompareRowDef, apps: App[]): boolean {
  if (apps.length < 2) return true
  const values = apps.map(app => getCompareRowTextValue(app, row.key).trim().toLowerCase())
  return new Set(values).size > 1
}

export default function CompareWorkspaceView({ selected, lens, differencesOnly }: Props) {
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

  function toggleGroup(groupId: string) {
    setOpenGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  return (
    <div className="hs-compare-workspace">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {differencesOnly
          ? `Showing rows with differences. ${visibleRowCount} comparison dimensions visible.`
          : `Showing all comparison dimensions. ${visibleRowCount} rows across ${COMPARE_GROUPS.length} groups.`}
      </p>

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
                className="block text-center text-sm font-semibold rounded-lg py-2.5 min-h-[44px] flex items-center justify-center transition-colors hover:!bg-[#004B8C]"
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
