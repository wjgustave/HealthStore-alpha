import type { EvidenceBasis } from '@/lib/content/productModel'
import EvidenceLabel from './EvidenceLabel'

export default function ImpactMetric({
  name,
  value,
  unit,
  baseline,
  basis,
  source,
  assumptions,
}: {
  name: string
  value: string
  unit?: string
  baseline?: string
  basis: EvidenceBasis
  source: string
  assumptions?: string[]
}) {
  return (
    <div className="nhsuk-card nhsuk-u-margin-bottom-3">
      <div className="nhsuk-card__content">
        <h3 className="nhsuk-card__heading nhsuk-heading-s">{name}</h3>
        <p className="nhsuk-heading-l nhsuk-u-margin-bottom-1">{value}{unit ? ` ${unit}` : ''}</p>
        {baseline ? <p className="nhsuk-body-s">Baseline / comparator: {baseline}</p> : null}
        <EvidenceLabel basis={basis} source={source} />
        {assumptions?.length ? (
          <ul className="nhsuk-list nhsuk-list--bullet nhsuk-body-s">
            {assumptions.map((a) => <li key={a}>{a}</li>)}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
