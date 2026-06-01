import type { Region, SearchMode } from './data'

export type MatchType =
  | 'dtx_specific'
  | 'condition'
  | 'condition_area'
  | 'generic_digital_health'

/**
 * Who can access a fund, from the perspective of a commissioning/procuring NHS
 * organisation. Used as a deterministic eligibility filter: `developer_or_academic_only`
 * results are dropped, and the rest are ranked with eligible funds preferred.
 */
export type ApplicantFit =
  | 'commissioner_eligible'
  | 'adoption_partner'
  | 'developer_or_academic_only'
  | 'unclear'

/** A single funding opportunity as returned by the model (plus the code-computed score). */
export type FundingResult = {
  fund_name: string
  provider: string
  eligibility_summary: string
  amount_range: string | null
  deadline: string | null
  region_scope: string
  match_type: MatchType
  match_rationale: string
  /** Who can apply / draw down the fund, used to filter and rank by eligibility. */
  applicant_fit: ApplicantFit
  /** Deterministic 0-100 confidence score, computed in code (never by the model). */
  _score: number
}

export type FundingSearchParams = {
  region: Region
  mode: SearchMode
  selection: string
}
