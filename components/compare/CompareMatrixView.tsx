'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import {
  COMPARE_GROUPS,
  getRowsForGroup,
  type CompareRowDef,
} from '@/lib/compareConfig'
import { CompareDecisionSnapshot } from '@/components/compare/CompareDecisionSnapshot'
import { renderCompareRow } from '@/components/compare/compareRowRenderers'

type Props = {
  selected: App[]
}

export default function CompareMatrixView({ selected }: Props) {
  let rowIndex = 0

  return (
    <div className="hs-compare-matrix">
      <div className="hs-compare-matrix__snapshot-wrap">
        <CompareDecisionSnapshot apps={selected} layout="band" />
      </div>

      <div className="hs-surface-card overflow-x-auto rounded-xl border bg-white shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full border-collapse min-w-[720px]" style={{ fontSize: 'var(--text-body)' }}>
          <caption className="sr-only">
            {selected.length === 1
              ? 'Application details by comparison dimension.'
              : 'Comparison of selected apps by dimension; each column is one product.'}
          </caption>
          <thead className="sticky top-0 z-[3] bg-white shadow-[0_1px_0_0_var(--border)]">
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th
                scope="col"
                className="sticky left-0 z-[4] p-3 text-left align-bottom font-semibold uppercase tracking-wide border-r bg-white"
                style={{ fontSize: 'var(--text-label)', borderColor: 'var(--border)', color: 'var(--text-muted)', minWidth: 160 }}
              >
                Comparison
              </th>
              {selected.map(app => (
                <th
                  key={app.id}
                  scope="col"
                  className="p-3 text-left align-bottom border-l bg-white"
                  style={{ borderColor: 'var(--border)', minWidth: 180 }}
                >
                  <span className="font-bold block" style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}>
                    {app.app_name}
                  </span>
                  <span className="text-xs font-normal block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {app.supplier_name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_GROUPS.map(group => {
              const rows = getRowsForGroup(group.id)
              return (
                <Fragment key={group.id}>
                  <tr>
                    <td
                      colSpan={1 + selected.length}
                      className="p-3 font-semibold border-t border-b"
                      style={{
                        background: '#E8EDF3',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-label)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {group.title}
                    </td>
                  </tr>
                  {rows.map(row => {
                    const bg = rowIndex % 2 === 0 ? '#fff' : '#FAFBFC'
                    rowIndex += 1
                    return (
                      <CompareMatrixRow
                        key={row.key}
                        row={row}
                        selected={selected}
                        bg={bg}
                      />
                    )
                  })}
                </Fragment>
              )
            })}
            <tr>
              <td
                className="sticky left-0 z-[1] p-4 border-t bg-[#F7F9FC]"
                style={{ borderColor: 'var(--border)', boxShadow: '2px 0 0 0 var(--border)' }}
              />
              {selected.map(app => (
                <td key={app.id} className="p-4 border-t bg-[#F7F9FC]" style={{ borderColor: 'var(--border)' }}>
                  <Link
                    href={`/apps/${app.slug}`}
                    className="block text-center text-sm font-semibold rounded-lg py-2.5 min-h-[44px] flex items-center justify-center transition-colors hover:!bg-[#004B8C]"
                    style={{ background: STORE_ACCENT, color: '#fff' }}
                  >
                    View details →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CompareMatrixRow({
  row,
  selected,
  bg,
}: {
  row: CompareRowDef
  selected: App[]
  bg: string
}) {
  const critical = row.decisionCritical === true

  return (
    <tr className={critical ? 'hs-compare-row--critical' : undefined}>
      <th
        scope="row"
        className="sticky left-0 z-[1] p-4 border-b border-r font-medium uppercase tracking-wide text-left align-top"
        style={{
          fontSize: 'var(--text-label)',
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
          background: bg,
          boxShadow: '2px 0 0 0 var(--border)',
        }}
      >
        {critical ? (
          <span className="hs-compare-row__critical-label">
            <span className="hs-compare-row__critical-marker" aria-hidden />
            {row.label}
          </span>
        ) : (
          row.label
        )}
      </th>
      {selected.map(app => (
        <td key={app.id} className="p-4 border-b align-top" style={{ borderColor: 'var(--border)', background: bg }}>
          {renderCompareRow(row, app)}
        </td>
      ))}
    </tr>
  )
}
