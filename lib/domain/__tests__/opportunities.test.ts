import { describe, it, expect } from 'vitest'
import { getAllConditions, getConditionById, getAreaOpportunities, getOpportunityForCondition, rankOpportunities } from '../opportunities'
import type { CommissionerContext } from '@/lib/context/types'

const GM_CONTEXT: CommissionerContext = {
  geography_type: 'icb',
  geography_id: 'QOP',
  geography_label: 'NHS Greater Manchester Integrated Care Board',
  scenario_id: 'central',
}

const NATIONAL_CONTEXT: CommissionerContext = {
  geography_type: 'national',
  geography_label: 'England (illustrative baseline)',
  scenario_id: 'central',
}

describe('getAllConditions', () => {
  it('returns all 10 pathway domains', () => {
    const conditions = getAllConditions()
    expect(conditions.length).toBe(10)
    expect(conditions[0].id).toBe('copd')
  })

  it('each condition has required fields', () => {
    const conditions = getAllConditions()
    for (const c of conditions) {
      expect(c.id).toBeTruthy()
      expect(c.label).toBeTruthy()
      expect(c.category).toBeTruthy()
      expect(c.contentStatus).toBeTruthy()
      expect(Array.isArray(c.productSlugs)).toBe(true)
    }
  })
})

describe('getConditionById', () => {
  it('returns condition by id', () => {
    const copd = getConditionById('copd')
    expect(copd).not.toBeNull()
    expect(copd!.label).toContain('COPD')
    expect(copd!.productSlugs).toContain('luscii')
  })

  it('returns null for unknown id', () => {
    expect(getConditionById('nonexistent')).toBeNull()
  })
})

describe('getAreaOpportunities', () => {
  it('returns opportunities for GM context', () => {
    const opps = getAreaOpportunities(GM_CONTEXT)
    expect(opps.length).toBeGreaterThan(0)
    expect(opps.some(o => o.conditionId === 'copd')).toBe(true)
  })

  it('falls back to QOP for national context', () => {
    const opps = getAreaOpportunities(NATIONAL_CONTEXT)
    expect(opps.length).toBeGreaterThan(0)
  })
})

describe('getOpportunityForCondition', () => {
  it('returns COPD opportunity', () => {
    const opp = getOpportunityForCondition('copd', GM_CONTEXT)
    expect(opp).not.toBeNull()
    expect(opp!.priorityBand).toBe('high')
    expect(opp!.relevantProductIds).toContain('luscii')
  })

  it('returns null for missing condition', () => {
    const opp = getOpportunityForCondition('nonexistent', GM_CONTEXT)
    expect(opp).toBeNull()
  })
})

describe('rankOpportunities', () => {
  it('ranks high priority first', () => {
    const opps = getAreaOpportunities(GM_CONTEXT)
    const ranked = rankOpportunities(opps)
    const bands = ranked.map(o => o.priorityBand)
    const highIdx = bands.indexOf('high')
    const watchIdx = bands.indexOf('watch')
    if (highIdx >= 0 && watchIdx >= 0) {
      expect(highIdx).toBeLessThan(watchIdx)
    }
  })

  it('prioritises user-selected condition', () => {
    const opps = getAreaOpportunities(GM_CONTEXT)
    const ranked = rankOpportunities(opps, 'msk_back_pain')
    expect(ranked[0].conditionId).toBe('msk_back_pain')
  })
})
