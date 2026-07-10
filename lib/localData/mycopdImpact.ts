import type { ProductNarrative } from '@/lib/content/productModel'
import type { IcbReferenceData } from '@/lib/content/productModel'

export const MYCOPD_UPTAKE_RATE = 0.75

export type MycopdMetricImpact = {
  title: string
  todayLabel: string
  todayValue: number
  withLabel: string
  withValue: number
  delta: number
  deltaLabel: string
  effectPct: number
}

/**
 * myCOPD projected-impact maths for the dual-metric charts.
 * - GP: baseline appointments × effect% × 75% uptake
 * - Readmissions: enrolled cohort (eligible × 75%) × effect% (matt_demo)
 */
export function computeMycopdImpactMetrics(
  ref: IcbReferenceData,
  narrative: ProductNarrative,
): { gp: MycopdMetricImpact; readmit: MycopdMetricImpact; atUptake: number } {
  const gpClaim = narrative.evidence_claims?.find((c) => c.claim_id === 'mycopd-gp')
  const readmitClaim = narrative.evidence_claims?.find((c) => c.claim_id === 'mycopd-readmit')
  const gpEffect = gpClaim?.effect_central ?? 19
  const readmitEffect = readmitClaim?.effect_central ?? 20

  const atUptake = Math.round(ref.eligible_cohort * MYCOPD_UPTAKE_RATE)
  const gpToday = ref.annual_gp_appointments ?? 0
  const gpDelta = Math.round(gpToday * (gpEffect / 100) * MYCOPD_UPTAKE_RATE)
  const gpWith = Math.max(0, gpToday - gpDelta)

  const readmitToday = atUptake
  const readmitDelta = Math.round(atUptake * (readmitEffect / 100))
  const readmitWith = Math.max(0, readmitToday - readmitDelta)

  return {
    atUptake,
    gp: {
      title: 'GP appointments',
      todayLabel: 'Today',
      todayValue: gpToday,
      withLabel: 'With myCOPD',
      withValue: gpWith,
      delta: gpDelta,
      deltaLabel: 'fewer GP appointments per year',
      effectPct: gpEffect,
    },
    readmit: {
      title: 'Readmissions',
      todayLabel: 'Enrolled cohort (75% uptake)',
      todayValue: readmitToday,
      withLabel: 'With myCOPD',
      withValue: readmitWith,
      delta: readmitDelta,
      deltaLabel: 'fewer readmissions per year',
      effectPct: readmitEffect,
    },
  }
}
