import {
  APPS,
  AREA_FUNDERS,
  AREA_MAP,
  AREA_SYNONYMS,
  CONDITION_MAP,
  CONDITION_SYNONYMS,
  CONDITIONS,
  DTX_SYNONYMS,
  SEARCH_MODE,
  type ConditionArea,
  type SearchMode,
} from './data'

type SearchContext = {
  target: string
  conditionId: string
  condition: string
  areaKey: ConditionArea
  area: string
  isApp: boolean
}

/** Resolve the target/condition/area context from the selection, shared by both prompts. */
function resolveContext(mode: SearchMode, selection: string): SearchContext {
  if (mode === SEARCH_MODE.APP) {
    const app = APPS.find(a => a.id === selection)
    const areaKey = app?.area ?? 'Respiratory'
    return {
      target: app?.label ?? selection,
      conditionId: app?.condition ?? '',
      condition: CONDITION_MAP[app?.condition ?? ''] ?? 'digital health',
      areaKey,
      area: AREA_MAP[areaKey],
      isApp: true,
    }
  }
  const cond = CONDITIONS.find(c => c.id === selection)
  const areaKey = cond?.area ?? 'Respiratory'
  return {
    target: cond?.label ?? selection,
    conditionId: cond?.id ?? '',
    condition: CONDITION_MAP[cond?.id ?? ''] ?? 'digital health',
    areaKey,
    area: AREA_MAP[areaKey],
    isApp: false,
  }
}

/**
 * Build the single-turn system prompt. It carries the search context, the task,
 * the strict JSON output schema, and the match_type rules. The model must return
 * ONLY a JSON array; scoring happens in code.
 */
export function buildSystemPrompt(
  region: string,
  mode: SearchMode,
  selection: string,
): string {
  const { target, conditionId, condition, areaKey, area, isApp } = resolveContext(mode, selection)
  const conditionSynonyms = CONDITION_SYNONYMS[conditionId] ?? condition
  const areaSynonyms = AREA_SYNONYMS[areaKey]

  return `You are an NHS funding research assistant. Find current funding opportunities for digital therapeutics (DTx) in the NHS.

PERSPECTIVE: The user is an NHS commissioning / procuring organisation (an ICB, provider trust, Primary Care Network (PCN), NHS trust, foundation trust, CIC, or community provider) seeking funding to ADOPT, COMMISSION, or DEPLOY an existing DTx into routine care — NOT a developer or SME seeking R&D, product-development, or research grants, and NOT an academic seeking research funding.
INCLUDE: NHS commissioning/transformation/service-development budgets, adoption & spread funds, prevention/long-term-conditions budgets, ICB/regional allocations, and adoption programmes where an NHS commissioner or provider can be the applicant or deployment partner.
EXCLUDE: funds where ONLY the technology developer/SME or an academic institution can apply (e.g. SBRI Healthcare competitions, Innovate UK Smart grants, NIHR i4i/research product-development grants), UNLESS a commissioning/providing NHS organisation can itself be the applicant or named deployment/adoption partner.

SEARCH CONTEXT:
- Region: ${region}
- ${isApp ? `Specific DTx app: ${target}` : `Condition: ${target}`}
- Condition: ${condition}
- Condition area: ${area}
- Synonyms to search: ${DTX_SYNONYMS}, ${conditionSynonyms}, ${areaSynonyms}

TASK: Search for NHS funding programmes, grants, innovation funds, and commissioning budgets that could fund ${isApp ? `deployment of ${target}` : `digital therapeutics for ${condition}`}. Include national funds and any specific to ${region}.

Return ONLY a JSON array. No markdown, no preamble, no backticks. Each object:
{
  "fund_name": "string",
  "provider": "string (e.g. NHSE, NIHR, Innovate UK, AHSN, specific ICB)",
  "eligibility_summary": "string (1-2 sentences)",
  "amount_range": "string or null if unknown",
  "deadline": "string or null if ongoing/unknown",
  "region_scope": "National OR specific region name",
  "match_type": "dtx_specific|condition|condition_area|generic_digital_health",
  "match_rationale": "string (1 sentence explaining why this matches)",
  "applicant_fit": "commissioner_eligible|adoption_partner|developer_or_academic_only|unclear"
}

MATCH_TYPE rules:
- dtx_specific: fund explicitly names ${isApp ? target : 'specific DTx products for ' + condition}
- condition: fund targets ${condition} or closely related conditions
- condition_area: fund targets ${area} health broadly
- generic_digital_health: fund supports digital health/innovation generally

APPLICANT_FIT rules (be honest — this is used to filter out funds the user cannot access):
- commissioner_eligible: an NHS commissioner/provider (ICB, trust, foundation trust, PCN, CIC, community provider) can directly apply for or draw down this funding
- adoption_partner: the NHS organisation can access it as a named deployment/adoption partner (often alongside a supplier)
- developer_or_academic_only: ONLY the technology developer/SME or an academic institution can apply
- unclear: eligibility cannot be determined from available information

Return as many genuinely relevant results as you can find, ordered by relevance — aim for 8-15 and do NOT stop early if more exist. Prefer breadth: include national funds, regional/ICB funds, and condition-specific programmes, across all four match_type levels — but always apply the INCLUDE/EXCLUDE rules above (omit developer/academic-only funds the user could not access). Return [] only if you truly find nothing.`
}

/**
 * Build the single user message. Nudges broad search coverage (including
 * condition-area-specific funders) and reiterates the JSON-only output contract.
 */
export function buildUserMessage(region: string, mode: SearchMode, selection: string): string {
  const { areaKey } = resolveContext(mode, selection)
  const areaFunders = AREA_FUNDERS[areaKey].join('; ')

  return `Find current NHS funding opportunities the user's organisation could actually apply for or use as a commissioner/provider. Search broadly across commissioner-accessible national routes: NHS England transformation and service-development funds, adoption & spread funds, AHSN / Health Innovation Network adoption support, prevention and long-term-conditions budgets, and ICB / regional allocations for ${region}. Also check these condition-specific routes: ${areaFunders}. Only include developer-facing competitions (e.g. SBRI Healthcare, Innovate UK Smart, NIHR i4i/research grants) if a commissioning or providing NHS organisation can itself be the applicant or a named deployment/adoption partner. Aim for 8-15 results and do not stop early if more exist. After searching, output ONLY the JSON array described in the system prompt — no commentary before or after.`
}
