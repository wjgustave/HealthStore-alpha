import type { App } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import type { AssuranceDomainStatus } from '@/lib/content/productModel'
import { PdpSection } from '@/components/PdpSection'
import { deriveAssuranceDomains } from '@/lib/content/assuranceDomains'
import { splitPdpEvidence } from '@/lib/pdpEvidence'
import PdpClinicalPublications from '@/components/product/PdpClinicalPublications'
import { STORE_ACCENT } from '@/lib/storeAccent'

/**
 * Round 3 content migration — assurance passport for the hybrid PDP.
 *
 * Decisions (see /DS/Audits/Luscii-Content-Mig-4):
 *  - R3-1 A: rendered as an "Assurance" section in the narrative spine, after How-to-buy.
 *  - R3-2 D: NHS task list for domain status with the domain-by-domain detail in an expandable
 *            table, plus the material-gap callout (which stays visible, not behind the toggle).
 *  - R3-3 C: domains default to deriveAssuranceDomains(app) from granular JSON. When a
 *            curated narrative.assurance_domains list is authored (matt_demo parity —
 *            e.g. myCOPD), that list is used instead so the passport matches the gold
 *            standard table.
 *
 * Server component — no client boundary; the disclosure uses native <details>.
 */

const STATUS_META: Record<
  AssuranceDomainStatus,
  { label: string; bg: string; fg: string; border?: string }
> = {
  verified_current: { label: 'Verified — current', bg: '#E6F2EA', fg: '#007F3B' },
  verified_review_due: { label: 'Verified — review due', bg: '#F0F4F5', fg: '#425563' },
  declared_pending: { label: 'Declared — pending', bg: '#FFF9EE', fg: '#7A4800', border: '#FFD37A' },
  incomplete: { label: 'Incomplete', bg: '#FDECEA', fg: '#7A1210' },
  expired: { label: 'Expired / superseded', bg: '#FDECEA', fg: '#7A1210' },
  not_applicable: { label: 'Not applicable', bg: '#F0F4F5', fg: '#425563' },
}

/** NHS task-list status presentation — https://service-manual.nhs.uk/design-system/components/task-list */
function TaskListStatus({ status, id }: { status: AssuranceDomainStatus; id: string }) {
  switch (status) {
    case 'verified_current':
      return (
        <div className="nhsuk-task-list__status" id={id}>
          <strong className="nhsuk-tag nhsuk-tag--green">Verified current</strong>
        </div>
      )
    case 'verified_review_due':
      return (
        <div className="nhsuk-task-list__status" id={id}>
          <strong className="nhsuk-tag nhsuk-tag--yellow">Review due</strong>
        </div>
      )
    case 'declared_pending':
      return (
        <div className="nhsuk-task-list__status" id={id}>
          <strong className="nhsuk-tag nhsuk-tag--blue">Incomplete</strong>
        </div>
      )
    case 'incomplete':
      return (
        <div className="nhsuk-task-list__status" id={id}>
          <strong className="nhsuk-tag nhsuk-tag--red">Incomplete</strong>
        </div>
      )
    case 'expired':
      return (
        <div className="nhsuk-task-list__status" id={id}>
          <strong className="nhsuk-tag nhsuk-tag--red">Expired</strong>
        </div>
      )
    case 'not_applicable':
      return (
        <div className="nhsuk-task-list__status nhsuk-task-list__status--cannot-start-yet" id={id}>
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

  const material = domains.filter((d) => d.status === 'incomplete' || d.status === 'expired')
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
      title="Assurance and evidence"
      description="HealthStore has reviewed this product nationally. We certify our confidence in its assurance position based on supplier-provided documentation. Your local team retains responsibility for due diligence — we make that faster by providing access to source documents in your workspace once verified."
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
      {domains.length > 0 && (
      <>
      <div className="nhsuk-task-list" style={{ marginBottom: 0, marginTop: 40, listStyle: 'none', padding: 0 }}>
        <div className="flex justify-between gap-4" style={{ marginBottom: 0 }}>
          <span className="hs-font-bold" style={{ color: '#212b32' }}>
            Assurance pack item
          </span>
          <span className="hs-font-bold" style={{ color: '#212b32' }}>
            Status
          </span>
        </div>
      </div>
      <ul className="nhsuk-task-list" style={{ marginTop: 0 }}>
        {domains.map((d, index) => {
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

      {/* R3-2 D: full detail behind a native disclosure */}
      <details className="mt-4">
        <summary style={{ cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--nhs-blue)', fontWeight: 700 }}>
          What is in the Assurance pack
        </summary>
        <div className="mt-3 hs-surface-card-sm bg-white rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse', fontSize: 'var(--text-caption)' }}>
            <thead>
              <tr style={{ background: '#F0F4F5', textAlign: 'left' }}>
                <th className="p-3 hs-font-bold" style={{ color: 'var(--text-muted)' }}>Domain</th>
                <th className="p-3 hs-font-bold" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="p-3 hs-font-bold" style={{ color: 'var(--text-muted)' }}>Summary</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => {
                const m = STATUS_META[d.status]
                return (
                  <tr key={d.domain} style={{ borderTop: '1px solid var(--border)', verticalAlign: 'top' }}>
                    <td className="p-3 hs-font-bold" style={{ color: 'var(--text-secondary)' }}>{d.domain}</td>
                    <td className="p-3" style={{ whiteSpace: 'nowrap' }}>
                      <span
                        className="hs-font-bold"
                        style={{ background: m.bg, color: m.fg, border: m.border ? `1px solid ${m.border}` : undefined, borderRadius: 999, padding: '2px 10px' }}
                      >
                        {m.label}
                      </span>
                      {d.review_due && (
                        <div className="mt-1" style={{ color: 'var(--text-muted)' }}>Review due: {d.review_due}</div>
                      )}
                    </td>
                    <td className="p-3" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {d.summary}
                      {d.residual_action && (
                        <div className="mt-1" style={{ color: '#7A4800' }}>
                          <strong>Local action:</strong> {d.residual_action}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
      </>
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
