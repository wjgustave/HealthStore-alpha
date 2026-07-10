import { PdpSection } from '@/components/PdpSection'
import { pdpSectionTitle } from '@/lib/pdpSections'
import { DeploymentRegisterTable } from '@/components/DeploymentRegisterTable'
import { CaseStudyCards } from '@/components/AppDetailSections'
import { getDeploymentRegister } from '@/lib/deploymentRegister'
import { splitPdpEvidence } from '@/lib/pdpEvidence'

/**
 * "NHS experience" — curated spine section that surfaces real-world NHS use.
 *
 * Ports the matt_demo `#nhs-experience` idea onto the hybrid PDP, combining the
 * "where it's live" deployment register with case studies into one prominent
 * block. Reuses the richer DeploymentRegisterTable rather than matt_demo's
 * top-4 card summary. Rendered as the last spine slot (after "Making it work").
 *
 * Real-world programme write-ups from `clinical_evidence_detailed` are folded in
 * as additional case-study cards (Assurance-and-evidence migration); entries
 * flagged `superseded_by_case_study` are skipped because a richer curated case
 * study covers the same deployment. Peer-reviewed publications live in the
 * "Assurance and evidence" section.
 *
 * Server component — no client boundary.
 */

/** Map a real_world evidence record onto the case-study card shape. */
function evidenceToCaseStudy(s: any) {
  return {
    title: s.ref,
    type_label: s.type_label ?? undefined,
    setting: s.setting,
    sample_size: s.n ?? undefined,
    outcome: s.key_results,
    source: s.source_label ?? undefined,
  }
}

export default function PdpNhsExperience({ app }: { app: any }) {
  const rows = getDeploymentRegister(app)
  const curatedCases = Array.isArray(app.case_studies) ? app.case_studies : []
  const { experienceEvals } = splitPdpEvidence(app, {
    showNarrativeSpine: true,
    hasNhsExperience: true,
  })
  const caseStudies = [...curatedCases, ...experienceEvals.map(evidenceToCaseStudy)]
  const hasRegister = rows.length > 0
  const hasCases = caseStudies.length > 0

  if (!hasRegister && !hasCases) return null

  return (
    <PdpSection
      id="nhs-experience"
      shareKey="narrative-nhs-experience"
      title={pdpSectionTitle('nhs-experience')}
      description={`Where ${app.app_name} is deployed across the NHS today, and where case studies and evaluations have taken place.`}
    >
      {hasRegister && (
        <div>
          <DeploymentRegisterTable rows={rows} />
        </div>
      )}

      {hasCases && (
        <div>
          <h3 className="hs-pdp-subheading hs-font-bold mb-1" style={{ fontSize: 'var(--text-card-title-sm)' }}>
            Case studies and evaluations
          </h3>
          <CaseStudyCards caseStudies={caseStudies} plainCards />
        </div>
      )}
    </PdpSection>
  )
}
