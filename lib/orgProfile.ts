import type { OrganisationProfile, EntityType } from '@/lib/ai/commissionerProfiles'
import { ENTITY_TYPES } from '@/lib/ai/commissionerProfiles'

export { ENTITY_TYPES }
export type { EntityType }

/** Per-condition cohort + priorities captured on the Org Settings page. */
export type OrgProfileConditionEntry = {
  conditionId: string
  cohortSize?: number
  priorities: string[]
}

/**
 * The editable subset of an organisation's profile, stored as JSON in org_profiles.
 * This is the shape the Org Settings page reads/writes and the AI overlay merges.
 */
export type OrgProfileSettings = {
  organisationName: string
  entityType: EntityType
  parentIcbName: string
  region: string
  population?: number
  localHealthChallenges: string[]
  /** Free-text tags; joined to a string for the AI prompt. */
  currentDigitalPosition: string[]
  deprivationProfile: string
  ruralUrbanMix: string
  strategicPriorities: string[]
  conditions: OrgProfileConditionEntry[]
}

export function emptyOrgProfileSettings(): OrgProfileSettings {
  return {
    organisationName: '',
    entityType: 'ICB',
    parentIcbName: '',
    region: '',
    population: undefined,
    localHealthChallenges: [],
    currentDigitalPosition: [],
    deprivationProfile: '',
    ruralUrbanMix: '',
    strategicPriorities: [],
    conditions: [],
  }
}

/** Seed form defaults from a static/resolved OrganisationProfile. */
export function orgProfileSettingsFromProfile(p: OrganisationProfile): OrgProfileSettings {
  return {
    organisationName: p.icbName ?? '',
    entityType: p.entityType ?? 'ICB',
    parentIcbName: p.parentIcbName ?? '',
    region: p.region ?? '',
    population: p.population && p.population > 0 ? p.population : undefined,
    localHealthChallenges: [...(p.localHealthChallenges ?? [])],
    // The static digital position is a long paragraph; leave the tag editor empty
    // so the AI keeps using the rich static text until the org adds explicit tags.
    currentDigitalPosition: [],
    deprivationProfile: p.deprivationProfile ?? '',
    ruralUrbanMix: p.ruralUrbanMix ?? '',
    strategicPriorities: [...(p.strategicPriorities ?? [])],
    conditions: p.conditions?.length
      ? p.conditions.map(c => ({ ...c, priorities: [...c.priorities] }))
      : (p.conditionFocus ?? []).map(conditionId => ({ conditionId, priorities: [] })),
  }
}

function trimmedString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function trimmedStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v
    .filter((x): x is string => typeof x === 'string')
    .map(x => x.trim())
    .filter(Boolean)
}

function coercePopulation(v: unknown): number | undefined {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.replace(/[, ]/g, '')) : NaN
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined
}

function isEntityType(v: unknown): v is EntityType {
  return typeof v === 'string' && (ENTITY_TYPES as readonly string[]).includes(v)
}

/**
 * Validate + coerce arbitrary input (e.g. a PUT body) into OrgProfileSettings.
 * Pass the set of valid DTx condition ids so unknown conditions are dropped.
 */
export function sanitizeOrgProfileSettings(
  raw: unknown,
  validConditionIds: Set<string>,
): OrgProfileSettings {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

  const seenConditions = new Set<string>()
  const conditions: OrgProfileConditionEntry[] = Array.isArray(obj.conditions)
    ? obj.conditions
        .map((c): OrgProfileConditionEntry | null => {
          if (!c || typeof c !== 'object') return null
          const entry = c as Record<string, unknown>
          const conditionId = trimmedString(entry.conditionId)
          if (!conditionId || !validConditionIds.has(conditionId)) return null
          if (seenConditions.has(conditionId)) return null
          seenConditions.add(conditionId)
          return {
            conditionId,
            cohortSize: coercePopulation(entry.cohortSize),
            priorities: trimmedStringArray(entry.priorities),
          }
        })
        .filter((c): c is OrgProfileConditionEntry => c !== null)
    : []

  return {
    organisationName: trimmedString(obj.organisationName),
    entityType: isEntityType(obj.entityType) ? obj.entityType : 'ICB',
    parentIcbName: trimmedString(obj.parentIcbName),
    region: trimmedString(obj.region),
    population: coercePopulation(obj.population),
    localHealthChallenges: trimmedStringArray(obj.localHealthChallenges),
    currentDigitalPosition: trimmedStringArray(obj.currentDigitalPosition),
    deprivationProfile: trimmedString(obj.deprivationProfile),
    ruralUrbanMix: trimmedString(obj.ruralUrbanMix),
    strategicPriorities: trimmedStringArray(obj.strategicPriorities),
    conditions,
  }
}
