export type BeforeAfterVariant = 'paired' | 'cut' | 'delta' | 'tiles'

export type BeforeAfterImpactProps = {
  variant: BeforeAfterVariant
  title: string
  todayLabel: string
  todayValue: number
  withLabel: string
  withValue: number
  delta: number
  deltaLabel: string
}

function fmt(n: number): string {
  return n.toLocaleString()
}

function DeltaTagline({ delta, deltaLabel }: { delta: number; deltaLabel: string }) {
  return (
    <p className="hs-before-after__delta">
      ≈ {fmt(delta)} {deltaLabel}
    </p>
  )
}

/** A — Paired horizontal bars: Today (muted) vs With myCOPD (NHS blue). */
function PairedBars({
  todayLabel,
  todayValue,
  withLabel,
  withValue,
  delta,
  deltaLabel,
}: Omit<BeforeAfterImpactProps, 'variant' | 'title'>) {
  const max = Math.max(todayValue, withValue, 1)
  return (
    <div className="hs-before-after hs-before-after--paired">
      <div className="hs-before-after__row">
        <span className="hs-before-after__row-label">{todayLabel}</span>
        <div className="hs-before-after__track">
          <div
            className="hs-before-after__bar hs-before-after__bar--today"
            style={{ width: `${(todayValue / max) * 100}%` }}
          />
        </div>
        <span className="hs-before-after__row-value">{fmt(todayValue)}</span>
      </div>
      <div className="hs-before-after__row">
        <span className="hs-before-after__row-label">{withLabel}</span>
        <div className="hs-before-after__track">
          <div
            className="hs-before-after__bar hs-before-after__bar--with"
            style={{ width: `${(withValue / max) * 100}%` }}
          />
        </div>
        <span className="hs-before-after__row-value">{fmt(withValue)}</span>
      </div>
      <DeltaTagline delta={delta} deltaLabel={deltaLabel} />
    </div>
  )
}

/** B — Single baseline track with reduction cut highlighted. */
function CutBar({
  todayValue,
  withLabel,
  withValue,
  delta,
  deltaLabel,
}: Omit<BeforeAfterImpactProps, 'variant' | 'title' | 'todayLabel'>) {
  const remainingPct = todayValue > 0 ? (withValue / todayValue) * 100 : 0
  const cutPct = todayValue > 0 ? (delta / todayValue) * 100 : 0
  return (
    <div className="hs-before-after hs-before-after--cut">
      <div className="hs-before-after__cut-meta">
        <span>
          Today <strong>{fmt(todayValue)}</strong>
        </span>
        <span>
          {withLabel} <strong>{fmt(withValue)}</strong>
        </span>
      </div>
      <div
        className="hs-before-after__cut-track"
        role="img"
        aria-label={`Today ${fmt(todayValue)}, ${withLabel.toLowerCase()} ${fmt(withValue)}, ${fmt(delta)} avoided`}
      >
        <div className="hs-before-after__cut-remaining" style={{ width: `${remainingPct}%` }} />
        <div className="hs-before-after__cut-avoided" style={{ width: `${cutPct}%` }} />
      </div>
      <div className="hs-before-after__cut-legend">
        <span>
          <i className="hs-before-after__swatch hs-before-after__swatch--with" aria-hidden /> Remaining
        </span>
        <span>
          <i className="hs-before-after__swatch hs-before-after__swatch--avoided" aria-hidden /> Avoided
        </span>
      </div>
      <DeltaTagline delta={delta} deltaLabel={deltaLabel} />
    </div>
  )
}

/** C — Delta-first KPI with compact mini comparison. */
function DeltaFirst({
  todayLabel,
  todayValue,
  withLabel,
  withValue,
  delta,
  deltaLabel,
}: Omit<BeforeAfterImpactProps, 'variant' | 'title'>) {
  const max = Math.max(todayValue, withValue, 1)
  return (
    <div className="hs-before-after hs-before-after--delta">
      <div className="hs-before-after__hero">
        <div className="hs-before-after__hero-value">≈ {fmt(delta)}</div>
        <div className="hs-before-after__hero-label">{deltaLabel}</div>
      </div>
      <div className="hs-before-after__mini">
        <div className="hs-before-after__mini-row">
          <span>{todayLabel}</span>
          <div className="hs-before-after__mini-track">
            <div
              className="hs-before-after__bar hs-before-after__bar--today"
              style={{ width: `${(todayValue / max) * 100}%` }}
            />
          </div>
          <strong>{fmt(todayValue)}</strong>
        </div>
        <div className="hs-before-after__mini-row">
          <span>{withLabel}</span>
          <div className="hs-before-after__mini-track">
            <div
              className="hs-before-after__bar hs-before-after__bar--with"
              style={{ width: `${(withValue / max) * 100}%` }}
            />
          </div>
          <strong>{fmt(withValue)}</strong>
        </div>
      </div>
    </div>
  )
}

/** D — Side-by-side volume tiles with connector. */
function VolumeTiles({
  todayLabel,
  todayValue,
  withLabel,
  withValue,
  delta,
  deltaLabel,
}: Omit<BeforeAfterImpactProps, 'variant' | 'title'>) {
  return (
    <div className="hs-before-after hs-before-after--tiles">
      <div className="hs-before-after__tiles-row">
        <div className="hs-before-after__tile">
          <div className="hs-before-after__tile-label">{todayLabel}</div>
          <div className="hs-before-after__tile-value">{fmt(todayValue)}</div>
        </div>
        <div className="hs-before-after__connector" aria-hidden>
          →
        </div>
        <div className="hs-before-after__tile hs-before-after__tile--with">
          <div className="hs-before-after__tile-label">{withLabel}</div>
          <div className="hs-before-after__tile-value">{fmt(withValue)}</div>
        </div>
      </div>
      <DeltaTagline delta={delta} deltaLabel={deltaLabel} />
    </div>
  )
}

/**
 * Before/after impact visualisation. [Provenance: Bespoke — no NHS component]
 *
 * Four temporary variants for myCOPD dual-metric charts so stakeholders can
 * compare treatments. Uses NHS primary non-clickable card chrome via parent
 * `.hs-chart-panel` and NHS colour tokens only.
 */
export default function BeforeAfterImpact(props: BeforeAfterImpactProps) {
  const { variant, title, ...rest } = props
  return (
    <div className="hs-chart-panel">
      <h3>{title}</h3>
      {variant === 'paired' && <PairedBars {...rest} />}
      {variant === 'cut' && <CutBar {...rest} />}
      {variant === 'delta' && <DeltaFirst {...rest} />}
      {variant === 'tiles' && <VolumeTiles {...rest} />}
    </div>
  )
}
