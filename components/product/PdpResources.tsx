import type { App } from '@/lib/data'
import { PdpSection } from '@/components/PdpSection'
import { pdpSectionTitle } from '@/lib/pdpSections'
import ProductVideosSection from '@/components/ProductVideosSection'
import { DemoAccessSection, shouldShowDemoAccess, TechnicalIntegrationTable } from '@/components/AppDetailSections'
import { STORE_ACCENT } from '@/lib/storeAccent'

const TECH_SPEC_EXCLUDE = ['Data hosting', 'NHS Login'] as const

/** Narrative spine — product videos, demo links, and technical specification. */
export default function PdpResources({ app }: { app: App }) {
  const hasVideos = (app.product_videos?.length ?? 0) > 0
  const hasDemo = shouldShowDemoAccess(app)
  const hasMedia = hasVideos || hasDemo
  const showSubheads = hasVideos && hasDemo

  return (
    <PdpSection
      id="resources"
      shareKey="narrative-resources"
      title={pdpSectionTitle('resources')}
      description="Product videos, demo links, documentation and technical integration detail."
    >
      {hasVideos && (
        <ProductVideosSection
          videos={app.product_videos}
          embedded
          showHeading={showSubheads}
        />
      )}

      {hasDemo && (
        <div
          className={hasVideos ? 'mt-8 border-t pt-8' : undefined}
          style={hasVideos ? { borderColor: 'var(--border)' } : undefined}
        >
          {showSubheads && (
            <h3
              className="mb-1 hs-text-card-title-sm hs-font-bold"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
            >
              Demo access
            </h3>
          )}
          {showSubheads && (
            <p className="m-0 mb-4 hs-text-label" style={{ color: 'var(--text-muted)' }}>
              Try the product or request a configured demonstration from the supplier.
            </p>
          )}
          <DemoAccessSection app={app} accent={STORE_ACCENT} />
        </div>
      )}

      <details className={hasMedia ? 'mt-8 border-t pt-8' : 'mt-0'} style={hasMedia ? { borderColor: 'var(--border)' } : undefined}>
        <summary style={{ cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--nhs-blue)', fontWeight: 700 }}>
          Technical integration detail
        </summary>
        <div className="mt-3 hs-surface-card-sm bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
          <TechnicalIntegrationTable app={app} excludeLabels={[...TECH_SPEC_EXCLUDE]} />
        </div>
      </details>
    </PdpSection>
  )
}
