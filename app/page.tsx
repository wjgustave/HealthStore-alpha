import Link from 'next/link'
import Image from 'next/image'
import {
  getDashboardContent,
  getHomeNews,
  getHomeCampaigns,
  getHomeCaseStudies,
} from '@/lib/data'
import HomePublicContent from '@/components/home/HomePublicContent'

export default async function HomePage() {
  const dash = getDashboardContent()
  const news = getHomeNews()
  const campaigns = getHomeCampaigns()
  const caseStudies = getHomeCaseStudies()

  return (
    <div>
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--nhs-blue)' }}
      >
        <div
          className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 md:grid-cols-[minmax(0,1fr)_minmax(22rem,32rem)] md:gap-4 md:px-8"
          style={{
            paddingTop: '4rem',
            paddingBottom: '0.375rem',
          }}
        >
          <div className="min-w-0 pb-4 md:pb-5">
            <h1
              style={{
                fontFamily: 'Frutiger, Arial, sans-serif',
                fontSize: 'var(--text-page-title)',
                lineHeight: 'var(--leading-heading)',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '1.25rem',
              }}
            >
              {dash.hero.headline}
            </h1>
            <p
              className="text-pretty"
              style={{
                fontSize: '19px',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.5,
                marginBottom: '1.75rem',
              }}
            >
              {dash.hero.subheadline}
            </p>
            <Link href="/about" className="nhsuk-button nhsuk-button--reverse">
              Find out more
            </Link>
          </div>

          {/* Landscape illustration — top-aligned with hero copy */}
          <div className="relative mx-auto aspect-[1024/721] w-full max-w-lg md:mx-0 md:max-w-none">
            <Image
              src="/images/home-hero-illustration-v4.png"
              alt="Person using a health app at home with their dog"
              fill
              className="object-contain object-top"
              sizes="(max-width: 768px) 100vw, 32rem"
              priority
            />
          </div>
        </div>
      </section>

      <HomePublicContent
        dash={dash}
        news={news}
        campaigns={campaigns}
        caseStudies={caseStudies}
      />
    </div>
  )
}
