import type { App } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import { deriveAssuranceDomains } from '@/lib/content/assuranceDomains'
import { getDeploymentRegister } from '@/lib/deploymentRegister'
import { splitPdpEvidence } from '@/lib/pdpEvidence'

export type PdpOnThisPageLink = { id: string; label: string }

/**
 * Builds anchor links for the PDP "On this page" nav — narrative spine sections first,
 * then reference tab sections with stable ids (deep-linkable via PdpTabs hash handling).
 */
export function buildPdpOnThisPageLinks(input: {
  app: App
  narrative: ProductNarrative | null
  showNarrativeSpine: boolean
  showLocalValue: boolean
  hasLinkedFunding: boolean
}): PdpOnThisPageLink[] {
  const { app, narrative, showNarrativeSpine, showLocalValue, hasLinkedFunding } = input
  const links: PdpOnThisPageLink[] = []

  const hasNhsExperience =
    showNarrativeSpine &&
    (getDeploymentRegister(app).length > 0 || (app.case_studies?.length ?? 0) > 0)
  // For narrative products the evidence record moves into the spine (Assurance
  // and evidence / NHS experience); the tab section only survives if leftovers remain.
  const evidenceSplit = splitPdpEvidence(app, { showNarrativeSpine, hasNhsExperience })

  if (showNarrativeSpine && narrative) {
    const problem = narrative.decision_summary?.pathway_problem
    const bullets = narrative.what_it_does_bullets ?? []
    const pathway = narrative.pathway_model

    if (problem) {
      links.push({ id: 'the-problem', label: 'The problem' })
    }
    if (bullets.length > 0 || pathway) {
      links.push({ id: 'how-it-helps', label: `How ${app.app_name} helps` })
    }
    if (showLocalValue) {
      links.push({ id: 'local-impact', label: 'Projected impact' })
      links.push({ id: 'local-value-worth', label: 'What it could be worth' })
    }
    const economics = narrative.commissioner_economics
    if ((economics?.funding_levers?.length ?? 0) > 0 || !!economics?.tariff_note?.trim() || hasLinkedFunding) {
      links.push({ id: 'funding-levers', label: 'Funding levers' })
    }
    const hasAssuranceEvidence =
      evidenceSplit.publications.length > 0 ||
      evidenceSplit.niceEvidence.length > 0 ||
      (app.nice_guidance_refs?.length ?? 0) > 0
    if (deriveAssuranceDomains(app).length > 0 || hasAssuranceEvidence) {
      links.push({ id: 'assurance', label: 'Assurance and evidence' })
    }
    if (narrative.implementation) {
      links.push({ id: 'implementation', label: 'Making it work' })
    }
    if (hasNhsExperience) {
      links.push({ id: 'nhs-experience', label: 'NHS experience' })
    }
    if (narrative.commercial_readiness) {
      links.push({ id: 'how-to-buy', label: 'How to buy locally' })
    }
    links.push({ id: 'resources', label: 'Resources' })
  }

  if (!showNarrativeSpine) {
    links.push({ id: 'clinical-evidence', label: 'Clinical evidence' })
    links.push({ id: 'scale-and-maturity', label: 'Scale and maturity' })
  }
  if (!showNarrativeSpine) {
    links.push({ id: 'commercial-model', label: 'Commercial model and cost' })
  }
  if (!showNarrativeSpine && hasLinkedFunding) {
    links.push({ id: 'related-funding', label: 'Related funding' })
  }
  if (!showNarrativeSpine) {
    links.push({ id: 'nhs-integrations', label: 'NHS integrations' })
  }

  return links
}
