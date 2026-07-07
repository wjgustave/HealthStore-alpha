import type { App } from '@/lib/data'
import type { ProductNarrative } from '@/lib/content/productModel'
import { PdpSection } from '@/components/PdpSection'

/**
 * "Making it work at your site" — the curated implementation narrative.
 *
 * Ports the matt_demo implementation section (human wrapper, local workforce, timeline,
 * prerequisites) onto the hybrid PDP as a spine section after Assurance. This is the
 * curated summary; the reference "What it takes locally" tab keeps the JSON-level detail,
 * mirroring the assurance summary/detail split.
 *
 * Server component — no client boundary.
 */
export default function PdpImplementation({
  app,
  narrative,
}: {
  app: App
  narrative: ProductNarrative
}) {
  const impl = narrative.implementation
  if (!impl) return null

  const cards = [
    { label: 'Clinical and human wrapper', value: impl.human_wrapper },
    { label: 'What you need locally', value: impl.workforce },
    { label: 'Timeline to go-live', value: impl.timescale },
  ].filter((c) => !!c.value)

  return (
    <PdpSection
      id="implementation"
      shareKey="narrative-implementation"
      title="Making it work at your site"
      description="What the supplier provides and what your local team needs to organise for a successful deployment."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="hs-surface-card-sm bg-white rounded-lg border p-4"
            style={{ borderColor: 'var(--border)', borderLeft: '4px solid var(--nhs-blue)' }}
          >
            <div className="hs-font-bold hs-text-label mb-1" style={{ color: 'var(--text-secondary)' }}>{c.label}</div>
            <p className="hs-text-caption" style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {impl.prerequisites?.length > 0 && (
        <div className="mt-4">
          <h3 className="hs-font-bold mb-2" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-secondary)' }}>
            Local prerequisites
          </h3>
          <ul className="space-y-1" style={{ margin: 0, paddingLeft: 20, maxWidth: 720, lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: 'var(--text-label)' }}>
            {impl.prerequisites.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg p-4 mt-4" style={{ background: '#E6F0FB', border: '1px solid var(--border)' }}>
        <div className="hs-font-bold hs-text-label mb-1" style={{ color: 'var(--nhs-blue)' }}>
          Supplier support included
        </div>
        <p className="hs-text-label" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          The supplier provides onboarding, training materials, technical integration support and ongoing account management as
          part of the standard package. HealthStore brokers the introduction and tracks mobilisation milestones{impl.owner ? `, with the ${impl.owner} as the recommended local owner` : ''}.
        </p>
      </div>
    </PdpSection>
  )
}
