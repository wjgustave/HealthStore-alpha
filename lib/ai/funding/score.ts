import type { FundingResult } from './types'

/**
 * Deterministic 0-100 confidence score. This lives in code (never the model) so
 * results are reproducible across any provider. Topic specificity carries the
 * heaviest weight. The model only classifies each result into a fixed
 * `match_type` enum; the code maps enum -> points.
 *
 *  Topic match   dtx_specific 45 | condition 35 | condition_area 20 | generic 10
 *  Geography     exact region 25 | national 20 | other/unclear 5
 *  Recency       open/rolling 15 | dated & known 10 | unknown 5
 *  Eligibility   clear summary present 10 | otherwise 3
 *  Amount        known 5
 *  (capped at 100)
 */
export function scoreResult(
  result: Pick<
    FundingResult,
    'match_type' | 'region_scope' | 'deadline' | 'eligibility_summary' | 'amount_range'
  >,
  region: string,
): number {
  let score = 0
  const mt = result.match_type

  // Topic specificity (heaviest weight).
  if (mt === 'dtx_specific') score += 45
  else if (mt === 'condition') score += 35
  else if (mt === 'condition_area') score += 20
  else score += 10

  // Geography.
  const rs = (result.region_scope || '').toLowerCase()
  const rl = region.toLowerCase()
  if (rs === 'national') score += 20
  else if (rs && (rs.includes(rl) || rl.includes(rs))) score += 25
  else score += 5

  // Recency / deadline (active or ongoing funds are more useful).
  const dl = (result.deadline || '').toLowerCase()
  if (dl.includes('ongoing') || dl.includes('rolling') || dl.includes('open')) score += 15
  else if (dl && !dl.includes('unknown') && !dl.includes('null')) score += 10
  else score += 5

  // Eligibility clarity.
  if (result.eligibility_summary && result.eligibility_summary.length > 20) score += 10
  else score += 3

  // Amount known.
  if (
    result.amount_range &&
    result.amount_range !== 'null' &&
    result.amount_range !== 'Unknown'
  ) {
    score += 5
  }

  return Math.min(score, 100)
}
