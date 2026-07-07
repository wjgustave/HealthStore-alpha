'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { usePdpSharePrintOptional } from '@/components/PdpSharePrintContext'
import { liveSiteContactEmailShort } from '@/lib/liveSiteContact'
import { statusMeta, summarizeDeployments, type DeploymentRow } from '@/lib/deploymentRegister'

function StatusBadge({ status }: { status: string | undefined }) {
  const meta = statusMeta(status)
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-1 hs-text-caption hs-font-bold leading-tight"
      style={{ color: meta.fg, background: meta.bg, borderColor: meta.border }}
    >
      {meta.label}
    </span>
  )
}

function dash(v?: string) {
  return v && v.trim() ? v : '—'
}

function DeploymentStat({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div className="hs-deploy-stat" style={{ ['--deploy-accent' as string]: accent }}>
      <span className="hs-deploy-stat__value">{value}</span>
      <span className="hs-deploy-stat__label">{label}</span>
    </div>
  )
}

function DetailContent({ row, index }: { row: DeploymentRow; index: number }) {
  const email = liveSiteContactEmailShort(row.site, index)
  return (
    <>
      {row.notes ? <p className="m-0 mb-4">{row.notes}</p> : null}
      {row.delivery ? (
        <p className="m-0 mb-4">
          <strong className="hs-font-bold text-[var(--text-primary)]">How it&apos;s delivered: </strong>
          {row.delivery}
        </p>
      ) : null}
      <p className="m-0">
        <strong className="hs-font-bold text-[var(--text-primary)]">Contact: </strong>
        <a href={`mailto:${email}`} className="hs-font-normal underline" style={{ color: 'var(--nhs-blue)' }}>
          {email}
        </a>
      </p>
    </>
  )
}

/**
 * "Where it's live" deployment register table.
 * See docs/PDP_WHERE_ITS_LIVE_REDESIGN.md.
 */
