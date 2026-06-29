'use client'

import { COMPARE_LENSES, type CompareLensId } from '@/lib/compareConfig'

type Props = {
  value: CompareLensId
  onChange: (lens: CompareLensId) => void
}

export default function CompareLensControl({ value, onChange }: Props) {
  return (
    <fieldset className="hs-compare-lens">
      <legend className="hs-compare-lens__legend">Task lens</legend>
      <div className="hs-compare-lens__options" role="radiogroup" aria-label="Task lens">
        {COMPARE_LENSES.map(lens => {
          const isActive = value === lens.id
          return (
            <label key={lens.id} className="hs-compare-lens__option" data-active={isActive ? 'true' : undefined}>
              <input
                type="radio"
                name="compare-lens"
                value={lens.id}
                checked={isActive}
                onChange={() => onChange(lens.id)}
                className="sr-only"
              />
              {lens.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
