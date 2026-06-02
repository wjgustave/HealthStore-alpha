import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/orgIdentity'
import { sanitizeOrgProfileSettings } from '@/lib/orgProfile'

describe('slugify', () => {
  it('lowercases, replaces & with and, and dasherizes', () => {
    expect(slugify('Shropshire, Telford & Wrekin ICB')).toBe('shropshire-telford-and-wrekin-icb')
  })

  it('trims leading/trailing separators', () => {
    expect(slugify('  Cornwall and Isles of Scilly ICB  ')).toBe(
      'cornwall-and-isles-of-scilly-icb',
    )
  })
})

describe('sanitizeOrgProfileSettings', () => {
  const validConditions = new Set(['copd', 'cr', 'pr'])

  it('coerces and trims fields, dropping unknown conditions', () => {
    const result = sanitizeOrgProfileSettings(
      {
        organisationName: '  Penzance PCN ',
        entityType: 'PCN',
        parentIcbName: ' Cornwall and Isles of Scilly ICB ',
        region: 'South West',
        population: '42,000',
        localHealthChallenges: ['  High COPD prevalence ', '', 123],
        currentDigitalPosition: ['myCOPD live'],
        deprivationProfile: 'Mixed',
        ruralUrbanMix: 'Rural',
        strategicPriorities: ['Reduce admissions'],
        conditions: [
          { conditionId: 'copd', cohortSize: '18000', priorities: ['Cut admissions', ''] },
          { conditionId: 'unknown-condition', priorities: ['ignored'] },
          { conditionId: 'copd', priorities: ['dupe dropped'] },
        ],
      },
      validConditions,
    )

    expect(result.organisationName).toBe('Penzance PCN')
    expect(result.entityType).toBe('PCN')
    expect(result.population).toBe(42000)
    expect(result.localHealthChallenges).toEqual(['High COPD prevalence'])
    expect(result.conditions).toHaveLength(1)
    expect(result.conditions[0]).toEqual({
      conditionId: 'copd',
      cohortSize: 18000,
      priorities: ['Cut admissions'],
    })
  })

  it('falls back to safe defaults for invalid input', () => {
    const result = sanitizeOrgProfileSettings({ entityType: 'Galaxy' }, validConditions)
    expect(result.entityType).toBe('ICB')
    expect(result.organisationName).toBe('')
    expect(result.population).toBeUndefined()
    expect(result.conditions).toEqual([])
  })
})