export function DeploymentRegisterTable({ rows }: { rows: DeploymentRow[] }) {
  const ctx = usePdpSharePrintOptional()
  const printing = (ctx?.printLayout.mode ?? 'none') !== 'none'

  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())

  const summary = useMemo(() => summarizeDeployments(rows), [rows])

  if (rows.length === 0) {
    return (
      <p className="hs-text-label" style={{ color: 'var(--text-muted)' }}>
        No named NHS deployments are recorded for this product in catalogue sources.
      </p>
    )
  }

  function toggle(i: number) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div>
      <div className="hs-deploy-stats" role="list" aria-label="Deployment summary">
        <DeploymentStat value={summary.liveCount} label={summary.liveCount === 1 ? 'Live site' : 'Live sites'} accent="#00582A" />
        {summary.icbCount > 0 ? (
          <DeploymentStat value={summary.icbCount} label={summary.icbCount === 1 ? 'ICB area' : 'ICB areas'} accent="var(--nhs-blue)" />
        ) : null}
        {summary.pilotCount > 0 ? (
          <DeploymentStat value={summary.pilotCount} label={summary.pilotCount === 1 ? 'Pilot' : 'Pilots'} accent="#003B7A" />
        ) : null}
        {summary.researchCount > 0 ? (
          <DeploymentStat value={summary.researchCount} label="Research" accent="#3A1D7A" />
        ) : null}
        {summary.historicCount > 0 ? (
          <DeploymentStat value={summary.historicCount} label="Historic" accent="#7A1210" />
        ) : null}
      </div>

      {/* [Provenance: NHS] Official NHS Table. Expandable detail rows are bespoke. */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="nhsuk-table">
          <caption className="nhsuk-table__caption nhsuk-u-visually-hidden">
            Where this product is deployed across NHS England, by site, ICB, care setting and status.
          </caption>
          <thead className="nhsuk-table__head">
            <tr className="nhsuk-table__row">
              <th scope="col" className="nhsuk-table__header">Site / service</th>
              <th scope="col" className="nhsuk-table__header">ICB / place</th>
              <th scope="col" className="nhsuk-table__header">Care setting</th>
              <th scope="col" className="nhsuk-table__header">Status</th>
              <th scope="col" className="nhsuk-table__header print:hidden">
                <span className="nhsuk-u-visually-hidden">Details</span>
              </th>
            </tr>
          </thead>
          <tbody className="nhsuk-table__body">
            {rows.map((r, i) => {
              const open = printing || expanded.has(i)
              return (
                <RowGroup
                  key={i}
                  index={i}
                  row={r}
                  open={open}
                  printing={printing}
                  onToggle={toggle}
                />
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-4 sm:hidden">
        {rows.map((r, i) => {
          const open = printing || expanded.has(i)
          const meta = statusMeta(r.status)
          return (
            <li
              key={i}
              className="border p-4"
              style={{ borderColor: 'var(--border)', borderLeft: `4px solid ${meta.fg}`, background: '#fff' }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="hs-font-bold" style={{ color: 'var(--text-primary)' }}>{r.site}</div>
                  {r.condition ? (
                    <div className="hs-text-caption" style={{ color: 'var(--text-muted)' }}>{r.condition}</div>
                  ) : null}
                </div>
                <StatusBadge status={r.status} />
              </div>
              <dl className="space-y-1 hs-text-caption" style={{ color: 'var(--text-secondary)' }}>
                <div>
                  <dt className="inline hs-font-bold" style={{ color: 'var(--text-muted)' }}>ICB / place: </dt>
                  <dd className="inline">
                    {dash(r.icb)}
                    {r.location ? ` — ${r.location}` : ''}
                  </dd>
                </div>
                <div>
                  <dt className="inline hs-font-bold" style={{ color: 'var(--text-muted)' }}>Care setting: </dt>
                  <dd className="inline">{dash(r.care_setting)}</dd>
                </div>
              </dl>
              {!printing ? (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggle(i)}
                  className="mt-4 flex items-center gap-1 hs-text-caption hs-font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD800]"
                  style={{ color: 'var(--nhs-blue)' }}
                >
                  {open ? 'Less' : 'More'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                </button>
              ) : null}
              {open ? (
                <div className="mt-4 rounded-lg p-4 hs-text-label leading-relaxed" style={{ background: '#fff', color: 'var(--text-secondary)' }}>
                  <DetailContent row={r} index={i} />
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function RowGroup({
  index,
  row,
  open,
  printing,
  onToggle,
}: {
  index: number
  row: DeploymentRow
  open: boolean
  printing: boolean
  onToggle: (i: number) => void
}) {
  const detailId = `deployment-detail-${index}`
  return (
    <>
      <tr className="nhsuk-table__row hs-deploy-row align-top">
        <td className="nhsuk-table__cell">
          <div className="hs-font-normal" style={{ color: 'var(--text-primary)' }}>{row.site}</div>
          {row.condition ? (
            <div className="hs-text-caption" style={{ color: 'var(--text-muted)' }}>{row.condition}</div>
          ) : null}
        </td>
        <td className="nhsuk-table__cell" style={{ color: 'var(--text-secondary)' }}>
          <div>{dash(row.icb)}</div>
          {row.location ? (
            <div className="hs-text-caption" style={{ color: 'var(--text-muted)' }}>{row.location}</div>
          ) : null}
        </td>
        <td className="nhsuk-table__cell" style={{ color: 'var(--text-secondary)' }}>
          {dash(row.care_setting)}
        </td>
        <td className="nhsuk-table__cell">
          <StatusBadge status={row.status} />
        </td>
        <td className="nhsuk-table__cell print:hidden">
          {!printing ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailId}
              onClick={() => onToggle(index)}
              className="flex items-center gap-1 rounded p-1 hs-text-caption hs-font-normal hover:bg-[#F0F4F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD800]"
              style={{ color: 'var(--nhs-blue)' }}
            >
              {open ? 'Less' : 'More'}
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
          ) : null}
        </td>
      </tr>
      {open ? (
        <tr id={detailId} className="nhsuk-table__row">
          <td colSpan={5} className="nhsuk-table__cell px-4 pb-4 pt-0">
            <div
              className="rounded-lg p-4 hs-text-label leading-relaxed"
              style={{ background: '#F0F4F5', color: 'var(--text-secondary)' }}
            >
              <DetailContent row={row} index={index} />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}
