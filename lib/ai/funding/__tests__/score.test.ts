import { describe, it, expect } from 'vitest'
import { scoreResult } from '../score'
import type { FundingResult } from '../types'

const base: Pick<
  FundingResult,
  'match_type' | 'region_scope' | 'deadline' | 'eligibility_summary' | 'amount_range'
> = {
  match_type: 'generic_digital_health',
  region_scope: 'Unclear',
  deadline: null,
  eligibility_summary: '',
  amount_range: null,
}

describe('scoreResult', () => {
  it('weights match_type: dtx_specific > condition > condition_area > generic', () => {
    const region = 'London'
    const s = (mt: FundingResult['match_type']) =>
      scoreResult({ ...base, match_type: mt }, region)
    expect(s('dtx_specific')).toBeGreaterThan(s('condition'))
    expect(s('condition')).toBeGreaterThan(s('condition_area'))
    expect(s('condition_area')).toBeGreaterThan(s('generic_digital_health'))
  })

  it('awards 45 points for dtx_specific topic match', () => {
    // generic baseline: 10 (topic) + 5 (geo) + 5 (recency) + 3 (eligibility) = 23
    expect(scoreResult(base, 'London')).toBe(23)
    // dtx_specific changes topic 10 -> 45 (+35)
    expect(scoreResult({ ...base, match_type: 'dtx_specific' }, 'London')).toBe(58)
  })

  it('scores exact region (25) above national (20) above other (5)', () => {
    const exact = scoreResult({ ...base, region_scope: 'London' }, 'London')
    const national = scoreResult({ ...base, region_scope: 'National' }, 'London')
    const other = scoreResult({ ...base, region_scope: 'Scotland' }, 'London')
    expect(exact - other).toBe(20)
    expect(national - other).toBe(15)
  })

  it('matches region by substring (case-insensitive)', () => {
    // generic(10) + geography substring match(25) + recency unknown(5) + eligibility sparse(3) = 43
    const s = scoreResult({ ...base, region_scope: 'london' }, 'London')
    expect(s).toBe(43)
  })

  it('recency: open/rolling (15) > dated known (10) > unknown (5)', () => {
    const open = scoreResult({ ...base, deadline: 'Ongoing' }, 'London')
    const dated = scoreResult({ ...base, deadline: '2026-09-30' }, 'London')
    const unknown = scoreResult({ ...base, deadline: null }, 'London')
    expect(open - unknown).toBe(10)
    expect(dated - unknown).toBe(5)
  })

  it('eligibility: clear summary (10) beats sparse (3)', () => {
    const clear = scoreResult(
      { ...base, eligibility_summary: 'Open to NHS trusts and ICBs in England.' },
      'London',
    )
    const sparse = scoreResult({ ...base, eligibility_summary: 'TBC' }, 'London')
    expect(clear - sparse).toBe(7)
  })

  it('awards 5 for a known amount', () => {
    const known = scoreResult({ ...base, amount_range: '£50k–£250k' }, 'London')
    const unknown = scoreResult({ ...base, amount_range: null }, 'London')
    expect(known - unknown).toBe(5)
  })

  it('caps the score at 100', () => {
    const max = scoreResult(
      {
        match_type: 'dtx_specific',
        region_scope: 'London',
        deadline: 'Ongoing / rolling',
        eligibility_summary: 'Open to all NHS commissioners deploying respiratory DTx.',
        amount_range: '£1m',
      },
      'London',
    )
    // 45 + 25 + 15 + 10 + 5 = 100
    expect(max).toBe(100)
    expect(max).toBeLessThanOrEqual(100)
  })
})
