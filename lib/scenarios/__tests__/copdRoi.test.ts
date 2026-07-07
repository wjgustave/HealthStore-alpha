import { describe, it, expect } from 'vitest'
import { buildCopdScenarios, getActiveScenario } from '../copdRoi'

describe('copdRoi', () => {
  const inputs = { monitored_cohort: 500, discharge_cohort: 500, eligible_admissions: 500 }

  it('returns three scenarios', () => {
    const scenarios = buildCopdScenarios(inputs)
    expect(scenarios).toHaveLength(3)
  })

  it('keeps cash and capacity separate', () => {
    const central = getActiveScenario(buildCopdScenarios(inputs), 'central')
    const cash = central.benefits.filter((b) => b.category === 'cash_releasing' || b.category === 'provider_income')
    const capacity = central.benefits.filter((b) => b.category === 'capacity_released')
    expect(cash.length).toBeGreaterThan(0)
    expect(capacity.length).toBeGreaterThan(0)
  })

  it('conservative is lower than evidence-led on admission capacity', () => {
    const conservative = getActiveScenario(buildCopdScenarios(inputs), 'conservative')
    const evidenceLed = getActiveScenario(buildCopdScenarios(inputs), 'evidence_led')
    const cCap = conservative.benefits.find((b) => b.label.includes('Emergency admissions'))?.amount_gbp ?? 0
    const eCap = evidenceLed.benefits.find((b) => b.label.includes('Emergency admissions'))?.amount_gbp ?? 0
    expect(eCap).toBeGreaterThan(cCap)
  })
})
