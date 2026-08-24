export type HorizontalBarRow = {
  label: string
  value: number
  displayValue?: string
  color?: string
}

/**
 * Horizontal bars as HTML (not SVG), so labels stay real text at SM sizes.
 * Stacks label / track / value below 640px — same pattern as myCOPD BeforeAfterImpact.
 */
export default function HorizontalBarChart({
  rows,
  maxValue,
  compareRows,
  compareLabel = 'Comparator',
  primaryLabel = 'NHS HealthStore route',
  ariaLabel,
  showRowText = true,
}: {
  rows: HorizontalBarRow[]
  maxValue?: number
  compareRows?: HorizontalBarRow[]
  compareLabel?: string
  primaryLabel?: string
  ariaLabel: string
  /** When false, only the tracks render — use when a title and figure already sit around the bar. */
  showRowText?: boolean
}) {
  const max = maxValue ?? Math.max(...rows.map((r) => r.value), ...(compareRows?.map((r) => r.value) ?? [0]), 1)

  return (
    <div className="hs-hbar">
      {rows.map((row, i) => {
        const compare = compareRows?.[i]
        const widthPct = max > 0 ? Math.min(100, (row.value / max) * 100) : 0
        const comparePct = compare && max > 0 ? Math.min(100, (compare.value / max) * 100) : 0
        const valueText = row.displayValue ?? `${row.value}%`
        return (
          <div key={row.label} className="hs-hbar__group">
            <div className={`hs-hbar__row${showRowText ? '' : ' hs-hbar__row--track-only'}`}>
              {showRowText ? <span className="hs-hbar__label">{row.label}</span> : null}
              <div
                className="hs-hbar__track"
                role="img"
                aria-label={showRowText ? `${row.label} ${valueText}` : ariaLabel}
              >
                <div
                  className="hs-hbar__bar"
                  style={{
                    width: `${widthPct}%`,
                    background: row.color ?? 'var(--nhs-blue)',
                  }}
                />
              </div>
              {showRowText ? (
                <span className="hs-hbar__value">{valueText}</span>
              ) : null}
            </div>
            {compare ? (
              <div className="hs-hbar__row hs-hbar__row--compare">
                <span className="hs-hbar__label">{compare.label}</span>
                <div className="hs-hbar__track">
                  <div
                    className="hs-hbar__bar hs-hbar__bar--compare"
                    style={{
                      width: `${comparePct}%`,
                      background: compare.color ?? '#41b6e6',
                    }}
                  />
                </div>
                <span className="hs-hbar__value">{compare.displayValue ?? `${compare.value}%`}</span>
              </div>
            ) : null}
          </div>
        )
      })}
      {compareRows ? (
        <div className="hs-chart-legend">
          <span>
            <i style={{ background: 'var(--nhs-blue)' }} aria-hidden />
            {primaryLabel}
          </span>
          <span>
            <i style={{ background: '#41b6e6' }} aria-hidden />
            {compareLabel}
          </span>
        </div>
      ) : null}
    </div>
  )
}
