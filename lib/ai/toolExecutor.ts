import {
  getAllApps,
  getAppBySlug,
  getOpenFunding,
  getAllFunding,
  getConditionAreas,
  getAppsByCondition,
  getAllConditions,
  type App,
  type Funding,
} from '@/lib/data'
import { filterAppsBySearchQuery } from '@/lib/catalogueSearch'
import enumsData from '@/content/common/enums.json'

type ToolResult = { result: string }

function summariseApp(app: App) {
  return {
    slug: app.slug,
    app_name: app.app_name,
    supplier_name: app.supplier_name,
    condition_tags: app.condition_tags,
    one_line_value_proposition: app.one_line_value_proposition,
    evidence_strength: app.evidence_strength,
    maturity_level: app.maturity_level,
    pricing_model: app.pricing_model,
    supervision_model: app.supervision_model,
  }
}

function financialFields(app: App) {
  return {
    slug: app.slug,
    app_name: app.app_name,
    pricing_model: app.pricing_model,
    national_price_available: app.national_price_available,
    indicative_price_text: app.indicative_price_text,
    pricing_confidence: app.pricing_confidence,
    free_offer_flag: app.free_offer_flag,
    service_wrap_included: app.service_wrap_included,
    service_wrap_description: app.service_wrap_description,
    contract_note: app.contract_note,
    procurement_notes: app.procurement_notes,
    expected_benefit_note: app.expected_benefit_note,
    tariff_considerations: app.tariff_considerations,
    provider_income_note: app.provider_income_note,
    roi_note: app.roi_note,
    nhse_125k_eligible: app.nhse_125k_eligible,
    nhse_125k_note: app.nhse_125k_note,
  }
}

function compareFields(app: App) {
  return {
    slug: app.slug,
    app_name: app.app_name,
    supplier_name: app.supplier_name,
    condition_tags: app.condition_tags,
    evidence_strength: app.evidence_strength,
    maturity_level: app.maturity_level,
    supervision_model: app.supervision_model,
    pricing_model: app.pricing_model,
    indicative_price_text: app.indicative_price_text,
    dtac_status: app.dtac_status,
    live_icbs: app.live_icbs,
    referral_modes: app.referral_modes,
    local_wraparound: app.local_wraparound,
    onboarding_model: app.onboarding_model,
    nice_guidance_refs: app.nice_guidance_refs,
    decommissioning_alert: app.decommissioning_alert,
  }
}

function summariseFunding(f: Funding) {
  return {
    id: f.id,
    title: f.title,
    sponsoring_body: f.sponsoring_body,
    total_value: f.total_value,
    status: f.status,
    condition_tags: f.condition_tags,
    closing_date: f.closing_date,
    closing_date_note: f.closing_date_note,
  }
}

