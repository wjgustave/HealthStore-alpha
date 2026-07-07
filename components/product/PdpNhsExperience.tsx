import { PdpSection } from '@/components/PdpSection'
import { DeploymentRegisterTable } from '@/components/DeploymentRegisterTable'
import { CaseStudyCards } from '@/components/AppDetailSections'
import { getDeploymentRegister } from '@/lib/deploymentRegister'

/**
 * "NHS experience" — curated spine section that surfaces real-world NHS use.
 *
 * Ports the matt_demo `#nhs-experience` idea onto the hybrid PDP, combining the
 * "where it's live" deployment register with case studies into one prominent
 * block. Reuses the richer DeploymentRegisterTable rather than matt_demo's
 * top-4 card summary. Rendered as the last spine slot (after "Making it work").
 *
 * Server component — no client boundary.
 */
/**
 * Temporarily hide the peer-reviewed evaluations that were moved here from the
 * Clinical evidence tab. Flip to `true` to surface them again as green
 * "Peer-reviewed" cards; page.tsx already keeps them out of the Clinical
 * evidence tab so no other change is needed to re-enable.
 */
const SHOW_PEER_REVIEWED_EVALUATIONS = false

export default function PdpNhsExperience({ app }: { app: any }) {
  const rows = getDeploymentRegister(app)
  const caseStudies = Array.isArray(app.case_studies) ? app.case_studies : []
  const peerReviewed = SHOW_PEER_REVIEWED_EVALUATIONS
    ? (Array.isArray(app.clinical_evidence_detailed) ? app.clinical_evidence_detailed : []).filter((s: any) => s.peer_reviewed)
    : []
  const hasRegister = rows.length > 0
  const hasCases = caseStudies.length > 0
  const hasPeerReviewed = peerReviewed.length > 0
  const hasEvaluations = hasCases || hasPeerReviewed

  if (!hasRegister && !hasEvaluations) return null

  return (
    <PdpSection
      id="nhs-experience"
      shareKey="narrative-nhs-experience"
      title="NHS experience"
      description="Where this product is deployed across the NHS today, plus named case studies and evaluations."
    >
      {hasRegister && (
        <div className={hasEvaluations ? 'mb-8' : ''}>
          <DeploymentRegisterTable rows={rows} />
        </div>
      )}

      {hasEvaluations && (
        <div>
          <h3 className="hs-font-bold mb-1" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-secondary)' }}>
            Case studies and evaluations
          </h3>
          <p className="hs-text-caption mb-0 p-2 rounded" style={{ background: '#E6F0FB', color: '#003087', lineHeight: 1.5 }}>
            <strong>Commissioner note:</strong>{' '}
            {hasPeerReviewed
              ? 'Peer-reviewed evaluations are labelled; other entries are illustrative local reports. See the full record in the '
              : 'Case studies are illustrative local reports and may not meet the same standard as peer-reviewed trials. Use alongside the '}
            <a href="#clinical-evidence" className="hs-font-bold underline" style={{ color: '#003087' }}>Clinical evidence</a> section.
          </p>
          <CaseStudyCards caseStudies={caseStudies} studies={peerReviewed} />
        </div>
      )}
    </PdpSection>
  )
}
