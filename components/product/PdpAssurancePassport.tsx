import type { App } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import type { AssuranceDomainStatus } from '@/lib/content/productModel'
import { PdpSection } from '@/components/PdpSection'
import { pdpSectionTitle } from '@/lib/pdpSections'
import { deriveAssuranceDomains } from '@/lib/content/assuranceDomains'
import { splitPdpEvidence } from '@/lib/pdpEvidence'
import PdpClinicalPublications from '@/components/product/PdpClinicalPublications'
import { STORE_ACCENT } from '@/lib/storeAccent'

/**
 * Round 3 content migration — assurance passport for the hybrid PDP.
 *
 * Decisions (see /DS/Audits/Luscii-Content-Mig-4):
 *  - R3-1 A: rendered as an "Assurance" section in the narrative spine, after How-to-buy.
 *  - R3-2 D: NHS task list for domain status with domain-by-domain detail in the list hints.
 *  - R3-3 C: domains default to deriveAssuranceDomains(app) from granular JSON. When a
 *            curated narrative.assurance_domains list is authored (matt_demo parity —
 *            e.g. myCOPD), that list is used instead so the passport matches the gold
 *            standard table.
 *
 * Server component — no client boundary.
 */

/** NHS task-list status presentation — https://service-manual.nhs.uk/design-system/components/task-list */
function TaskListStatus({ status, id }: { status: AssuranceDomainStatus; id: string }) {
  const statusStyle = { whiteSpace: 'nowrap' as const }
  switch (status) {
    case 'verified_current':
      return (
        <div className="nhsuk-task-list__status" id={id} style={statusStyle}>
          <strong className="nhsuk-tag nhsuk-tag--green" style={statusStyle}>Available</strong>
        </div>
      )
    case 'verified_review_due':
      return (
        <div className="nhsuk-task-list__status" id={id} style={statusStyle}>
          <strong className="nhsuk-tag nhsuk-tag--yellow" style={statusStyle}>Review due</strong>
        </div>
      )
    case 'declared_pending':
      return (
        <div className="nhsuk-task-list__status" id={id} style={statusStyle}>
          <strong className="nhsuk-tag nhsuk-tag--blue" style={statusStyle}>Incomplete</strong>
        </div>
      )
    case 'incomplete':
      return (
        <div className="nhsuk-task-list__status" id={id} style={statusStyle}>
          <strong className="nhsuk-tag nhsuk-tag--red" style={statusStyle}>Incomplete</strong>
        </div>
      )
    case 'expired':
      return (
        <div className="nhsuk-task-list__status" id={id} style={statusStyle}>
          <strong className="nhsuk-tag nhsuk-tag--red" style={statusStyle}>Expired</strong>
        </div>
      )
    case 'not_applicable':
      return (
        <div className="nhsuk-task-list__status nhsuk-task-list__status--cannot-start-yet" id={id} style={statusStyle}>
          Not applicable
        </div>
      )
  }
}

