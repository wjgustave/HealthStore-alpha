/**
 * NHS DTx Funding Finder — public surface.
 *
 * Orchestrates a single provider-agnostic model call into a ranked, consistently
 * structured list of funding opportunities. The model only returns a JSON array
 * of candidates; parsing, scoring (0-100), and ranking all happen here in code.
 */

import { buildSystemPrompt, buildUserMessage } from './prompt'
import { extractFundingArray } from './parse'
import { scoreResult } from './score'
import { getProvider } from './provider'
import type { LLMProvider } from './provider'
import type { ApplicantFit, FundingResult, FundingSearchParams, MatchType } from './types'

const VALID_MATCH_TYPES: MatchType[] = [
  'dtx_specific',
  'condition',
  'condition_area',
  'generic_digital_health',
]

const VALID_APPLICANT_FITS: ApplicantFit[] = [
  'commissioner_eligible',
  'adoption_partner',
  'developer_or_academic_only',
  'unclear',
]

/** Eligibility ranking used as a secondary sort key (higher = more accessible to a commissioner). */
const APPLICANT_FIT_RANK: Record<ApplicantFit, number> = {
  commissioner_eligible: 3,
  adoption_partner: 2,
  unclear: 1,
  developer_or_academic_only: 0,
}

function coerceResult(raw: Record<string, unknown>): Omit<FundingResult, '_score'> | null {
  const fundName = typeof raw.fund_name === 'string' ? raw.fund_name.trim() : ''
  if (!fundName) return null

  const matchType = VALID_MATCH_TYPES.includes(raw.match_type as MatchType)
    ? (raw.match_type as MatchType)
    : 'generic_digital_health'

  const applicantFit = VALID_APPLICANT_FITS.includes(raw.applicant_fit as ApplicantFit)
    ? (raw.applicant_fit as ApplicantFit)
    : 'unclear'

  const asStringOrNull = (v: unknown): string | null =>
    typeof v === 'string' && v.trim() && v.trim().toLowerCase() !== 'null' ? v.trim() : null

  return {
    fund_name: fundName,
    provider: typeof raw.provider === 'string' ? raw.provider : 'Unknown',
    eligibility_summary:
      typeof raw.eligibility_summary === 'string' ? raw.eligibility_summary : '',
    amount_range: asStringOrNull(raw.amount_range),
    deadline: asStringOrNull(raw.deadline),
    region_scope: typeof raw.region_scope === 'string' ? raw.region_scope : 'Unclear',
    match_type: matchType,
    match_rationale: typeof raw.match_rationale === 'string' ? raw.match_rationale : '',
    applicant_fit: applicantFit,
  }
}

/**
 * Run the funding finder end-to-end. Provider is injectable for testing; the
 * default is resolved from {@link getProvider}.
 */
export async function runFundingFinder(
  params: FundingSearchParams,
  provider: LLMProvider = getProvider(),
): Promise<FundingResult[]> {
  const system = buildSystemPrompt(params.region, params.mode, params.selection)
  const user = buildUserMessage(params.region, params.mode, params.selection)

  const raw = await provider.generate({ system, user, webSearch: true, maxTokens: 6000 })

  if (!raw.trim()) {
    throw new Error('No text returned from the model.')
  }

  const parsed = extractFundingArray(raw)

  return parsed
    .map(coerceResult)
    .filter((r): r is Omit<FundingResult, '_score'> => r !== null)
    // Deterministic eligibility filter: drop funds only a developer/academic can access.
    .filter(r => r.applicant_fit !== 'developer_or_academic_only')
    .map(r => ({ ...r, _score: scoreResult(r, params.region) }))
    // Rank by confidence, then prefer funds the commissioner can actually access.
    .sort(
      (a, b) =>
        b._score - a._score ||
        APPLICANT_FIT_RANK[b.applicant_fit] - APPLICANT_FIT_RANK[a.applicant_fit],
    )
}

export { REGIONS, CONDITIONS, APPS, SEARCH_MODE, getSelectionLabel } from './data'
export type { Region, Condition, DtxApp, ConditionArea, SearchMode } from './data'
export type { FundingResult, FundingSearchParams, MatchType, ApplicantFit } from './types'
export { getProvider } from './provider'
export type { LLMProvider } from './provider'
