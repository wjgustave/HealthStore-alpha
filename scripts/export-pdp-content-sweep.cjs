/**
 * Export PDP-facing content from a product JSON to CSV for content design sweeps.
 *
 * Usage:
 *   node scripts/export-pdp-content-sweep.cjs
 *   node scripts/export-pdp-content-sweep.cjs --slug=luscii
 *   node scripts/export-pdp-content-sweep.cjs --slug=mycopd --out=exports
 *
 * Writes (default out dir: exports/):
 *   pdp-content-sweep-{slug}.csv
 *   pdp-iteration-log-{slug}.csv
 *
 * Optional .xlsx: open Excel → import `pdp-content-sweep-*.csv` as sheet 1 and
 * `pdp-iteration-log-*.csv` as sheet 2 (or merge workbooks). No binary export in-repo.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

const HEADER = ['page_slug', 'section', 'block_id', 'field_label', 'source_key', 'current_text', 'proposed_text', 'notes']

/** Mirrors lib/data.ts badge label maps */
const supervisionLabels = {
  self_management_only: 'Self-management',
  guided_self_help: 'Guided self-help',
  non_continuous_review: 'Non-continuous review',
  active_remote_management: 'Remote management',
}
const maturityLabels = {
  scaled: 'Established',
  multi_site_live: 'Established',
  limited_live: 'Emerging',
  pilot: 'Pilot',
}
const effortLabels = { low: 'Low', medium: 'Medium', high: 'High' }
const evidenceLabels = { strong: 'Strong', moderate: 'Moderate', low: 'Low' }
const dtacLabels = {
  passed: 'Completed',
  passed_refresh_required: 'Completed – refresh required',
  required_not_confirmed: 'Not confirmed',
  not_applicable: 'N/A',
}

const CONDITION_TAG_LABELS = {
  copd: 'COPD',
  insomnia: 'Insomnia',
  weight_management: 'Weight management',
  msk: 'MSK',
  eating_disorders: 'Eating disorders',
  cardiac_rehab: 'Cardiac rehab',
}

const UI_STATIC = {
  caseStudiesCommissionerNote:
    'Commissioner note: Case studies are illustrative local reports and may not meet the same standard as peer-reviewed trials. Use alongside the Clinical evidence section.',
  indicativeFinancialDisclaimer:
    'These are directional indicators only. Local finance modelling using actual baseline activity, population size and pathway design is required before any business case submission.',
  relatedFundingEmpty:
    'No commissioner-facing cash or adoption-support schemes are linked to this product profile (supplier R&D routes and NICE reporting obligations are listed elsewhere). Browse the funding directory for wider opportunities.',
  freeTierWarning:
    'Free-tier access typically does not include a full supplier service wrap. The ICB should expect to provide local onboarding, training and support independently unless otherwise agreed in contract.',
}

const DEVICE_CLASS_IIA_SUMMARY = 'What is a Class IIa device'
const DEVICE_CLASS_IIA_BODY =
  'Software that actively informs clinical decision-making: such as diagnostic algorithms. Because misperformance could lead to patient harm, a UK approved body must assess the product before market placement, requiring clinical evidence and ongoing post-market surveillance.'
const DEVICE_CLASS_I_SUMMARY = 'What is a Class I device'
const DEVICE_CLASS_I_BODY =
  "Software that supports clinical decisions but doesn't directly drive them: for example, a tool that records or displays patient data. It's low-risk, so manufacturer can self-certify compliance. No UK approved body assessment is required, though MHRA registration and technical documentation are still mandatory."

function getDeviceClassExplainer(deviceClass) {
  const s = String(deviceClass ?? '').trim()
  if (!s) return null
  if (/class\s*iia/i.test(s)) return { summary: DEVICE_CLASS_IIA_SUMMARY, body: DEVICE_CLASS_IIA_BODY }
  if (/\bclass\s+i\b/i.test(s)) return { summary: DEVICE_CLASS_I_SUMMARY, body: DEVICE_CLASS_I_BODY }
  return null
}

function parseArgs(argv) {
  let slug = 'luscii'
  let outDir = 'exports'
  for (const a of argv) {
    if (a.startsWith('--slug=')) slug = a.slice('--slug='.length).trim()
    else if (a.startsWith('--out=')) outDir = a.slice('--out='.length).trim()
  }
  return { slug, outDir: path.isAbsolute(outDir) ? outDir : path.join(ROOT, outDir) }
}