export default function PdpAssurancePassport({
  app,
  narrative,
}: {
  app: App
  narrative: ProductNarrative
}) {
  // Prefer curated narrative domains (matt_demo parity) when authored; otherwise
  // derive from granular JSON so the passport cannot overstate the Safety tab.
  const domains =
    narrative.assurance_domains && narrative.assurance_domains.length > 0
      ? narrative.assurance_domains
      : deriveAssuranceDomains(app)

  // Evidence half of the combined section (matt_demo "Assurance and evidence"):
  // peer-reviewed / study-grade publications plus NICE guidance, migrated out of
  // the Clinical evidence tab for curated-narrative products.
  const { publications, niceEvidence } = splitPdpEvidence(app, {
    showNarrativeSpine: true,
    hasNhsExperience: false,
  })
  const niceRefs: any[] = (app as any).nice_guidance_refs ?? []
  const hasEvidence = publications.length > 0 || niceEvidence.length > 0 || niceRefs.length > 0

  if (domains.length === 0 && !hasEvidence) return null

  const INTEROP_DOMAIN = 'Interoperability'
  const packDomains = domains.filter((d) => d.domain !== INTEROP_DOMAIN)
  const interopDomain = domains.find((d) => d.domain === INTEROP_DOMAIN)

  const material = packDomains.filter((d) => d.status === 'incomplete' || d.status === 'expired')
  const reg = narrative.regulatory_position
  const speedNote = reg?.assurance_speed_note

  const regFacts = reg
    ? [
        { label: 'Device classification', value: reg.device_class },
        { label: 'HIRA status', value: reg.hira_status },
        { label: 'Market access', value: reg.market_access },
      ].filter((f) => !!f.value)
    : []

  return (
    <PdpSection
      id="assurance"
      shareKey="narrative-assurance"
      title={pdpSectionTitle('assurance')}
      description="The NHS HealthStore has reviewed this product nationally. We certify our confidence in its assurance position based on supplier-provided documentation. Your local team retains responsibility for due diligence — we make that faster by providing access to source documents in your workspace once verified."
    >
      {speedNote && (
        <div className="mb-4">
          <div className="hs-font-bold hs-text-label mb-1" style={{ color: 'var(--text-primary)' }}>
            What our assurance pack saves you
          </div>
          <p className="hs-text-label" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {speedNote}
          </p>
        </div>
      )}

      {material.length > 0 && (
        <div
          className="rounded-lg p-4 mb-4"
          style={{ borderLeft: '8px solid #d5281b', background: '#FDECEA' }}
          role="note"
          aria-label="Material assurance gaps"
        >
          <div className="hs-font-bold hs-text-label mb-1" style={{ color: '#7A1210' }}>
            Material assurance gaps
          </div>
          <ul className="hs-text-label" style={{ color: '#5A1010', margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
            {material.map((d) => (
              <li key={d.domain}>
                <strong>{d.domain}:</strong> {d.summary}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* R4-2 B: dedicated regulatory-position card */}
      {regFacts.length > 0 && (
        <div>
          <div className="hs-font-bold hs-text-body mb-3" style={{ color: 'var(--text-primary)' }}>
            Regulatory position
          </div>
          <dl className="grid gap-3 sm:grid-cols-3" style={{ margin: 0 }}>
            {regFacts.map((f) => (
              <div key={f.label}>
                <dt className="hs-text-label hs-font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{f.label}</dt>
                <dd className="hs-text-label" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* R3-2 D: NHS task list for domain status (replaces compact chips) */}
      {packDomains.length > 0 && (
      <>
      <div className="nhsuk-task-list" style={{ marginBottom: 0, marginTop: 40, listStyle: 'none', padding: 0 }}>
        <div className="flex justify-between gap-4" style={{ marginBottom: 0 }}>
          <span className="hs-font-bold" style={{ color: '#212b32' }}>
            Assurance pack
          </span>
          <span className="hs-font-bold" style={{ color: '#212b32', whiteSpace: 'nowrap' }}>
            Status
          </span>
        </div>
      </div>
      <ul className="nhsuk-task-list" style={{ marginTop: 0 }}>
        {packDomains.map((d, index) => {
          const statusId = `assurance-${index + 1}-status`
          const hintId = `assurance-${index + 1}-hint`
          const hint = d.summary?.trim()
          return (
            <li key={d.domain} className="nhsuk-task-list__item">
              <div className="nhsuk-task-list__name-and-hint">
                <div className="hs-font-bold">{d.domain}</div>
                {hint && (
                  <div id={hintId} className="nhsuk-task-list__hint hs-text-label">
                    {hint}
                  </div>
                )}
              </div>
              <TaskListStatus status={d.status} id={statusId} />
            </li>
          )
        })}
      </ul>
      </>
      )}

      {interopDomain && (
        <div
          className="rounded-lg p-4 mt-4"
          style={{ background: '#E6F0FB', border: '1px solid var(--border)' }}
        >
          <div className="hs-font-bold hs-text-label mb-1" style={{ color: 'var(--text-primary)' }}>
            {interopDomain.domain}
          </div>
          <p className="hs-text-label" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {interopDomain.summary}
          </p>
        </div>
      )}

      {/* Evidence half — "Clinical publications and evaluations" (matt_demo port). */}
      <PdpClinicalPublications publications={publications} />

      {/* Evidence half — NICE guidance (moved from the Clinical evidence tab). */}
      {(niceRefs.length > 0 || niceEvidence.length > 0) && (
        <div>
          <h3 className="hs-pdp-subheading hs-font-bold mb-3" style={{ fontSize: 'var(--text-card-title-sm)' }}>
            NICE guidance
          </h3>
          <div className="space-y-2">
            {niceRefs.map((r: any) => (
              <p key={r.ref} className="m-0 hs-text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <a href={r.url} className="hover:underline" style={{ color: STORE_ACCENT }}>
                  {r.ref}
                </a>
                {[r.type, r.date, r.note].filter(Boolean).length > 0 ? (
                  <>
                    {' — '}
                    {[r.type, r.date, r.note].filter(Boolean).join(', ')}
                  </>
                ) : null}
              </p>
            ))}
            {niceEvidence.map((s: any, i: number) => (
              <p key={s.id ?? i} className="m-0 hs-text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {s.url_full_text ? (
                  <a href={s.url_full_text} className="hover:underline" style={{ color: STORE_ACCENT }}>
                    {s.ref}
                  </a>
                ) : (
                  s.ref
                )}
                {s.key_results ? <> — {s.key_results}</> : null}
                {s.study_limitation ? <> Note: {s.study_limitation}</> : null}
              </p>
            ))}
          </div>
        </div>
      )}
    </PdpSection>
  )
}
