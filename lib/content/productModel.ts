/** Enhanced product content model (spec Appendix A). */

export type EvidenceBasis =
  | 'observed_operational'
  | 'evaluated_outcome'
  | 'modelled_economic'
  | 'strategic_qualitative'

export type BenefitCategory =
  | 'cash_releasing'
  | 'capacity_released'
  | 'health_gain'
  | 'productivity'
  | 'provider_income'
  | 'strategic'

export type AssuranceDomainStatus =
  | 'verified_current'
  | 'verified_review_due'
  | 'declared_pending'
  | 'incomplete'
  | 'expired'
  | 'not_applicable'

export interface PathwayStep {
  id: string
  label: string
  role?: string
  change?: 'removed' | 'changed' | 'added' | 'unchanged'
  notes?: string
}

export interface EvidenceClaim {
  claim_id: string
  claim_text: string
  metric?: string
  unit?: string
  effect_central?: number
  effect_lower?: number
  effect_upper?: number
  basis: EvidenceBasis
  evidence_strength: string
  study_population?: string
  comparator?: string
  source_reference: string
  source_date: string
  geography?: string
  limitations?: string
  benefit_category?: BenefitCategory
  payer?: string
  beneficiary?: string
}

export interface AssuranceDomain {
  domain: string
  status: AssuranceDomainStatus
  summary: string
  verified_date?: string
  review_due?: string
  residual_action?: string
}

export interface EconomicScenario {
  scenario_id: 'conservative' | 'central' | 'evidence_led'
  label: string
  benefits: {
    category: BenefitCategory
    label: string
    amount_gbp?: number
    amount_hours?: number
    payer?: string
    beneficiary?: string
    mechanism?: string
    confidence?: string
  }[]
  costs: {
    label: string
    amount_gbp: number
    payer?: string
  }[]
  assumptions: string[]
}

export interface EngagementSignal {
  metric: string
  value: string
  source: string
  caveat?: string
}

export interface ProductNarrative {
  decision_summary?: {
    one_line_proposition: string
    pathway_problem: string
    intervention_class: string
    why_relevant: string
  }
  pathway_model?: {
    current_steps: PathwayStep[]
    future_steps: PathwayStep[]
    roles: string[]
    changed_resources: string[]
  }
  evidence_claims?: EvidenceClaim[]
  economic_scenarios?: EconomicScenario[]
  assurance_domains?: AssuranceDomain[]
  commercial_readiness?: {
    proposition_type: string
    route_status: string
    commercial_status: string
    buyer_pack_status: string
    price_summary?: string
    healthstore_role?: string
  }
  regulatory_position?: {
    device_class: string
    hira_status: string
    market_access: string
    assurance_speed_note: string
  }
  commissioner_economics?: {
    headline: string
    cash_vs_capacity: string
    settings: {
      label: string
      net_value_gbp?: number
      cash_gbp?: number
      capacity_gbp?: number
      cost_gbp?: number
      note: string
    }[]
    funding_levers?: { label: string; status: string; note: string }[]
    tariff_note?: string
  }
  what_it_does_bullets?: string[]
  engagement_signals?: EngagementSignal[]
  implementation?: {
    human_wrapper: string
    workforce: string
    timescale: string
    prerequisites: string[]
    owner?: string
    /** Sequential onboarding flow rendered as a pathway-style diagram. */
    onboarding_steps?: string[]
    /** Full-width trailing step shown under the flow (no connecting arrow). */
    onboarding_ongoing_step?: string
    /** Supporting note shown under the onboarding diagram. */
    onboarding_note?: string
  }
  publishing?: {
    content_owner: string
    review_date: string
    next_review: string
  }
}

export interface IcbReferenceData {
  icb_id: string
  icb_name: string
  condition: string
  eligible_cohort: number
  high_risk_cohort?: number
  annual_admissions?: number
  annual_ae_attendances?: number
  readmission_rate_90d?: number
  comparator_label?: string
  data_date: string
  source: string
  completeness: 'full' | 'partial' | 'illustrative'
}

export interface OpportunityData {
  condition_id: string
  condition_label: string
  need_summary: string
  pathway_gap: string
  why_addressable: string
  intervention_types: string[]
  product_slugs: string[]
  impact_headline: {
    metric: string
    conservative: string
    central: string
    evidence_led: string
    basis: EvidenceBasis
    source: string
  }[]
  commissioning_considerations: string[]
}