const executors: Record<string, (args: Record<string, unknown>) => ToolResult> = {
  search_apps(args) {
    let apps = getAllApps()
    const condition = args.condition as string | undefined
    if (condition) {
      apps = apps.filter((a: App) => a.condition_tags?.includes(condition))
    }
    const query = args.query as string | undefined
    if (query?.trim()) {
      apps = filterAppsBySearchQuery(apps, query)
    }
    return {
      result: JSON.stringify({
        count: apps.length,
        apps: apps.map(summariseApp),
      }),
    }
  },

  get_app_detail(args) {
    const slug = args.slug as string
    const app = getAppBySlug(slug)
    if (!app) {
      return { result: JSON.stringify({ error: `No app found with slug "${slug}"` }) }
    }
    const {
      clinical_evidence_detailed,
      product_videos,
      demo_variants,
      ...rest
    } = app
    return {
      result: JSON.stringify({
        ...rest,
        evidence_studies_count: clinical_evidence_detailed?.length ?? 0,
        evidence_studies: (clinical_evidence_detailed ?? []).map((e: Record<string, unknown>) => ({
          id: e.id,
          ref: e.ref,
          type: e.type,
          authors: e.authors,
          year: e.year,
          n: e.n,
          key_results: e.key_results,
          study_limitation: e.study_limitation,
          peer_reviewed: e.peer_reviewed,
        })),
      }),
    }
  },

  get_app_financials(args) {
    const slug = args.slug as string
    const app = getAppBySlug(slug)
    if (!app) {
      return { result: JSON.stringify({ error: `No app found with slug "${slug}"` }) }
    }
    return { result: JSON.stringify(financialFields(app)) }
  },

  compare_apps(args) {
    const slugs = args.slugs as string[]
    const results = slugs.slice(0, 3).map(slug => {
      const app = getAppBySlug(slug)
      if (!app) return { slug, error: `Not found` }
      return compareFields(app)
    })
    return { result: JSON.stringify({ comparison: results }) }
  },

  list_funding(args) {
    let funding = getOpenFunding()
    const condition = args.condition as string | undefined
    if (condition) {
      funding = funding.filter((f: Funding) =>
        f.condition_tags?.includes(condition),
      )
    }
    return {
      result: JSON.stringify({
        count: funding.length,
        funding: funding.map(summariseFunding),
      }),
    }
  },

  get_funding_detail(args) {
    const id = args.funding_id as string
    const all = getAllFunding()
    const f = all.find((item: Funding) => item.id === id)
    if (!f) {
      return { result: JSON.stringify({ error: `No funding found with ID "${id}"` }) }
    }
    return { result: JSON.stringify(f) }
  },

  get_condition_overview(args) {
    const conditionId = args.condition_id as string
    const conditions = getAllConditions()
    const condition = conditions.find((c: { id: string }) => c.id === conditionId)
    if (!condition) {
      return { result: JSON.stringify({ error: `Unknown condition "${conditionId}"` }) }
    }
    const apps = getAppsByCondition(conditionId)
    const areas = getConditionAreas()
    const area = areas.find(a => a.id === conditionId)
    return {
      result: JSON.stringify({
        condition: {
          id: condition.id,
          label: (condition as Record<string, unknown>).label,
          description: (condition as Record<string, unknown>).description,
          app_count: area?.count ?? apps.length,
        },
        apps: apps.map(summariseApp),
      }),
    }
  },

  get_enums(args) {
    const category = args.category as string
    if (category === 'all') {
      return { result: JSON.stringify(enumsData) }
    }
    const mapping: Record<string, unknown> = {
      pricing_models: {
        models: (enumsData as Record<string, unknown>).pricing_models,
        labels: (enumsData as Record<string, unknown>).pricing_labels,
      },
      maturity_levels: {
        levels: (enumsData as Record<string, unknown>).maturity_levels,
        labels: (enumsData as Record<string, unknown>).maturity_labels,
      },
      evidence_strength: {
        levels: (enumsData as Record<string, unknown>).evidence_strength,
        labels: (enumsData as Record<string, unknown>).evidence_labels,
      },
      supervision_models: {
        models: (enumsData as Record<string, unknown>).supervision_models,
        labels: (enumsData as Record<string, unknown>).supervision_labels,
      },
      dtac_statuses: {
        statuses: (enumsData as Record<string, unknown>).dtac_statuses,
        labels: (enumsData as Record<string, unknown>).dtac_labels,
      },
      referral_modes: {
        modes: (enumsData as Record<string, unknown>).referral_modes,
        labels: (enumsData as Record<string, unknown>).referral_labels,
      },
      onboarding_intensity: {
        levels: (enumsData as Record<string, unknown>).onboarding_intensity,
        labels: (enumsData as Record<string, unknown>).onboarding_labels,
      },
    }
    const data = mapping[category]
    if (!data) {
      return { result: JSON.stringify({ error: `Unknown category "${category}"` }) }
    }
    return { result: JSON.stringify(data) }
  },
}

export function executeTool(name: string, args: Record<string, unknown>): ToolResult {
  const executor = executors[name]
  if (!executor) {
    return { result: JSON.stringify({ error: `Unknown tool "${name}"` }) }
  }
  return executor(args)
}
