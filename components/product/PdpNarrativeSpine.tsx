import type { ReactNode } from 'react'
import type { App } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import { PdpSection } from '@/components/PdpSection'

/**
 * Narrative spine for the hybrid PDP.
 *
 * Round 1 rendered the story scaffolding: the problem, how the product helps
 * (+ pathway change), and how to buy locally.
 * Round 2 (quantified value) injects the personalised local-value block via the
 * optional `localValue` slot after "how it helps".
 * Spine order: problem → how it helps → projected impact & worth → funding levers →
 * assurance → implementation → NHS experience → how to buy → resources.
 *
 * Sits between the commissioning snapshot and the reference tabs on
 * app/apps/[slug]/page.tsx, so the deep catalogue detail is retained (no data loss).
 */
export default function PdpNarrativeSpine({
  app,
  narrative,
  localValue,
  fundingLevers,
  assurance,
  implementation,
  nhsExperience,
  resources,
  expressInterest,
}: {
  app: App
  narrative: ProductNarrative
  localValue?: ReactNode
  /** Tariff / QOF levers and linked funding schemes. */
  fundingLevers?: ReactNode
  /** Round 3 (R3-1 A): assurance passport section. */
  assurance?: ReactNode
  /** "Making it work" curated implementation section. */
  implementation?: ReactNode
  /** "NHS experience" section (deployment register + case studies). */
  nhsExperience?: ReactNode
  /** Product videos and demo links. */
  resources?: ReactNode
  /** Express interest callout — rendered at the end of How to buy locally. */
  expressInterest?: ReactNode
}) {
  const problem = narrative.decision_summary?.pathway_problem
  const bullets = narrative.what_it_does_bullets ?? []
  const pathway = narrative.pathway_model
  const commercial = narrative.commercial_readiness

  const hasSpine = !!problem || bullets.length > 0 || !!pathway || !!commercial
  if (!hasSpine) return null

  return (
    <div className="hs-pdp-spine mb-6 space-y-4">
      {problem && (
        <PdpSection
          id="the-problem"
          shareKey="narrative-problem"
          title="The problem this addresses"
        >
          <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {problem}
          </p>
          {narrative.decision_summary?.why_relevant && (
            <p className="mt-3" style={{ fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--text-muted)' }}>
              {narrative.decision_summary.why_relevant}
            </p>
          )}
        </PdpSection>
      )}

      {(bullets.length > 0 || pathway) && (
        <PdpSection
          id="how-it-helps"
          shareKey="narrative-how-it-helps"
          title={`How ${app.app_name} helps`}
        >
          {bullets.length > 0 && (
            <ul className="space-y-2" style={{ margin: '0 0 8px', paddingLeft: 20, lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: 'var(--text-body)' }}>
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}

          {pathway && (
            <div>
              <h3 className="hs-pdp-subheading hs-font-bold mb-3" style={{ fontSize: 'var(--text-card-title-sm)' }}>
                How it changes the pathway
              </h3>
              <div className="hs-pathway-visual">
                <div className="hs-pathway-col hs-pathway-current">
                  <h3 className="hs-pathway-heading">Current pathway</h3>
                  {pathway.current_steps.map((step, i) => (
                    <div key={step.id}>
                      <div className="hs-pathway-step">{step.label}</div>
                      {i < pathway.current_steps.length - 1 && <div className="hs-pathway-arrow">↓</div>}
                    </div>
                  ))}
                </div>
                <div className="hs-pathway-divider">→</div>
                <div className="hs-pathway-col hs-pathway-future">
                  <h3 className="hs-pathway-heading">With {app.app_name}</h3>
                  {pathway.future_steps.map((step, i) => (
                    <div key={step.id}>
                      <div className={`hs-pathway-step ${step.change === 'added' ? 'hs-pathway-added' : step.change === 'changed' ? 'hs-pathway-changed' : ''}`}>
                        {step.label}
                      </div>
                      {i < pathway.future_steps.length - 1 && <div className="hs-pathway-arrow">↓</div>}
                    </div>
                  ))}
                </div>
              </div>
              <details className="mt-4">
                <summary style={{ cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--nhs-blue)' }}>
                  Text-only pathway description
                </summary>
                <div className="mt-2 hs-text-caption" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <p><strong>Current:</strong> {pathway.current_steps.map((s) => s.label).join(' → ')}</p>
                  <p className="mt-1"><strong>With {app.app_name}:</strong> {pathway.future_steps.map((s) => `${s.label}${s.change && s.change !== 'unchanged' ? ` [${s.change}]` : ''}`).join(' → ')}</p>
                </div>
              </details>
            </div>
          )}
        </PdpSection>
      )}

      {localValue}

      {fundingLevers}

      {assurance}

      {implementation}

      {nhsExperience}

      {commercial && (
        <PdpSection
          id="how-to-buy"
          shareKey="narrative-how-to-buy"
          title="How to buy locally"
        >
          {commercial.healthstore_role && (
            <div className="rounded-lg p-4 mb-4" style={{ background: '#E6F0FB', border: '1px solid var(--border)' }}>
              <div className="hs-font-bold hs-text-label mb-1" style={{ color: 'var(--text-primary)' }}>
                HealthStore&rsquo;s role in procurement
              </div>
              <p className="hs-text-label" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {commercial.healthstore_role}
              </p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Proposition type', val: commercial.proposition_type },
              { label: 'Recommended route', val: commercial.route_status },
              { label: 'Buyer pack', val: commercial.buyer_pack_status },
            ].map((f) => (
              <div key={f.label} className="hs-surface-card-sm bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="hs-text-caption hs-font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</div>
                <div className="hs-text-label" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.val}</div>
              </div>
            ))}
          </div>
          {expressInterest}
        </PdpSection>
      )}

      {resources}
    </div>
  )
}
