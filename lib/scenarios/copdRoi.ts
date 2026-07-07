/**
 * COPD scenario engine — conservative / central / evidence-led (Sales Paper v5).
 * Cash, capacity, health gain kept separate; never aggregated as "savings".
 */

import type { ScenarioId } from '@/lib/context/types'
import type { EconomicScenario, BenefitCategory } from '@/lib/content/productModel'

export interface CopdScenarioInputs {
  monitored_cohort: number
  discharge_cohort: number
  eligible_admissions: number
}

const EFFECT = {
  luscii_admission: { conservative: 0.3, central: 0.4, evidence_led: 0.48 },
  luscii_ae: { conservative: 0.16, central: 0.25, evidence_led: 0.31 },
  mycopd_readmission: { conservative: 0.15, central: 0.2, evidence_led: 0.53 },
  capacity_to_cash: 0.4,
} as const

const UNIT_COSTS = {
  admission: 2655,
  ae: 273,
  readmission: 2655,
  luscii_per_patient: 110,
  mycopd_annual: 120000,
  tariff_topup_per_spell: 189,
} as const

function pickEffect(scenario: ScenarioId, key: keyof typeof EFFECT): number {
  const v = EFFECT[key]
  if (typeof v === 'number') return v
  return v[scenario]
}

export function buildCopdScenarios(inputs: CopdScenarioInputs, scenarioId: ScenarioId = 'central'): EconomicScenario[] {
  const scenarios: ScenarioId[] = ['conservative', 'central', 'evidence_led']

  return scenarios.map((sid): EconomicScenario => {
    const admEffect = pickEffect(sid, 'luscii_admission')
    const aeEffect = pickEffect(sid, 'luscii_ae')
    const admissionsAvoided = Math.round(inputs.monitored_cohort * 0.2 * admEffect)
    const aeAvoided = Math.round(inputs.monitored_cohort * 0.25 * aeEffect)
    const capacityAdmissions = admissionsAvoided * UNIT_COSTS.admission
    const capacityAe = aeAvoided * UNIT_COSTS.ae
    const cashElective = Math.round((capacityAdmissions + capacityAe) * EFFECT.capacity_to_cash)
    const tariffCash = Math.round(inputs.eligible_admissions * UNIT_COSTS.tariff_topup_per_spell)
    const lusciiCost = inputs.monitored_cohort * UNIT_COSTS.luscii_per_patient
    const mycopdCost = UNIT_COSTS.mycopd_annual

    return {
      scenario_id: sid,
      label: sid === 'conservative' ? 'Conservative' : sid === 'central' ? 'Central' : 'Evidence-led upper',
      benefits: [
        {
          category: 'capacity_released' as BenefitCategory,
          label: 'Emergency admissions avoided (remote monitoring)',
          amount_gbp: capacityAdmissions,
          payer: 'Acute provider',
          beneficiary: 'System',
          mechanism: `${Math.round(admEffect * 100)}% reduction on monitored high-risk cohort`,
          confidence: sid === 'evidence_led' ? 'Upper bound — NHS evaluation' : 'Central programme assumption',
        },
        {
          category: 'capacity_released' as BenefitCategory,
          label: 'A&E attendances avoided (remote monitoring)',
          amount_gbp: capacityAe,
          payer: 'Acute provider',
          beneficiary: 'System',
          mechanism: `${Math.round(aeEffect * 100)}% reduction`,
        },
        {
          category: 'cash_releasing' as BenefitCategory,
          label: 'Capacity converted to elective income (40% assumption)',
          amount_gbp: cashElective,
          payer: 'Acute provider',
          beneficiary: 'Acute provider',
          mechanism: 'Freed beds used for paid elective activity',
        },
        {
          category: 'provider_income' as BenefitCategory,
          label: 'COPD best practice tariff top-up (gateway crossed)',
          amount_gbp: tariffCash,
          payer: 'Commissioner',
          beneficiary: 'Acute provider',
          mechanism: '60% gateway on discharge bundle processes',
        },
        {
          category: 'health_gain' as BenefitCategory,
          label: 'Avoided harm and improved symptom control',
          payer: 'Patient / system',
          beneficiary: 'Patients',
          mechanism: 'Not monetised in prototype — see clinical evidence',
        },
      ],
      costs: [
        { label: 'Remote monitoring (all-in hub model)', amount_gbp: lusciiCost, payer: 'ICB' },
        { label: 'Self-management at discharge', amount_gbp: mycopdCost, payer: 'Acute / ICB' },
      ],
      assumptions: [
        `Monitored cohort: ${inputs.monitored_cohort} high-risk patients`,
        `Discharge cohort: ${inputs.discharge_cohort} admissions per year`,
        'Indicative until locally validated — model v5 June 2026',
        'Cash and capacity are reported separately',
      ],
    }
  }).filter((s) => s.scenario_id === scenarioId || true)
}

export function getActiveScenario(
  scenarios: EconomicScenario[],
  scenarioId: ScenarioId
): EconomicScenario {
  return scenarios.find((s) => s.scenario_id === scenarioId) ?? scenarios[1]
}
