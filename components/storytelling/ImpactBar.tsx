/**
 * Horizontal impact bar. [Provenance: Bespoke — no NHS component]
 *
 * NHS frontend has no chart/progress component. Inferred from NHS tokens: a flat
 * NHS grey-5 track with an NHS-blue (or green) fill at 4px radius, not a pill.
 * The numeric value is shown alongside and also exposed to assistive tech via the
 * `role="img"` label so the bar is never information-only.
 */
export function ImpactBar({
  label,
  percent,
  value,
  variant = 'blue',
  className = '',
}: {
  label: string
  /** Fill width, 0-100. */
  percent: number
  /** Display value (e.g. "−32%", "1,240"). Defaults to the percent. */
  value?: string
  variant?: 'blue' | 'green'
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, percent))
  const display = value ?? `${Math.round(clamped)}%`
  return (
    <div
      className={`hs-impact-bar${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={`${label}: ${display}`}
    >
      <span className="hs-impact-bar-label" aria-hidden>
        {label}
      </span>
      <span className="hs-impact-bar-track" aria-hidden>
        <span
          className={`hs-impact-bar-fill${variant === 'green' ? ' hs-impact-bar-fill-green' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </span>
      <span className="hs-impact-bar-value" aria-hidden>
        {display}
      </span>
    </div>
  )
}

export default ImpactBar
