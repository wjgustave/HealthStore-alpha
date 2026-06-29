import Link from 'next/link'
import type { HomeCampaignItem, HomeEvidenceSpotlight, HomeNewsItem } from '@/lib/homeContentTypes'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

/** Minimal app shape for the home dataset band / dashboard variant props. */
export type HomeDashboardApp = {
  slug: string
  condition_tags?: string[]
  maturity_level?: string
  nice_guidance_refs?: { ref?: string }[]
}

export type HomeFundingPreview = {
  id: string
  title: string
  description: string
  status: string
  condition_tags?: string[]
}

export type HomeImpactExample = {
  app_slug: string
  metric: string
  unit: string
  detail: string
}

export type HomeDashSlice = {
  about_note: string
  featured_impact?: { examples: HomeImpactExample[] }
}

export type HomeFragmentsProps = {
  apps: HomeDashboardApp[]
  dash: HomeDashSlice
  conditions: { id: string; label: string; colour: string; count: number; icon: string }[]
  removedApps: { app_name: string; supplier_name: string; condition: string; removal_date: string; reason: string }[]
  openFunding: HomeFundingPreview[]
  news: HomeNewsItem[]
  evidence: HomeEvidenceSpotlight[]
  campaigns: HomeCampaignItem[]
}

export function ImpactSection({ dash }: Pick<HomeFragmentsProps, 'dash'>) {
  const examples = dash.featured_impact?.examples ?? []
  return (
    <section className="rounded-2xl p-6 md:p-8" style={{ background: 'linear-gradient(135deg,#003087,#00449E)' }} aria-labelledby="impact-heading">
      <h2 id="impact-heading" className="hs-text-lede hs-font-bold" style={{ ...fr, color: '#fff', marginBottom: '0.5rem' }}>
        Real-world impact, not just theory
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.75)', marginBottom: '1.75rem', maxWidth: '36rem', lineHeight: 'var(--leading-body)' }}>
        Key metrics from NHS deployments — caveats noted on each app page.
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {examples.map((ex) => (
          <Link
            key={ex.app_slug}
            href={`/apps/${ex.app_slug}`}
            className="block rounded-xl p-4 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ background: 'rgba(255,255,255,0.1)', textDecoration: 'none' }}
          >
            <div className="hs-text-section-alt hs-font-bold" style={{ ...fr, color: '#fff' }}>{ex.metric}</div>
            <div className="hs-text-label hs-font-bold text-white">{ex.unit}</div>
            <div className="mt-1 hs-text-caption md:hs-text-label" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 'var(--leading-body)' }}>
              {ex.detail}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function PrototypeNoteSection({ dash }: Pick<HomeFragmentsProps, 'dash'>) {
  return (
    <aside
      className="rounded-xl border border-dashed p-6 md:p-6"
      style={{ borderColor: '#94A3B8', background: '#F8FAFC' }}
      aria-label="Prototype notice"
    >
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
        <strong style={{ color: 'var(--text-secondary)' }}>About this prototype: </strong>
        {dash.about_note}
      </p>
    </aside>
  )
}
