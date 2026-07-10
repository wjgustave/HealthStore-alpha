import type { ReactNode } from 'react'

export type ChartLegendItem = {
  label: ReactNode
  /** Swatch colour — pass an NHS token, e.g. var(--nhs-blue). */
  color: string
}

/**
 * Chart panel shell + legend. [Provenance: Bespoke — no NHS component]
 *
 * NHS frontend ships no data-viz, so this provides the NHS primary non-clickable
 * card chrome (white fill, 1px --border, square corners) for bespoke SVG charts,
 * with a visible legend. Pair the NHS palette (var(--nhs-blue) / --nhs-green /
 * --nhs-grey) for series colours and always provide a text/table fallback inside
 * `children` for accessibility.
 */
export function ChartPanel({
  title,
  legend,
  children,
  className = '',
}: {
  title: ReactNode
  legend?: ChartLegendItem[]
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`hs-chart-panel${className ? ` ${className}` : ''}`}>
      <h3>{title}</h3>
      <div className="hs-chart-wrap">{children}</div>
      {legend && legend.length > 0 ? (
        <div className="hs-chart-legend">
          {legend.map((item, i) => (
            <span key={i}>
              <i style={{ background: item.color }} aria-hidden />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ChartPanel
