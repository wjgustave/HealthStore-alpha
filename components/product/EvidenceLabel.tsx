import type { EvidenceBasis } from '@/lib/content/productModel'

const LABELS: Record<EvidenceBasis, string> = {
  observed_operational: 'Observed operational',
  evaluated_outcome: 'Evaluated outcome',
  modelled_economic: 'Modelled economic',
  strategic_qualitative: 'Strategic / qualitative',
}

const TAG_CLASS: Record<EvidenceBasis, string> = {
  observed_operational: 'nhsuk-tag nhsuk-tag--green',
  evaluated_outcome: 'nhsuk-tag nhsuk-tag--blue',
  modelled_economic: 'nhsuk-tag nhsuk-tag--grey',
  strategic_qualitative: 'nhsuk-tag nhsuk-tag--white',
}

export default function EvidenceLabel({
  basis,
  strength,
  source,
  date,
}: {
  basis: EvidenceBasis
  strength?: string
  source?: string
  date?: string
}) {
  return (
    <div className="nhsuk-u-margin-bottom-3">
      <span className={TAG_CLASS[basis]}>{LABELS[basis]}</span>
      {strength ? <span className="nhsuk-body-s nhsuk-u-margin-left-2">Strength: {strength}</span> : null}
      {source ? (
        <p className="nhsuk-body-s nhsuk-u-margin-top-1 nhsuk-u-margin-bottom-0">
          Source: {source}{date ? ` · ${date}` : ''}
        </p>
      ) : null}
    </div>
  )
}
