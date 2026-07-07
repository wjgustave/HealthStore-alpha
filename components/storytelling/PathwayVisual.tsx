import type { ReactNode } from 'react'

export type PathwayStep = {
  label: ReactNode
  /** Semantic accent: problem (red), added (green), changed (blue), or default. */
  kind?: 'problem' | 'added' | 'changed' | 'default'
}

const KIND_CLASS: Record<NonNullable<PathwayStep['kind']>, string> = {
  problem: 'hs-pathway-problem',
  added: 'hs-pathway-added',
  changed: 'hs-pathway-changed',
  default: '',
}

/**
 * Current-vs-future pathway visual. [Provenance: Bespoke — no NHS component]
 *
 * Inferred from NHS tokens: two flat bordered columns of square step chips on the
 * NHS grey-5 surface, with semantic left-border accents (red = problem, green =
 * added, blue = changed) and an NHS-blue divider. Flat and reduced-motion safe.
 */
export function PathwayVisual({
  current,
  future,
  currentHeading = 'Current pathway',
  futureHeading = 'With this product',
  className = '',
}: {
  current: PathwayStep[]
  future: PathwayStep[]
  currentHeading?: ReactNode
  futureHeading?: ReactNode
  className?: string
}) {
  return (
    <div className={`hs-pathway-visual${className ? ` ${className}` : ''}`}>
      <div className="hs-pathway-col hs-pathway-current">
        <p className="hs-pathway-heading">{currentHeading}</p>
        {current.map((step, i) => (
          <div key={i} className={`hs-pathway-step ${KIND_CLASS[step.kind ?? 'default']}`.trim()}>
            {step.label}
          </div>
        ))}
      </div>
      <div className="hs-pathway-divider" aria-hidden>
        →
      </div>
      <div className="hs-pathway-col hs-pathway-future">
        <p className="hs-pathway-heading">{futureHeading}</p>
        {future.map((step, i) => (
          <div key={i} className={`hs-pathway-step ${KIND_CLASS[step.kind ?? 'default']}`.trim()}>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PathwayVisual
