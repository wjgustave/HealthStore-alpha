'use client'

import type { ReactNode } from 'react'

export type SegmentedOption<T extends string> = {
  value: T
  label: ReactNode
}

/**
 * Segmented view toggle. [Provenance: Bespoke — no NHS component]
 *
 * NHS frontend has no segmented control. Inferred from NHS tokens: a flat bordered
 * button group with an NHS-blue tinted active segment. Exposed as a `group` of
 * `aria-pressed` buttons so screen readers announce the active view. Each button
 * holds the NHS focus ring and a 44px-friendly hit area.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = '',
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  className?: string
}) {
  return (
    <div className={`hs-view-toggle${className ? ` ${className}` : ''}`} role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? 'active' : undefined}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentedToggle
