import { describe, it, expect } from 'vitest'
import {
  getOrganisationProfileFromSession,
  getCommissionerProfileFromSession,
  resolveFundingRegion,
} from '@/lib/ai/commissionerProfiles'
import { mergeOrganisationProfile } from '@/lib/ai/organisationProfileResolver'
import { emptyOrgProfileSettings } from '@/lib/orgProfile'

describe('getOrganisationProfileFromSession region for named NHS logins', () => {
  it('maps Cornwall ICB to South West region', () => {
    const profile = getOrganisationProfileFromSession({
      profileDisplayName: 'Lorraine Long',
      profileOrganisationName: 'Cornwall and Isles of Scilly ICB',
    })
    expect(resolveFundingRegion(profile)).toBe('South West')
  })

  it('maps Airedale trust to West Yorkshire profile region', () => {
    const profile = getOrganisationProfileFromSession({
      profileDisplayName: 'Marie Buchan',
      profileOrganisationName: 'Airedale NHS Foundation Trust',
    })
    expect(resolveFundingRegion(profile)).toBe('North East and Yorkshire')
  })

  it('maps Hampshire trust to South East', () => {
    const profile = getOrganisationProfileFromSession({
      profileDisplayName: 'Commissioner',
      profileOrganisationName: 'Hampshire & Isle of Wight Healthcare NHS Foundation Trust',
    })
    expect(resolveFundingRegion(profile)).toBe('South East')
  })

  it('keeps the deprecated alias working', () => {
    expect(getCommissionerProfileFromSession).toBe(getOrganisationProfileFromSession)
  })
})

describe('mergeOrganisationProfile (saved overlays static)', () => {
  const base = getOrganisationProfileFromSession({
    commissioningEntityId: 'cornwall-and-isles-of-scilly-icb',
  })

  it('overrides non-empty saved fields and keeps base for empty ones', () => {
    const saved = {
      ...emptyOrgProfileSettings(),
      organisationName: 'Penzance PCN',
      entityType: 'PCN' as const,
      parentIcbName: 'Cornwall and Isles of Scilly ICB',
      region: 'South West',
      population: 42000,
      strategicPriorities: ['Reduce respiratory admissions'],
    }
    const merged = mergeOrganisationProfile(base, saved)

    expect(merged.icbName).toBe('Penzance PCN')
    expect(merged.entityType).toBe('PCN')
    expect(merged.parentIcbName).toBe('Cornwall and Isles of Scilly ICB')
    expect(merged.population).toBe(42000)
    expect(merged.strategicPriorities).toEqual(['Reduce respiratory admissions'])
    // Empty saved fields fall back to the static profile.
    expect(merged.localHealthChallenges).toEqual(base.localHealthChallenges)
    expect(merged.currentDigitalPosition).toBe(base.currentDigitalPosition)
  })

  it('derives conditionFocus from saved conditions and joins digital position tags', () => {
    const saved = {
      ...emptyOrgProfileSettings(),
      organisationName: base.icbName,
      currentDigitalPosition: ['myCOPD pilot live', 'Virtual ward in build'],
      conditions: [
        { conditionId: 'copd', cohortSize: 18000, priorities: ['Cut admissions'] },
        { conditionId: 'cr', priorities: [] },
      ],
    }
    const merged = mergeOrganisationProfile(base, saved)

    expect(merged.conditionFocus).toEqual(['copd', 'cr'])
    expect(merged.currentDigitalPosition).toBe('myCOPD pilot live. Virtual ward in build')
    expect(merged.conditions).toHaveLength(2)
  })
})
