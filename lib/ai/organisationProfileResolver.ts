import type { OrganisationProfile } from '@/lib/ai/commissionerProfiles'
import { getOrganisationProfileFromSession } from '@/lib/ai/commissionerProfiles'
import type { OrgProfileSettings } from '@/lib/orgProfile'
import { resolveOrganizationId } from '@/lib/orgIdentity'
import { getOrgProfile } from '@/lib/orgProfileStore'
import type { SessionData } from '@/lib/session'

type ResolverSession = Parameters<typeof getOrganisationProfileFromSession>[0] &
  Pick<SessionData, 'organizationId' | 'profileOrganisationName' | 'commissioningEntityId'>

/** Overlay saved Org Settings on top of the static profile (saved wins when present). */
export function mergeOrganisationProfile(
  base: OrganisationProfile,
  saved: OrgProfileSettings,
): OrganisationProfile {
  const conditions = saved.conditions.length ? saved.conditions : base.conditions
  const conditionFocus = saved.conditions.length
    ? saved.conditions.map(c => c.conditionId)
    : base.conditionFocus

  return {
    ...base,
    icbName: saved.organisationName || base.icbName,
    entityType: saved.entityType || base.entityType,
    parentIcbName: saved.parentIcbName || base.parentIcbName,
    region: saved.region || base.region,
    population: saved.population ?? base.population,
    strategicPriorities: saved.strategicPriorities.length
      ? saved.strategicPriorities
      : base.strategicPriorities,
    localHealthChallenges: saved.localHealthChallenges.length
      ? saved.localHealthChallenges
      : base.localHealthChallenges,
    currentDigitalPosition: saved.currentDigitalPosition.length
      ? saved.currentDigitalPosition.join('. ')
      : base.currentDigitalPosition,
    deprivationProfile: saved.deprivationProfile || base.deprivationProfile,
    ruralUrbanMix: saved.ruralUrbanMix || base.ruralUrbanMix,
    conditions,
    conditionFocus,
  }
}

/**
 * Resolves the organisation profile used to build the AI Advisor context.
 * Starts from the static profile, then overlays any saved Org Settings record.
 * DB failures (e.g. missing DATABASE_URL) degrade gracefully to the static profile.
 */
export async function getResolvedOrganisationProfile(
  session: ResolverSession,
): Promise<OrganisationProfile> {
  const base = getOrganisationProfileFromSession(session)

  try {
    const organizationId = await resolveOrganizationId(session)
    const saved = await getOrgProfile(organizationId)
    if (!saved) return base
    return mergeOrganisationProfile(base, saved)
  } catch (err) {
    console.error('[OrgProfile] Resolver fell back to static profile:', err)
    return base
  }
}