function csvEscape(cell) {
  const s = cell == null ? '' : String(cell)
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function row(slug, section, blockId, fieldLabel, sourceKey, currentText, notes = '') {
  return [slug, section, blockId, fieldLabel, sourceKey, currentText, '', notes].map(csvEscape).join(',')
}

function yn(bool) {
  if (bool === true) return 'Yes'
  if (bool === false) return 'No'
  return 'Not confirmed'
}

function formatPricingModel(raw, pricingLabels) {
  if (!raw || !String(raw).trim()) return 'Information not available'
  const key = String(raw).trim()
  if (pricingLabels[key]) return pricingLabels[key]
  return key
}

function formatPricingConfidence(raw) {
  if (!raw) return ''
  const map = {
    not_stated: 'Not stated',
    supplier_reported: 'Supplier-reported',
    confirmed: 'Confirmed',
    indicative: 'Indicative',
  }
  return map[raw] ?? String(raw).replace(/_/g, ' ')
}

function val(v) {
  if (v == null) return ''
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  return String(v)
}

function nationalPriceLine(app) {
  if (app.national_price_available === true) return 'Available'
  if (app.national_price_available === false) return 'Not available'
  return ''
}

function procurementMerged(app) {
  return app.procurement_notes ?? app.contract_note ?? ''
}

function serviceWrapDetail(app) {
  return app.service_wrap_description ?? app.service_wrap_note ?? ''
}

function walkEvidenceStudy(study) {
  const keys = [
    'type',
    'type_label',
    'ref',
    'authors',
    'journal',
    'year',
    'month',
    'volume_issue',
    'doi',
    'pmid',
    'pmc',
    'trial_reg',
    'n',
    'setting',
    'key_results',
    'study_limitation',
    'data_quality_note',
    'source_label',
    'source_url',
    'url_full_text',
    'url_doi',
    'url_pubmed',
    'url_pmc',
    'url_evidence',
    'url_trial_reg',
    'url_case_study',
    'peer_reviewed',
    'coi',
    'data_quality_flag',
    'coi_note',
  ]
  const out = []
  const id = study.id || 'unknown'
  for (const k of keys) {
    if (!Object.prototype.hasOwnProperty.call(study, k)) continue
    let cur = study[k]
    if (cur == null) continue
    if (typeof cur === 'string' && cur.trim() === '') continue
    if (typeof cur === 'boolean') cur = cur ? 'true' : 'false'
    else if (typeof cur === 'number' && k === 'n') cur = cur.toLocaleString('en-GB')
    else if (typeof cur === 'number') cur = String(cur)
    out.push({ sub: k, text: String(cur) })
  }
  return { id, fields: out }
}

function buildRows(slug, app, pricingLabels) {
  const rows = []

  // --- Product summary (hero) ---
  const hero = 'Product summary (hero)'
  rows.push(row(slug, hero, 'hero', 'App name', 'app_name', val(app.app_name)))
  rows.push(row(slug, hero, 'hero', 'Supplier name', 'supplier_name', val(app.supplier_name)))
  rows.push(row(slug, hero, 'hero', 'One-line value proposition', 'one_line_value_proposition', val(app.one_line_value_proposition)))
  if (Array.isArray(app.condition_tags) && app.condition_tags.length) {
    const raw = app.condition_tags.join(', ')
    const display = app.condition_tags.map((t) => CONDITION_TAG_LABELS[t] ?? t).join(', ')
    rows.push(row(slug, hero, 'hero', 'Condition tags (JSON slugs)', 'condition_tags', raw))
    rows.push(
      row(
        slug,
        hero,
        'hero',
        'Condition tags (UI labels)',
        'condition_tags__display',
        display,
        'Derived: Badges.tsx ConditionTag',
      ),
    )
  }
  rows.push(row(slug, hero, 'hero', 'Maturity level (JSON)', 'maturity_level', val(app.maturity_level)))
  rows.push(
    row(
      slug,
      hero,
      'hero',
      'Maturity (UI badge)',
      'maturity_level__display',
      maturityLabels[app.maturity_level] ?? app.maturity_level ?? '',
      'Derived: MaturityBadge',
    ),
  )
  rows.push(row(slug, hero, 'hero', 'Supervision model (JSON)', 'supervision_model', val(app.supervision_model)))
  rows.push(
    row(
      slug,
      hero,
      'hero',
      'Supervision (UI badge)',
      'supervision_model__display',
      supervisionLabels[app.supervision_model] ?? app.supervision_model ?? '',
      'Derived: SupervisionBadge',
    ),
  )
  if (app.content_confidence && app.content_confidence !== 'Confirmed') {
    rows.push(row(slug, hero, 'hero', 'Content confidence (badge)', 'content_confidence', val(app.content_confidence)))
  }

  // --- Why it matters locally ---
  rows.push(
    row(
      slug,
      'Why it matters locally',
      'why_it_matters',
      'Body',
      'why_it_matters_locally',
      val(app.why_it_matters_locally),
    ),
  )
  if (app.sustainability_highlight) {
    rows.push(
      row(
        slug,
        'Why it matters locally',
        'why_it_matters',
        'Sustainability highlight',
        'sustainability_highlight',
        val(app.sustainability_highlight),
      ),
    )
  }

  // --- Context of use ---
  const ctx = app.context_of_use
  if (ctx) {
    const sec = 'Context of use'
    const bid = 'context_of_use'
    rows.push(row(slug, sec, bid, 'Target population', 'context_of_use.population', val(ctx.population)))
    rows.push(
      row(
        slug,
        sec,
        bid,
        'Clinical pathways',
        'context_of_use.pathways',
        Array.isArray(ctx.pathways) ? ctx.pathways.join(', ') : val(ctx.pathways),
      ),
    )
    rows.push(
      row(
        slug,
        sec,
        bid,
        'Care settings',
        'context_of_use.care_settings',
        Array.isArray(ctx.care_settings) ? ctx.care_settings.join(', ') : val(ctx.care_settings),
      ),
    )
    rows.push(
      row(
        slug,
        sec,
        bid,
        'Therapeutic purpose',
        'context_of_use.therapeutic_purpose',
        val(ctx.therapeutic_purpose),
      ),
    )
    rows.push(row(slug, sec, bid, 'HCP involvement', 'context_of_use.hcp_involvement', val(ctx.hcp_involvement)))
    rows.push(row(slug, sec, bid, 'NICE scope', 'context_of_use.nice_scope', val(ctx.nice_scope)))
  }

  // --- Scale and maturity ---
  const scaleSec = 'Scale and maturity'
  rows.push(
    row(
      slug,
      scaleSec,
      'scale_maturity',
      'Evidence strength (JSON)',
      'evidence_strength',
      val(app.evidence_strength),
    ),
  )
  rows.push(
    row(
      slug,
      scaleSec,
      'scale_maturity',
      'Evidence strength (UI badge)',
      'evidence_strength__display',
      evidenceLabels[app.evidence_strength] ?? app.evidence_strength ?? '',
      'Derived: EvidenceBadge',
    ),
  )
  rows.push(
    row(
      slug,
      scaleSec,
      'scale_maturity',
      'Evidence overview',
      'evidence_strength_rationale',
      val(app.evidence_strength_rationale),
    ),
  )
  const namedSites = Array.isArray(app.named_sites) ? app.named_sites.filter((s) => s && String(s.name || '').trim()) : []
  if (namedSites.length) {
    namedSites.forEach((s, i) => {
      const id = s.id || `named_sites[${i}]`
      rows.push(row(slug, scaleSec, `live_site_${id}`, 'Live site name', `named_sites[${i}].name`, val(s.name)))
      rows.push(row(slug, scaleSec, `live_site_${id}`, 'Site status', `named_sites[${i}].status`, val(s.status)))
    })
  } else if (app.live_sites && String(app.live_sites).trim()) {
    rows.push(row(slug, scaleSec, 'scale_maturity', 'Live sites (legacy string)', 'live_sites', val(app.live_sites)))
  }
  rows.push(
    row(
      slug,
      scaleSec,
      'scale_maturity',
      'Population reach',
      'patients_covered_note',
      val(app.patients_covered_note),
    ),
  )

  const deployments = app.deployments
  if (Array.isArray(deployments) && deployments.length && !namedSites.length) {
    deployments.forEach((d, i) => {
      const bid = `deployment_${i}`
      rows.push(row(slug, scaleSec, bid, 'Organisation', `deployments[${i}].organisation_name`, val(d.organisation_name)))
      const bits = [d.region, d.country && d.country !== 'United Kingdom' ? d.country : null, d.patient_count ? `${d.patient_count} patients` : null]
        .filter(Boolean)
        .join(' · ')
      rows.push(row(slug, scaleSec, bid, 'Region / scale line', `deployments[${i}]_meta`, bits))
      if (d.deployment_scope) rows.push(row(slug, scaleSec, bid, 'Scope', `deployments[${i}].deployment_scope`, val(d.deployment_scope)))
      if (d.attribution_note) rows.push(row(slug, scaleSec, bid, 'Attribution note', `deployments[${i}].attribution_note`, val(d.attribution_note)))
    })
  }

  // --- What it takes locally ---
  const witSec = 'What it takes locally'
  const witId = 'what_it_takes'
  if (app.local_wraparound) {
    rows.push(row(slug, witSec, witId, 'Local effort (JSON)', 'local_wraparound', val(app.local_wraparound)))
    rows.push(
      row(
        slug,
        witSec,
        witId,
        'Local effort (UI badge)',
        'local_wraparound__display',
        effortLabels[app.local_wraparound] ?? app.local_wraparound ?? '',
        'Derived: EffortBadge',
      ),
    )
  }
  rows.push(
    row(slug, witSec, witId, 'Local effort detail', 'local_wraparound_detail', val(app.local_wraparound_detail)),
  )
  rows.push(row(slug, witSec, witId, 'Onboarding model (raw JSON)', 'onboarding_model', val(app.onboarding_model)))
  rows.push(
    row(
      slug,
      witSec,
      witId,
      'Onboarding model (UI: underscores → spaces)',
      'onboarding_model__display_hint',
      String(app.onboarding_model || '').replace(/_/g, ' ') || '',
      'Rendered in WhatItTakesLocallySection',
    ),
  )
  rows.push(row(slug, witSec, witId, 'Onboarding detail', 'onboarding_detail', val(app.onboarding_detail)))
  const trainingLine = `${app.training_required ? 'Required. ' : ''}${app.training_note ?? ''}`.trim()
  if (trainingLine) {
    rows.push(row(slug, witSec, witId, 'Training (rendered line)', 'training_composite', trainingLine))
  }
  rows.push(row(slug, witSec, witId, 'Training required (JSON)', 'training_required', val(app.training_required)))
  rows.push(row(slug, witSec, witId, 'Training note', 'training_note', val(app.training_note)))
  rows.push(row(slug, witSec, witId, 'Supplier wrap', 'supplier_wrap', val(app.supplier_wrap)))
  const swLine = `${app.service_wrap_included === true ? 'Included in offer. ' : app.service_wrap_included === false ? 'Not included by default. ' : ''}${app.service_wrap_note ?? ''}`.trim()
  if (swLine || app.service_wrap_included !== undefined) {
    rows.push(row(slug, witSec, witId, 'Service wrap (rendered block)', 'service_wrap_block', swLine))
  }
  rows.push(row(slug, witSec, witId, 'Monitoring', 'monitoring_note', val(app.monitoring_note)))
  rows.push(row(slug, witSec, witId, 'Escalation', 'escalation_note', val(app.escalation_note)))
  rows.push(row(slug, witSec, witId, 'Operating hours caveat', 'operating_hours_caveat', val(app.operating_hours_caveat)))
  const prereq = app.implementation_prerequisites
  if (Array.isArray(prereq)) {
    prereq.forEach((p, i) => {
      rows.push(row(slug, witSec, witId, `Prerequisite ${i + 1}`, `implementation_prerequisites[${i}]`, val(p)))
    })
  }

  // --- Expected impact and case studies ---
  const impSec = 'Expected impact and case studies'
  rows.push(
    row(slug, impSec, 'impact', 'Expected benefit (body)', 'expected_benefit_note', val(app.expected_benefit_note)),
  )
  if (app.case_studies?.length) {
    rows.push(
      row(
        slug,
        impSec,
        'impact',
        'Commissioner note (banner)',
        'ui_static:case_studies_banner',
        UI_STATIC.caseStudiesCommissionerNote,
        'Static UI in ImpactAndCaseStudiesSection',
      ),
    )
    app.case_studies.forEach((cs, i) => {
      const b = `case_study_${i}`
      rows.push(row(slug, impSec, b, 'Title', `case_studies[${i}].title`, val(cs.title)))
      rows.push(row(slug, impSec, b, 'Setting', `case_studies[${i}].setting`, val(cs.setting)))
      rows.push(row(slug, impSec, b, 'Outcome', `case_studies[${i}].outcome`, val(cs.outcome)))
      rows.push(row(slug, impSec, b, 'Caveat', `case_studies[${i}].caveat`, val(cs.caveat)))
      rows.push(row(slug, impSec, b, 'Source', `case_studies[${i}].source`, val(cs.source)))
    })
  }

  // --- Clinical evidence ---
  const evSec = 'Clinical evidence'
  rows.push(row(slug, evSec, 'clinical_evidence', 'Summary paragraph', 'evidence_summary', val(app.evidence_summary)))
  const detailed = app.clinical_evidence_detailed
  if (Array.isArray(detailed)) {
    const rcts = detailed.filter((s) => s.type === 'RCT')
    const observational = detailed.filter((s) => ['observational', 'real_world', 'service_eval'].includes(s.type))
    const niceAndImpl = detailed.filter((s) =>
      ['nice_assessment', 'implementation_science', 'grey_lit', 'evidence_gap'].includes(s.type),
    )
    const runGroup = (label, list) => {
      list.forEach((study) => {
        const { id, fields } = walkEvidenceStudy(study)
        const block = `evidence_${id}`
        rows.push(
          row(
            slug,
            evSec,
            block,
            `Group: ${label}`,
            `_group:${label}`,
            '',
            `Study id: ${id}`,
          ),
        )
        for (const { sub, text } of fields) {
          rows.push(row(slug, evSec, block, sub.replace(/_/g, ' '), `clinical_evidence_detailed[${id}].${sub}`, text))
        }
      })
    }
    runGroup('RCT', rcts)
    runGroup('Real-world / observational / service evaluation', observational)
    runGroup('NICE / implementation / grey literature / evidence gap', niceAndImpl)
  }

  // --- NICE guidance expander ---
  const niceSec = 'NICE guidance'
  ;(app.nice_guidance_refs || []).forEach((r, i) => {
    const b = `nice_ref_${i}`
    rows.push(row(slug, niceSec, b, 'Reference title', `nice_guidance_refs[${i}].ref`, val(r.ref)))
    rows.push(row(slug, niceSec, b, 'Date', `nice_guidance_refs[${i}].date`, val(r.date)))
    rows.push(row(slug, niceSec, b, 'Note', `nice_guidance_refs[${i}].note`, val(r.note)))
    rows.push(row(slug, niceSec, b, 'URL', `nice_guidance_refs[${i}].url`, val(r.url)))
    rows.push(row(slug, niceSec, b, 'Type (badge)', `nice_guidance_refs[${i}].type`, val(r.type)))
  })

  // --- Data quality flags ---
  if (app.contradictory_evidence?.length) {
    const dqSec = 'Data quality flags'
    app.contradictory_evidence.forEach((c, i) => {
      const b = `dq_${i}`
      rows.push(row(slug, dqSec, b, 'Domain', `contradictory_evidence[${i}].domain`, val(c.domain)))
      rows.push(row(slug, dqSec, b, 'Company claim', `contradictory_evidence[${i}].claim_a`, val(c.claim_a)))
      rows.push(row(slug, dqSec, b, 'Issue', `contradictory_evidence[${i}].claim_b`, val(c.claim_b)))
      rows.push(
        row(
          slug,
          dqSec,
          b,
          'Commissioner action',
          `contradictory_evidence[${i}].commissioner_impact`,
          val(c.commissioner_impact),
        ),
      )
    })
  }

  // --- Demo access ---
  const demoSec = 'Demo access'
  rows.push(row(slug, demoSec, 'demo', 'Demo notes', 'demo_notes', val(app.demo_notes)))
  ;(app.demo_variants || []).forEach((d, i) => {
    rows.push(row(slug, demoSec, 'demo', `Link label ${i + 1}`, `demo_variants[${i}].label`, val(d.label)))
    rows.push(row(slug, demoSec, 'demo', `URL ${i + 1}`, `demo_variants[${i}].url`, val(d.url)))
  })

  // --- NHS and care system integrations ---
  const intSec = 'NHS and care system integrations'
  const intB = 'integrations_table'
  const ti = app.technical_integrations
  if (ti) {
    rows.push(row(slug, intSec, intB, 'FHIR', 'technical_integrations.fhir', val(ti.fhir)))
    rows.push(row(slug, intSec, intB, 'EMIS', 'technical_integrations.emis', val(ti.emis)))
  }
  rows.push(row(slug, intSec, intB, 'NHS Login (table)', 'nhs_login_integration_display', yn(app.nhs_login_integration)))
  rows.push(row(slug, intSec, intB, 'NHS Notify (table)', 'nhs_notify_integration_display', yn(app.nhs_notify_integration)))
  if (ti) {
    rows.push(
      row(
        slug,
        intSec,
        intB,
        'Population health dashboard',
        'technical_integrations.population_health_dashboard',
        ti.population_health_dashboard ? 'Yes' : 'No',
      ),
    )
    rows.push(row(slug, intSec, intB, 'Device integration', 'technical_integrations.device_integration', val(ti.device_integration)))
    rows.push(
      row(
        slug,
        intSec,
        intB,
        'Languages',
        'technical_integrations.languages',
        Array.isArray(ti.languages) ? ti.languages.join(', ') : val(ti.languages),
      ),
    )
    rows.push(row(slug, intSec, intB, 'Data hosting', 'technical_integrations.data_hosting', val(ti.data_hosting)))
  }
  rows.push(row(slug, intSec, intB, 'NHS App integration (JSON)', 'nhs_app_integration', val(app.nhs_app_integration)))
  rows.push(row(slug, intSec, intB, 'Interop snapshot: show NHS App', 'interop_snapshot_show_nhs_app', val(app.interop_snapshot_show_nhs_app)))

  // --- Commissioning snapshot (data inputs) ---
  const snapSec = 'Commissioning snapshot (card inputs)'
  rows.push(row(slug, snapSec, 'snapshot', 'live_icbs (compare/snippets)', 'live_icbs', val(app.live_icbs), 'Not rendered in Scale section on PDP'))
  rows.push(row(slug, snapSec, 'snapshot', 'linked_funding_ids', 'linked_funding_ids', (app.linked_funding_ids || []).join(', ') || '(none)'))
  rows.push(row(slug, snapSec, 'snapshot', 'funding_ids (legacy)', 'funding_ids', (app.funding_ids || []).join(', ') || '(none)'))

  // --- Commercial model and cost ---
  const comSec = 'Commercial model and cost'
  const comB = 'commercial'
  rows.push(
    row(
      slug,
      comSec,
      comB,
      'Pricing model',
      'pricing_model',
      formatPricingModel(app.pricing_model, pricingLabels),
    ),
  )
  rows.push(row(slug, comSec, comB, 'National price', 'national_price_available', nationalPriceLine(app)))
  let priceBlock = val(app.indicative_price_text)
  const pc = formatPricingConfidence(app.pricing_confidence)
  if (pc) priceBlock += (priceBlock ? '\n\n' : '') + `Pricing confidence: ${pc}`
  rows.push(row(slug, comSec, comB, 'Indicative price (+ confidence subline)', 'indicative_price_text', priceBlock))
  rows.push(row(slug, comSec, comB, 'Service wrap included', 'service_wrap_included', yn(app.service_wrap_included)))
  rows.push(row(slug, comSec, comB, 'Service wrap details', 'service_wrap_detail', serviceWrapDetail(app)))
  rows.push(row(slug, comSec, comB, 'Procurement / contract notes', 'procurement_notes', procurementMerged(app)))
  if (app.nhse_125k_note) {
    rows.push(row(slug, comSec, comB, 'NHSE £125k funding note', 'nhse_125k_note', val(app.nhse_125k_note)))
  }
  rows.push(row(slug, comSec, comB, 'Monitoring / ongoing service model', 'monitoring_model', val(app.monitoring_model)))
  if (app.free_offer_flag === true) {
    rows.push(
      row(
        slug,
        comSec,
        comB,
        'Free-tier warning (alert)',
        'ui_static:free_tier_alert',
        UI_STATIC.freeTierWarning,
        'Shown when free_offer_flag is true',
      ),
    )
  }

  // --- Indicative financial context ---
  const finSec = 'Indicative financial context'
  const finB = 'financial'
  rows.push(row(slug, finSec, finB, 'Expected benefit', 'expected_benefit_note', val(app.expected_benefit_note)))
  rows.push(row(slug, finSec, finB, 'Tariff considerations', 'tariff_considerations', val(app.tariff_considerations)))
  rows.push(row(slug, finSec, finB, 'Provider income impact', 'provider_income_note', val(app.provider_income_note)))
  rows.push(row(slug, finSec, finB, 'ROI note', 'roi_note', val(app.roi_note)))
  rows.push(
    row(
      slug,
      finSec,
      finB,
      'Minimum conditions for success',
      'minimum_conditions_for_success',
      val(app.minimum_conditions_for_success),
    ),
  )
  rows.push(
    row(
      slug,
      finSec,
      finB,
      'Directional disclaimer (callout)',
      'ui_static:indicative_financial_disclaimer',
      UI_STATIC.indicativeFinancialDisclaimer,
      'Static UI below tariff section',
    ),
  )

  // --- Related funding ---
  const fundSec = 'Related funding opportunities'
  const linked = app.linked_funding_ids ?? app.funding_ids ?? []
  const fundingPath = path.join(ROOT, 'content/funding/funding.json')
  let commissionerFacing = []
  if (fs.existsSync(fundingPath)) {
    const fundingData = JSON.parse(fs.readFileSync(fundingPath, 'utf8'))
    const list = Array.isArray(fundingData)
      ? fundingData
      : fundingData.funding || fundingData.items || []
    const arr = Array.isArray(list) ? list : []
    commissionerFacing = arr.filter(
      (f) => linked.includes(f.id) && f.commissioner_display === 'funding_and_adoption',
    )
  }
  if (!commissionerFacing.length) {
    rows.push(
      row(
        slug,
        fundSec,
        'related_funding',
        'Empty state copy',
        'ui_static:related_funding_empty',
        UI_STATIC.relatedFundingEmpty,
        'Shown when no linked commissioner-facing funding',
      ),
    )
  } else {
    commissionerFacing.forEach((f, i) => {
      const b = `funding_${f.id || i}`
      rows.push(row(slug, fundSec, b, 'Title', `funding[${f.id}].title`, val(f.title)))
      rows.push(row(slug, fundSec, b, 'Description', `funding[${f.id}].description`, val(f.description)))
      rows.push(row(slug, fundSec, b, 'Status', `funding[${f.id}].status`, val(f.status)))
      if (f.total_value) rows.push(row(slug, fundSec, b, 'Value', `funding[${f.id}].total_value`, val(f.total_value)))
      if (f.external_url) rows.push(row(slug, fundSec, b, 'External URL', `funding[${f.id}].external_url`, val(f.external_url)))
    })
  }

  // --- Express interest callout ---
  const contactName = app.supplier_contact_name ?? app.supplier_name
  rows.push(
    row(
      slug,
      'Express interest callout',
      'express_interest',
      'Body (rendered)',
      'express_interest_body_rendered',
      `Contact ${contactName} to discuss deployment in your ICB.`,
      'Rendered in page.tsx',
    ),
  )
  rows.push(
    row(
      slug,
      'Express interest callout',
      'express_interest',
      'Heading (static)',
      'ui_static:express_interest_heading',
      'Express interest',
    ),
  )

  // --- Sidebar: Quick facts ---
  const qf = 'Sidebar — Quick facts'
  rows.push(
    row(
      slug,
      qf,
      'quick_facts',
      'Maturity (JSON)',
      'sidebar.maturity_level',
      val(app.maturity_level),
      'Repeated in Quick facts card',
    ),
  )
  rows.push(
    row(
      slug,
      qf,
      'quick_facts',
      'Maturity (UI badge)',
      'sidebar.maturity_level__display',
      maturityLabels[app.maturity_level] ?? app.maturity_level ?? '',
      'Derived: MaturityBadge',
    ),
  )
  rows.push(row(slug, qf, 'quick_facts', 'Local effort (JSON)', 'sidebar.local_wraparound', val(app.local_wraparound)))
  rows.push(
    row(
      slug,
      qf,
      'quick_facts',
      'Local effort (UI badge)',
      'sidebar.local_wraparound__display',
      effortLabels[app.local_wraparound] ?? app.local_wraparound ?? '',
      'Derived: EffortBadge',
    ),
  )
  rows.push(row(slug, qf, 'quick_facts', 'Device class', 'device_class', val(app.device_class)))
  if (app.device_class_note) {
    rows.push(row(slug, qf, 'quick_facts', 'Device class note', 'device_class_note', val(app.device_class_note)))
  }
  const expl = getDeviceClassExplainer(app.device_class)
  if (expl) {
    rows.push(row(slug, qf, 'quick_facts', 'Device class explainer — summary', 'ui_static:device_class_summary', expl.summary))
    rows.push(row(slug, qf, 'quick_facts', 'Device class explainer — body', 'ui_static:device_class_body', expl.body))
  }
  rows.push(row(slug, qf, 'quick_facts', 'Supervision model (JSON)', 'sidebar.supervision_model', val(app.supervision_model)))
  rows.push(
    row(
      slug,
      qf,
      'quick_facts',
      'Supervision (UI badge)',
      'sidebar.supervision_model__display',
      supervisionLabels[app.supervision_model] ?? app.supervision_model ?? '',
      'Derived: SupervisionBadge',
    ),
  )
  rows.push(row(slug, qf, 'quick_facts', 'Target patients', 'target_patients', val(app.target_patients)))

  // --- Sidebar: Assurance ---
  const ass = 'Sidebar — Assurance'
  rows.push(
    row(
      slug,
      ass,
      'assurance',
      'DTAC (JSON)',
      'dtac_status',
      val(app.dtac_status),
    ),
  )
  rows.push(
    row(
      slug,
      ass,
      'assurance',
      'DTAC (UI badge)',
      'dtac_status__display',
      dtacLabels[app.dtac_status] ?? app.dtac_status ?? '',
      'Derived: DtacBadge',
    ),
  )
  if (app.dtac_note) rows.push(row(slug, ass, 'assurance', 'DTAC note', 'dtac_note', val(app.dtac_note)))
  rows.push(row(slug, ass, 'assurance', 'DCB0129', 'dcb0129_status', val(app.dcb0129_status)))
  if (app.gdpr_note) {
    const gdprShort = String(app.gdpr_note).split('.')[0]
    rows.push(row(slug, ass, 'assurance', 'GDPR (first sentence in UI)', 'gdpr_note', gdprShort))
    rows.push(row(slug, ass, 'assurance', 'GDPR (full JSON)', 'gdpr_note_full', val(app.gdpr_note)))
  }
  rows.push(row(slug, ass, 'assurance', 'ISO 27001', 'iso27001', val(app.iso27001)))
  rows.push(row(slug, ass, 'assurance', 'Cyber Essentials', 'cyber_essentials', val(app.cyber_essentials)))
  rows.push(row(slug, ass, 'assurance', 'DSP Toolkit', 'dspt_status', val(app.dspt_status)))
  if (app.cyber_notes) rows.push(row(slug, ass, 'assurance', 'Cyber notes', 'cyber_notes', val(app.cyber_notes)))

  // --- Sidebar: Supplier contact ---
  rows.push(
    row(
      slug,
      'Sidebar — Supplier contact',
      'supplier_contact',
      'Contact email',
      'supplier_contact_email',
      val(app.supplier_contact_email),
    ),
  )

  // --- Sidebar: Product tiers ---
  if (app.product_tiers?.length) {
    app.product_tiers.forEach((t, i) => {
      const b = `tier_${i}`
      rows.push(row(slug, 'Sidebar — Product tiers', b, 'Tier name', `product_tiers[${i}].tier_name`, val(t.tier_name)))
      rows.push(row(slug, 'Sidebar — Product tiers', b, 'Description', `product_tiers[${i}].description`, val(t.description)))
    })
  }

  // --- Sidebar: Sources ---
  rows.push(row(slug, 'Sidebar — Sources', 'sources', 'Source summary', 'source_summary', val(app.source_summary)))
  rows.push(row(slug, 'Sidebar — Sources', 'sources', 'Confidence note', 'confidence_note', val(app.confidence_note)))

  // --- PDP alerts (if present) ---
  if (app.decommissioning_alert) {
    rows.push(row(slug, 'Alerts and notices', 'alerts', 'Decommissioning', 'decommissioning_alert', val(app.decommissioning_alert)))
  }
  if (app.clinical_safety_alert) {
    rows.push(row(slug, 'Alerts and notices', 'alerts', 'Clinical safety', 'clinical_safety_alert', val(app.clinical_safety_alert)))
  }
  if (app.dtac_status === 'passed_refresh_required' && app.dtac_note) {
    rows.push(row(slug, 'Alerts and notices', 'alerts', 'DTAC refresh', 'dtac_note_refresh', val(app.dtac_note)))
  }
  if (app.dtac_status === 'required_not_confirmed' && app.dtac_note) {
    rows.push(row(slug, 'Alerts and notices', 'alerts', 'DTAC not confirmed', 'dtac_note_required', val(app.dtac_note)))
  }

  return rows
}

function main() {
  const { slug, outDir } = parseArgs(process.argv.slice(2))
  const appPath = path.join(ROOT, 'content/apps', `${slug}.json`)
  if (!fs.existsSync(appPath)) {
    console.error(`Missing app JSON: ${appPath}`)
    process.exit(1)
  }
  const app = JSON.parse(fs.readFileSync(appPath, 'utf8'))

  const enumsPath = path.join(ROOT, 'content/common/enums.json')
  const enums = fs.existsSync(enumsPath) ? JSON.parse(fs.readFileSync(enumsPath, 'utf8')) : {}
  const pricingLabels = enums.pricing_labels || {}

  const rows = buildRows(slug, app, pricingLabels)
  const body = [HEADER.map(csvEscape).join(','), ...rows].join('\n') + '\n'

  fs.mkdirSync(outDir, { recursive: true })
  const sweepPath = path.join(outDir, `pdp-content-sweep-${slug}.csv`)
  fs.writeFileSync(sweepPath, body, 'utf8')

  const iterationHeader = ['date', 'author', 'source_keys_affected', 'change_summary', 'sign_off']
  const iterationBody = iterationHeader.map(csvEscape).join(',') + '\n'
  const iterPath = path.join(outDir, `pdp-iteration-log-${slug}.csv`)
  fs.writeFileSync(iterPath, iterationBody, 'utf8')

  console.error(`Wrote ${sweepPath} (${rows.length} content rows)`)
  console.error(`Wrote ${iterPath}`)
}

main()
