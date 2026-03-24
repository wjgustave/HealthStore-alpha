import Link from 'next/link'
import Image from 'next/image'
import {
  getAllApps,
  getAppBySlug,
  getConceptFeaturedContent,
  getConceptGridContent,
  getDashboardContent,
  getDashboardStats,
  getConditionAreas,
  getRemovedApps,
  getOpenFunding,
  getHomeNews,
  getHomeEvidenceSpotlights,
  getHomeCampaigns,
} from '@/lib/data'
import { parseHomeVariant } from '@/lib/homeVariant'
import ConceptStepsBand from '@/components/home/ConceptStepsBand'
import HomeBelowHeroInteractive from '@/components/home/HomeBelowHeroInteractive'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ home?: string }> }) {
  const { home } = await searchParams
  const isV2Concept = parseHomeVariant(home) === 'v2'

  const apps = getAllApps()
  const dash = getDashboardContent()
  const stats = getDashboardStats()
  const conditions = getConditionAreas()
  const removedApps = getRemovedApps()
  const openFunding = getOpenFunding()
  const news = getHomeNews()
  const evidence = getHomeEvidenceSpotlights()
  const campaigns = getHomeCampaigns()
  const conceptFeatured = getConceptFeaturedContent()
  const featuredApp = getAppBySlug(conceptFeatured.featured_app_slug)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-x-clip" style={{ background: 'linear-gradient(135deg, #003087 0%, #005EB8 60%, #0072CE 100%)' }}>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[calc(30vw+200px)] overflow-hidden md:block [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
        >
          <Image
            src="/images/home-hero.jpg"
            alt="Healthcare professionals collaborating with digital health tools"
            fill
            className="object-cover"
            sizes="calc(30vw + 200px)"
            priority
          />
        </div>
        <div
          className="relative z-10 mx-auto max-w-7xl px-6 md:min-h-[min(28rem,58vh)]"
          style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
        >
          <div className="grid grid-cols-1 gap-10">
            <div className="min-w-0 md:max-w-[min(42.5rem,calc(70vw-200px-(100vw-min(100vw,80rem))/2-3rem))]">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-6"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                Prototype — March 2026
              </div>
              <h1
                style={{
                  fontFamily: 'Frutiger, Arial, sans-serif',
                  fontSize: 'var(--text-hero)',
                  lineHeight: 1.15,
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '1.25rem',
                }}
              >
                {dash.hero.headline}
              </h1>
              <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {dash.hero.subheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/apps" className="px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: '#fff', color: '#003087' }}>
                  Browse all {apps.length} apps
                </Link>
                <Link
                  href="/funding"
                  className="px-6 py-3 rounded-lg text-sm font-semibold border"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                >
                  View funding
                </Link>
              </div>
            </div>
            <div className="relative mx-auto min-h-[14rem] w-full overflow-hidden rounded-xl md:hidden [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
              <Image
                src="/images/home-hero.jpg"
                alt="Healthcare professionals collaborating with digital health tools"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {isV2Concept ? (
        <ConceptStepsBand />
      ) : (
        <section style={{ background: '#003087' }}>
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{s.label}</div>
                <div style={{ fontSize: 'var(--text-label)', color: 'rgba(255,255,255,0.55)' }}>{s.sublabel}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <HomeBelowHeroInteractive
        apps={apps}
        dash={dash}
        conditions={conditions}
        removedApps={removedApps}
        openFunding={openFunding}
        news={news}
        evidence={evidence}
        campaigns={campaigns}
        conceptGrid={getConceptGridContent()}
        conceptFeatured={conceptFeatured}
        featuredApp={featuredApp}
      />
    </div>
  )
}
