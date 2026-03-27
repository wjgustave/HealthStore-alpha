const TYPE_LABELS: Record<string, string> = {
  RCT: 'RCT', observational: 'Observational', service_eval: 'Service evaluation',
  grey_lit: 'Grey literature', nice_assessment: 'NICE assessment',
  real_world: 'Real-world evidence', implementation_science: 'Implementation science',
  evidence_gap: 'Evidence gap note',
}
const TYPE_COLOURS: Record<string, string> = {
  RCT: 'badge-green', observational: 'badge-blue', service_eval: 'badge-grey',
  grey_lit: 'badge-grey', nice_assessment: 'badge-teal', real_world: 'badge-blue',
  implementation_science: 'badge-purple', evidence_gap: 'badge-amber',
}

export function EvidenceCard({ study, accent }: { study: any; accent: string }) {
  const isEvidenceGap = study.type === 'evidence_gap'
  const evidenceCardClass = [
    'card-evidence',
    study.data_quality_flag ? 'card-evidence--dq' : '',
    isEvidenceGap ? 'card-evidence--gap' : study.coi ? 'card-evidence--coi' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={evidenceCardClass}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <span className={`badge ${TYPE_COLOURS[study.type] ?? 'badge-grey'}`}>
              {TYPE_LABELS[study.type] ?? study.type}
            </span>
            {study.peer_reviewed && (
              <span className="badge badge-green">Peer-reviewed</span>
            )}
            {study.coi && (
              <span className="badge badge-amber">
                <span aria-hidden>⚠ </span>COI declared
              </span>
            )}
            {study.data_quality_flag && (
              <span className="badge badge-amber">
                <span aria-hidden>⚠ </span>Data quality flag
              </span>
            )}
          </div>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-label)', color: 'var(--text-primary)', marginBottom: 2 }}>
            {study.ref}
          </div>
          {study.authors && (
            <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
              {study.authors}
              {study.journal && <span> · <em>{study.journal}</em></span>}
              {study.year && <span> · {study.year}</span>}
              {study.volume_issue && <span> · {study.volume_issue}</span>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          {study.url_doi && (
            <a href={study.url_doi} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              DOI ↗
            </a>
          )}
          {study.url_pubmed && (
            <a href={study.url_pubmed} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              PubMed ↗
            </a>
          )}
          {study.url_pmc && (
            <a href={study.url_pmc} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              PMC (open) ↗
            </a>
          )}
          {study.url_full_text && !study.url_doi && !study.url_pubmed && (
            <a href={study.url_full_text} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {study.source_label ?? 'Source ↗'}
            </a>
          )}
          {study.url_trial_reg && (
            <a href={study.url_trial_reg} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Trial reg ↗
            </a>
          )}
          {study.url_case_study && (
            <a href={study.url_case_study} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-label)', color: accent, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Case study ↗
            </a>
          )}
        </div>
      </div>

      {(study.doi || study.pmid || study.pmc || study.trial_reg || study.n) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          {study.doi && <span>DOI: {study.doi}</span>}
          {study.pmid && <span>PMID: {study.pmid}</span>}
          {study.pmc && <span>PMC: {study.pmc}</span>}
          {study.trial_reg && <span>Trial reg: {study.trial_reg}</span>}
          {study.n && <span>n = {study.n.toLocaleString()}</span>}
          {study.setting && <span>Setting: {study.setting}</span>}
        </div>
      )}

      {study.key_results && (
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Key results: </strong>
          {study.key_results}
        </p>
      )}

      {study.study_limitation && (
        <p style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: study.data_quality_note ? 6 : 0 }}>
          <strong>Limitation: </strong>{study.study_limitation}
        </p>
      )}

      {study.data_quality_note && (
        <div style={{ fontSize: 'var(--text-label)', background: '#FEF5E6', borderLeft: '3px solid #D5840D', color: '#7A4800', borderRadius: 4, padding: '6px 8px', marginTop: 6, lineHeight: 1.5 }}>
          <strong>⚠ Commissioner note: </strong>{study.data_quality_note}
        </div>
      )}
      {study.coi_note && !study.data_quality_note && (
        <div style={{ fontSize: 'var(--text-label)', background: '#FEF5E6', borderLeft: '3px solid #D5840D', color: '#7A4800', borderRadius: 4, padding: '6px 8px', marginTop: 6, lineHeight: 1.5 }}>
          <strong>⚠ COI note: </strong>{study.coi_note}
        </div>
      )}
    </div>
  )
}

export function ContextOfUseGrid({ app }: { app: any }) {
  const ctx = app.context_of_use
  if (!ctx) return null
  const items = [
    { label: 'Target population', value: ctx.population },
    { label: 'Clinical pathways', value: Array.isArray(ctx.pathways) ? ctx.pathways.join(', ') : ctx.pathways },
    { label: 'Care settings', value: Array.isArray(ctx.care_settings) ? ctx.care_settings.join(', ') : ctx.care_settings },
    { label: 'Therapeutic purpose', value: ctx.therapeutic_purpose },
    { label: 'HCP involvement', value: ctx.hcp_involvement },
    { label: 'NICE scope', value: ctx.nice_scope },
  ]
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(item => (
        <div key={item.label} className="rounded-lg p-3" style={{ background: '#F7F9FC' }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
            {item.label}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {item.value || 'Not specified'}
          </div>
        </div>
      ))}
    </div>
  )
}

export function NhsIntegrationBadges({ app }: { app: any }) {
  const integrations = [
    { key: 'nhs_app_integration', label: 'NHS App' },
    { key: 'nhs_login_integration', label: 'NHS Login' },
    { key: 'nhs_notify_integration', label: 'NHS Notify' },
  ]
  const hasAny = integrations.some(i => app[i.key])
  if (!hasAny) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {integrations.filter(i => app[i.key]).map(i => (
        <span key={i.key} className="badge badge-blue">
          ✓ {i.label}
        </span>
      ))}
    </div>
  )
}
