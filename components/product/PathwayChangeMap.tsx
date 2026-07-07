import type { PathwayStep } from '@/lib/content/productModel'

export default function PathwayChangeMap({
  currentSteps,
  futureSteps,
}: {
  currentSteps: PathwayStep[]
  futureSteps: PathwayStep[]
}) {
  return (
    <div>
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-one-half">
          <h3 className="nhsuk-heading-s">Current pathway</h3>
          <ol className="nhsuk-list nhsuk-list--number">
            {currentSteps.map((s) => (
              <li key={s.id}>
                <strong>{s.label}</strong>
                {s.role ? ` — ${s.role}` : ''}
                {s.notes ? <span className="nhsuk-body-s"> ({s.notes})</span> : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="nhsuk-grid-column-one-half">
          <h3 className="nhsuk-heading-s">Proposed pathway</h3>
          <ol className="nhsuk-list nhsuk-list--number">
            {futureSteps.map((s) => (
              <li key={s.id}>
                <strong>{s.label}</strong>
                {s.role ? ` — ${s.role}` : ''}
                {s.change && s.change !== 'unchanged' ? (
                  <span className={`nhsuk-tag nhsuk-tag--${s.change === 'added' ? 'green' : s.change === 'removed' ? 'red' : 'grey'} nhsuk-u-margin-left-1`}>
                    {s.change}
                  </span>
                ) : null}
                {s.notes ? <span className="nhsuk-body-s"> ({s.notes})</span> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <details className="nhsuk-details nhsuk-u-margin-top-4">
        <summary className="nhsuk-details__summary">
          <span className="nhsuk-details__summary-text">Text-only pathway description (for screen readers and print)</span>
        </summary>
        <div className="nhsuk-details__text">
          <p><strong>Current:</strong> {currentSteps.map((s) => s.label).join(' → ')}</p>
          <p><strong>Proposed:</strong> {futureSteps.map((s) => `${s.label}${s.change ? ` [${s.change}]` : ''}`).join(' → ')}</p>
        </div>
      </details>
    </div>
  )
}
