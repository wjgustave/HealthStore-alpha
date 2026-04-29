import Link from 'next/link'
import Image from 'next/image'
import {
  getAllApps,
  getAppBySlug,
  getConceptFeaturedContent,
  getConceptGridContent,
  getDashboardContent,
  getConditionAreas,
  getRemovedApps,
  getOpenFunding,
  getHomeNews,
  getHomeEvidenceSpotlights,
  getHomeCampaigns,
} from '@/lib/data'
import HomeBelowHeroInteractive from '@/components/home/HomeBelowHeroInteractive'
import HomeHeroSearch from '@/components/home/HomeHeroSearch'

export default async function HomePage() {
  const apps = getAllApps()
  const dash = getDashboardContent()
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
            <div className="min-w-0 md:max-w-[min(56rem,calc(70vw-200px-(100vw-min(100vw,80rem))/2-3rem))]">
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
              <p
                className="text-pretty"
                style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '1.75rem' }}
              >
                {dash.hero.subheadline}
              </p>
              <div className="mb-6">
                <Link
                  href="/apps"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold transition-opacity hover:opacity-95"
                  style={{ background: '#fff', color: '#003087' }}
                >
                  Find apps
                </Link>
              </div>
              <p
                className="mb-2 text-base font-semibold"
                style={{ color: 'rgba(255,255,255,0.92)' }}
              >
                Or search
              </p>
              <HomeHeroSearch />
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
