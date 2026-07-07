import type { EconomicScenario } from '@/lib/content/productModel'

const CATEGORY_LABELS: Record<string, string> = {
  cash_releasing: 'Cash-releasing',
  capacity_released: 'Capacity released',
  health_gain: 'Health gain',
  productivity: 'Productivity / societal',
  provider_income: 'Provider income / payment enabler',
  strategic: 'Strategic / qualitative',
}

function formatGbp(n?: number) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
}

export default function BenefitStack({ scenario }: { scenario: EconomicScenario }) {
  const byCategory = scenario.benefits.reduce<Record<string, typeof scenario.benefits>>((acc, b) => {
    const key = b.category
    if (!acc[key]) acc[key] = []
    acc[key].push(b)
    return acc
  }, {})

  return (
    <div>
      {Object.entries(byCategory).map(([cat, items]) => (
        <div key={cat} className="nhsuk-u-margin-bottom-4">
          <h3 className="nhsuk-heading-s">{CATEGORY_LABELS[cat] ?? cat}</h3>
          <table className="nhsuk-table">
            <caption className="nhsuk-u-visually-hidden">{CATEGORY_LABELS[cat]} benefits</caption>
            <thead className="nhsuk-table__head">
              <tr className="nhsuk-table__row">
                <th className="nhsuk-table__header" scope="col">Benefit</th>
                <th className="nhsuk-table__header" scope="col">Amount</th>
                <th className="nhsuk-table__header" scope="col">Payer / beneficiary</th>
              </tr>
            </thead>
            <tbody className="nhsuk-table__body">
              {items.map((item) => (
                <tr key={item.label} className="nhsuk-table__row">
                  <td className="nhsuk-table__cell">
                    {item.label}
                    {item.mechanism ? <div className="nhsuk-body-s">{item.mechanism}</div> : null}
                  </td>
                  <td className="nhsuk-table__cell">{formatGbp(item.amount_gbp)}</td>
                  <td className="nhsuk-table__cell">
                    {item.payer && item.beneficiary ? `${item.payer} → ${item.beneficiary}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <h3 className="nhsuk-heading-s">Costs (same scenario)</h3>
      <table className="nhsuk-table">
        <tbody className="nhsuk-table__body">
          {scenario.costs.map((c) => (
            <tr key={c.label} className="nhsuk-table__row">
              <td className="nhsuk-table__cell">{c.label}</td>
              <td className="nhsuk-table__cell">{formatGbp(c.amount_gbp)}</td>
              <td className="nhsuk-table__cell">{c.payer ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="nhsuk-inset-text nhsuk-u-margin-top-3">
        <p>Indicative model output. Cash, capacity and health gain are not combined into a single savings figure.</p>
        <ul className="nhsuk-list nhsuk-list--bullet">
          {scenario.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
