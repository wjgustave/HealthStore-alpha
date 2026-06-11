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
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold leading-tight"
      style={{ color: meta.fg, background: meta.bg, borderColor: meta.border }}
    >
      {meta.label}
    </span>
  )
}

function dash(v?: string) {
  return v && v.trim() ? v : '—'
}

function DetailContent({ row, index }: { row: DeploymentRow; index: number }) {
  const email = liveSiteContactEmailShort(row.site, index)
  return (
    <>
      {row.notes ? <p className="m-0 mb-3">{row.notes}</p> : null}
      {row.delivery ? (
        <p className="m-0 mb-3">
          <strong className="font-semibold text-[var(--text-primary)]">How it&apos;s delivered: </strong>
          {row.delivery}
        </p>
      ) : null}
      <p className="m-0">
        <strong className="font-semibold text-[var(--text-primary)]">Contact: </strong>
        <a href={`mailto:${email}`} className="font-medium underline" style={{ color: '#005EB8' }}>
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
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        No named NHS deployments are recorded for this product in catalogue sources.
      </p>
    )
  }

  const summaryParts: string[] = []
  summaryParts.push(`Live at ${summary.liveCount} ${summary.liveCount === 1 ? 'site' : 'sites'}`)
  if (summary.icbCount > 0) {
    summaryParts.push(`across ${summary.icbCount} ${summary.icbCount === 1 ? 'ICB' : 'ICBs'}`)
  }
  const extras: string[] = []
  if (summary.pilotCount) extras.push(`${summary.pilotCount} pilot`)
  if (summary.researchCount) extras.push(`${summary.researchCount} research`)
  if (summary.historicCount) extras.push(`${summary.historicCount} historic`)

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
      <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {summaryParts.join(' ')}
        </span>
        {extras.length > 0 ? (
          <span style={{ color: 'var(--text-muted)' }}>{` · ${extras.join(' · ')}`}</span>
        ) : null}
      </p>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Where this product is deployed across NHS England, by site, ICB, care setting and status.
          </caption>
          <thead>
            <tr className="border-b text-left" style={{ borderColor: 'var(--border)' }}>
              <th scope="col" className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Site / service
              </th>
              <th scope="col" className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                ICB / place
              </th>
              <th scope="col" className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Care setting
              </th>
              <th scope="col" className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Status
              </th>
              <th scope="col" className="py-2 text-xs font-semibold uppercase tracking-wide print:hidden" style={{ color: 'var(--text-muted)' }}>
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
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

      <ul className="space-y-3 sm:hidden">
        {rows.map((r, i) => {
          const open = printing || expanded.has(i)
          return (
            <li key={i} className="rounded-lg border p-3" style={{ borderColor: 'var(--border)', background: '#F7F9FC' }}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.site}</div>
                  {r.condition ? (
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.condition}</div>
                  ) : null}
                </div>
                <StatusBadge status={r.status} />
              </div>
              <dl className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div>
                  <dt className="inline font-medium" style={{ color: 'var(--text-muted)' }}>ICB / place: </dt>
                  <dd className="inline">
                    {dash(r.icb)}
                    {r.location ? ` — ${r.location}` : ''}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium" style={{ color: 'var(--text-muted)' }}>Care setting: </dt>
                  <dd className="inline">{dash(r.care_setting)}</dd>
                </div>
              </dl>
              {!printing ? (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggle(i)}
                  className="mt-3 flex items-center gap-1 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD800]"
                  style={{ color: '#005EB8' }}
                >
                  {open ? 'Less' : 'More'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                </button>
              ) : null}
              {open ? (
                <div className="mt-3 rounded-lg p-3 text-sm leading-relaxed" style={{ background: '#fff', color: 'var(--text-secondary)' }}>
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
      <tr className="border-b align-top" style={{ borderColor: 'var(--border)' }}>
        <td className="py-2.5 pr-3">
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{row.site}</div>
          {row.condition ? (
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.condition}</div>
          ) : null}
        </td>
        <td className="py-2.5 pr-3" style={{ color: 'var(--text-secondary)' }}>
          <div>{dash(row.icb)}</div>
          {row.location ? (
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.location}</div>
          ) : null}
        </td>
        <td className="py-2.5 pr-3" style={{ color: 'var(--text-secondary)' }}>
          {dash(row.care_setting)}
        </td>
        <td className="py-2.5 pr-3">
          <StatusBadge status={row.status} />
        </td>
        <td className="py-2.5 print:hidden">
          {!printing ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailId}
              onClick={() => onToggle(index)}
              className="flex items-center gap-1 rounded p-1 text-xs font-medium hover:bg-[#F7F9FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD800]"
              style={{ color: '#005EB8' }}
            >
              {open ? 'Less' : 'More'}
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
          ) : null}
        </td>
      </tr>
      {open ? (
        <tr id={detailId} className="border-b" style={{ borderColor: 'var(--border)' }}>
          <td colSpan={5} className="px-3 pb-3 pt-0">
            <div
              className="rounded-lg p-3 text-sm leading-relaxed"
              style={{ background: '#F7F9FC', color: 'var(--text-secondary)' }}
            >
              <DetailContent row={row} index={index} />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}
