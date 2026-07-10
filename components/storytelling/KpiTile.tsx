import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * KPI / stat tile. [Provenance: Bespoke — no NHS component]
 *
 * NHS frontend ships no metric/KPI component, so this is inferred from the NHS
 * card language: a flat white surface, square 4px corners and a 4px NHS-blue top
 * keyline. Metric values use primary text colour. Optionally a link.
 */
export function KpiTile({
  value,
  label,
  sub,
  href,
  className = '',
}: {
  value: ReactNode
  label: ReactNode
  sub?: ReactNode
  href?: string
  className?: string
}) {
  const body = (
    <>
      <div className="hs-kpi-value">{value}</div>
      <div className="hs-kpi-label">{label}</div>
      {sub ? <div className="hs-kpi-sub">{sub}</div> : null}
    </>
  )
  const classes = `hs-kpi${href ? ' transition-colors hover:border-[var(--nhs-blue)]' : ''}${className ? ` ${className}` : ''}`
  return href ? (
    <Link href={href} className={`block no-underline ${classes}`}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  )
}

export default KpiTile
