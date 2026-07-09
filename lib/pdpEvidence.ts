/**
 * Splits `clinical_evidence_detailed` across the hybrid PDP surfaces for
 * curated-narrative products (matt_demo "Assurance and evidence" migration):
 *
 *  - publications:    peer-reviewed studies, RCT/observational records, and
 *                     service evaluations → "Clinical publications and evaluations"
 *                     (excludes NICE HT/HTE/HTG/MTG assessments — those live under NICE guidance).
 *  - niceEvidence:    all `nice_assessment` entries → NICE guidance subsection.
 *  - experienceEvals: real-world NHS programme write-ups → rendered as
 *                     case-study cards in the NHS experience section (entries
 *                     flagged `superseded_by_case_study` are skipped because a
 *                     richer curated case study already covers them).
 *  - tab:             anything left over (grey lit, implementation science,
 *                     evidence gaps…) stays in the Clinical evidence tab.
 *
 * Non-narrative products keep the full record in the tab (pass
 * `showNarrativeSpine: false`).
 */
export type PdpEvidenceSplit = {
  publications: any[]
  niceEvidence: any[]
  experienceEvals: any[]
  tab: any[]
}

/** NICE HT/HTE/HTG/MTG/EVA/EAG guidance — belongs in NICE guidance, not Clinical publications. */
function isNiceGuidanceRecord(study: any): boolean {
  if (study.type === 'nice_assessment') return true
  const text = `${study.ref ?? ''} ${study.type_label ?? ''}`
  return /\bNICE\b/i.test(text) && /\b(HTE|HTG|HT|MTG|EVA|EAG)\b/i.test(text)
}

/** Study-grade records for the Clinical publications and evaluations subsection. */
function isPublicationRecord(study: any): boolean {
  return (
    !isNiceGuidanceRecord(study) &&
    (study.peer_reviewed ||
      study.type === 'RCT' ||
      study.type === 'observational' ||
      study.type === 'service_eval')
  )
}

export function splitPdpEvidence(
  app: any,
  opts: { showNarrativeSpine: boolean; hasNhsExperience: boolean },
): PdpEvidenceSplit {
  const all: any[] = Array.isArray(app.clinical_evidence_detailed) ? app.clinical_evidence_detailed : []

  if (!opts.showNarrativeSpine) {
    const publications = all.filter(
      (s) => !isNiceGuidanceRecord(s) && s.type === 'service_eval',
    )
    const niceEvidence = all.filter((s) => isNiceGuidanceRecord(s))
    const tab = all.filter((s) => !publications.includes(s) && !niceEvidence.includes(s))
    return { publications, niceEvidence, experienceEvals: [], tab }
  }

  const publications = all.filter(isPublicationRecord)
  const niceEvidence = all.filter((s) => isNiceGuidanceRecord(s))
  const realWorld = all.filter((s) => s.type === 'real_world' && !publications.includes(s))
  const experienceEvals = opts.hasNhsExperience
    ? realWorld.filter((s) => !s.superseded_by_case_study)
    : []

  const tab = all.filter(
    (s) =>
      !publications.includes(s) &&
      !niceEvidence.includes(s) &&
      // Real-world entries move to NHS experience when that section renders
      // (including superseded duplicates, which are covered by curated case studies).
      !(opts.hasNhsExperience && s.type === 'real_world'),
  )

  return { publications, niceEvidence, experienceEvals, tab }
}
