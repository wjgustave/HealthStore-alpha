import type { AssuranceDomain, AssuranceDomainStatus } from '@/lib/content/productModel'

const STATUS_LABELS: Record<AssuranceDomainStatus, string> = {
  verified_current: 'Available',
  verified_review_due: 'Verified — review due',
  declared_pending: 'Declared — verification pending',
  incomplete: 'Incomplete',
  expired: 'Expired / superseded',
  not_applicable: 'Not applicable',
}

const STATUS_TAG: Record<AssuranceDomainStatus, string> = {
  verified_current: 'nhsuk-tag nhsuk-tag--green',
  verified_review_due: 'nhsuk-tag nhsuk-tag--grey',
  declared_pending: 'nhsuk-tag nhsuk-tag--white',
  incomplete: 'nhsuk-tag nhsuk-tag--red',
  expired: 'nhsuk-tag nhsuk-tag--red',
  not_applicable: 'nhsuk-tag nhsuk-tag--grey',
}

export default function AssurancePassport({ domains }: { domains: AssuranceDomain[] }) {
  const material = domains.filter((d) => d.status === 'incomplete' || d.status === 'expired')
  return (
    <div>
      {material.length > 0 ? (
        <div className="nhsuk-warning-callout nhsuk-u-margin-bottom-4">
          <h3 className="nhsuk-warning-callout__label">Material assurance gaps</h3>
          <ul className="nhsuk-list nhsuk-list--bullet">
            {material.map((d) => (
              <li key={d.domain}>{d.domain}: {d.summary}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <table className="nhsuk-table">
        <thead className="nhsuk-table__head">
          <tr className="nhsuk-table__row">
            <th className="nhsuk-table__header" scope="col">Domain</th>
            <th className="nhsuk-table__header" scope="col">Status</th>
            <th className="nhsuk-table__header" scope="col">Summary</th>
          </tr>
        </thead>
        <tbody className="nhsuk-table__body">
          {domains.map((d) => (
            <tr key={d.domain} className="nhsuk-table__row">
              <td className="nhsuk-table__cell">{d.domain}</td>
              <td className="nhsuk-table__cell" style={{ whiteSpace: 'nowrap' }}>
                <span className={STATUS_TAG[d.status]} style={{ whiteSpace: 'nowrap' }}>{STATUS_LABELS[d.status]}</span>
                {d.review_due ? <div className="nhsuk-body-s">Review due: {d.review_due}</div> : null}
              </td>
              <td className="nhsuk-table__cell">
                {d.summary}
                {d.residual_action ? <div className="nhsuk-body-s"><strong>Local action:</strong> {d.residual_action}</div> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
