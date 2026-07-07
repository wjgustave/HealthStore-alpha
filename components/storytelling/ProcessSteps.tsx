import type { ReactNode } from 'react'

export type ProcessStep = {
  title: ReactNode
  description?: ReactNode
}

/**
 * Numbered process steps. [Provenance: Bespoke — no NHS component]
 *
 * The nearest NHS component (Task list) carries different "to-do" semantics, so
 * this is inferred: a responsive grid of centred cards, each led by the one
 * genuinely round element NHS allows here — a 40px NHS-blue number disc. Rendered
 * as an ordered list for correct reading order.
 */
export function ProcessSteps({
  steps,
  className = '',
}: {
  steps: ProcessStep[]
  className?: string
}) {
  return (
    <ol className={`hs-steps-grid list-none p-0${className ? ` ${className}` : ''}`}>
      {steps.map((step, i) => (
        <li key={i} className="hs-step">
          <span className="hs-step-num" aria-hidden>
            {i + 1}
          </span>
          <h3>{step.title}</h3>
          {step.description ? <p>{step.description}</p> : null}
        </li>
      ))}
    </ol>
  )
}

export default ProcessSteps
