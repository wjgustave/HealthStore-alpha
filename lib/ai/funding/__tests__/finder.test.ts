import { describe, it, expect } from 'vitest'
import { runFundingFinder } from '../index'
import type { LLMProvider } from '../provider'

/** A stub provider returning a fixed model response, so the finder runs offline. */
function stubProvider(response: string): LLMProvider {
  return { generate: async () => response }
}

const fund = (name: string, applicant_fit: string, match_type = 'condition') =>
  `{"fund_name":"${name}","provider":"NHSE","eligibility_summary":"Open to NHS organisations across England","amount_range":"£50k","deadline":"Ongoing","region_scope":"National","match_type":"${match_type}","match_rationale":"Targets the condition","applicant_fit":"${applicant_fit}"}`

describe('runFundingFinder eligibility filtering', () => {
  const params = { region: 'London', mode: 'condition', selection: 'copd' } as const

  it('drops developer_or_academic_only results', async () => {
    const response = `[${fund('Commissioner Fund', 'commissioner_eligible')},${fund('SBRI Dev Comp', 'developer_or_academic_only')},${fund('Partner Fund', 'adoption_partner')}]`
    const results = await runFundingFinder(params, stubProvider(response))

    expect(results.map(r => r.fund_name)).not.toContain('SBRI Dev Comp')
    expect(results).toHaveLength(2)
  })

  it('defaults a missing/invalid applicant_fit to "unclear" and keeps it', async () => {
    const response = `[{"fund_name":"No Fit Field","provider":"NHSE","eligibility_summary":"Open to NHS","amount_range":null,"deadline":"Ongoing","region_scope":"National","match_type":"condition","match_rationale":"x"}]`
    const results = await runFundingFinder(params, stubProvider(response))

    expect(results).toHaveLength(1)
    expect(results[0].applicant_fit).toBe('unclear')
  })

  it('prefers commissioner-eligible funds over unclear at equal score', async () => {
    // Identical except applicant_fit -> identical _score, so eligibility breaks the tie.
    const response = `[${fund('Unclear One', 'unclear')},${fund('Eligible One', 'commissioner_eligible')}]`
    const results = await runFundingFinder(params, stubProvider(response))

    expect(results[0]._score).toBe(results[1]._score)
    expect(results[0].fund_name).toBe('Eligible One')
  })

  it('still ranks primarily by confidence score', async () => {
    // Lower-eligibility but much stronger topic match should outrank an eligible weak match.
    const response = `[${fund('Eligible Generic', 'commissioner_eligible', 'generic_digital_health')},${fund('Unclear DTx', 'unclear', 'dtx_specific')}]`
    const results = await runFundingFinder(params, stubProvider(response))

    expect(results[0].fund_name).toBe('Unclear DTx')
    expect(results[0]._score).toBeGreaterThan(results[1]._score)
  })
})
