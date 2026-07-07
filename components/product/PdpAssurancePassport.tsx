import type { App } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import type { AssuranceDomainStatus } from '@/lib/content/productModel'
import { PdpSection } from '@/components/PdpSection'
import { deriveAssuranceDomains } from '@/lib/content/assuranceDomains'

/**
 * Round 3 content migration — assurance passport for the hybrid PDP.
 *
 * Decisions (see /DS/Audits/Luscii-Content-Mig-4):
 *  - R3-1 A: rendered as an "Assurance" section in the narrative spine, after How-to-buy.
 *  - R3-2 D: compact status chips up top with the domain-by-domain detail in an expandable
 *            table, plus the material-gap callout (which stays visible, not behind the toggle).
 *  - R3-3 C: domains are derived from the granular JSON (deriveAssuranceDomains), so the
 *            summary can never read richer than the detail record in the Safety tab.
 *
 * Server component — no client boundary; the disclosure uses native <details>.
 */

const STATUS_META: Record<
  AssuranceDomainStatus,
  { label: string; chip: string; bg: string; fg: string; border?: string }
> = {
  verified_current: { label: 'Verified — current', chip: '\u2713', bg: '#E6F2EA', fg: '#007F3B' },
  verified_review_due: { label: 'Verified — review due', chip: 'review due', bg: '#F0F4F5', fg: '#425563' },
  declared_pending: { label: 'Declared — pending', chip: 'pending', bg: '#FFF9EE', fg: '#7A4800', border: '#FFD37A' },
  incomplete: { label: 'Incomplete', chip: 'gap', bg: '#FDECEA', fg: '#7A1210' },
  expired: { label: 'Expired / superseded', chip: 'expired', bg: '#FDECEA', fg: '#7A1210' },
  not_applicable: { label: 'Not applicable', chip: 'n/a', bg: '#F0F4F5', fg: '#425563' },
}

export default function PdpAssurancePassport({
  app,
  narrative,
}: {
  app: App
  narrative: ProductNarrative
}) {
  const domains = deriveAssuranceDomains(app)
  if (domains.length === 0) return null

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
      title="Assurance — national once, reuse the passport"
      description="HealthStore runs the national assurance so your local team reuses it instead of repeating supplier checks. Status chips below; open the detail for domain-by-domain notes."
    >
      {speedNote && (
        <div className="rounded-lg p-4 mb-4" style={{ background: '#E6F0FB', border: '1px solid var(--border)' }}>
          <div className="hs-font-bold hs-text-label mb-1" style={{ color: 'var(--nhs-blue)' }}>
            What the passport saves you
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
        <div
          className="hs-surface-card-sm bg-white rounded-lg border p-4 mb-4"
          style={{ borderColor: 'var(--border)', borderLeft: '4px solid var(--nhs-blue)' }}
        >
          <div className="hs-font-bold hs-text-label mb-3" style={{ color: 'var(--text-secondary)' }}>
            Regulatory position
          </div>
          <dl className="grid gap-3 sm:grid-cols-3" style={{ margin: 0 }}>
            {regFacts.map((f) => (
              <div key={f.label}>
                <dt className="hs-text-caption hs-font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</dt>
                <dd className="hs-text-caption" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* R3-2 D: compact status chips */}
      <div className="flex flex-wrap gap-2">
        {domains.map((d) => {
          const m = STATUS_META[d.status]
          return (
            <span
              key={d.domain}
              className="hs-text-caption hs-font-bold"
              title={m.label}
              style={{
                background: m.bg,
                color: m.fg,
                border: m.border ? `1px solid ${m.border}` : `1px solid ${m.bg}`,
                borderRadius: 999,
                padding: '4px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {d.domain}
              <span aria-hidden="true" style={{ opacity: 0.55 }}>&middot;</span>
              <span style={{ fontWeight: 400 }}>{m.chip}</span>
            </span>
          )
        })}
      </div>

      {/* R3-2 D: full detail behind a native disclosure */}
      <details className="mt-4">
        <summary style={{ cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--nhs-blue)', fontWeight: 700 }}>
          Show full assurance detail
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
    </PdpSection>
  )
}
