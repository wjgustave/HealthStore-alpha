import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import type { CaseStudy } from '@/lib/conceptHomeTypes'

const fr: CSSProperties = { fontFamily: 'Frutiger, Arial, sans-serif' }

function ExternalOrInternalLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  const external = /^https?:\/\//.test(href)
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

/**
 * Reusable case study tile: photo fills the card; navy band carries the title.
 * When `href` is omitted the card renders static (used for non-interactive home previews).
 */
export function CaseStudyCard({ study, href }: { study: CaseStudy; href?: string }) {
  const Title = (
    <span className="text-base font-bold leading-snug text-white md:text-lg" style={fr}>
      {study.title}
    </span>
  )

  return (
    <div className="hs-surface-card group flex h-full min-h-[15rem] w-full min-w-0 flex-col overflow-hidden">
      <div className="relative min-h-[10rem] flex-1 overflow-hidden">
        <Image
          src={study.image}
          alt={study.image_alt ?? ''}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 30vw"
        />
      </div>
      <div className="shrink-0 bg-[#003087] px-5 py-4">
        {href ? (
          <ExternalOrInternalLink
            href={href}
            className="flex items-end justify-between gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {Title}
            <ChevronRight className="h-5 w-5 shrink-0 text-white opacity-95" aria-hidden />
          </ExternalOrInternalLink>
        ) : (
          <div className="flex items-end justify-between gap-3">{Title}</div>
        )}
        {study.description ? (
          <p className="mt-2 mb-0 text-sm leading-relaxed text-white/80">{study.description}</p>
        ) : null}
      </div>
    </div>
  )
}

/** Large, prominent case study card used for the featured app on the home band. */
function FeaturedCaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className="hs-surface-card flex h-full min-h-[22rem] w-full min-w-0 flex-col overflow-hidden shadow-lg">
      <div className="relative min-h-[14rem] flex-1 overflow-hidden">
        <Image
          src={study.image}
          alt={study.image_alt ?? ''}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />
      </div>
      <div className="shrink-0 bg-[#003087] px-6 py-5">
        <span className="mb-2 inline-block rounded bg-white/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
          Featured
        </span>
        <h3 className="text-xl font-bold leading-snug text-white md:text-2xl" style={fr}>
          {study.title}
        </h3>
        {study.description ? (
          <p className="mt-2 mb-0 text-sm leading-relaxed text-white/80">{study.description}</p>
        ) : null}
      </div>
    </div>
  )
}

/** Compact, lower-prominence horizontal case study card for the home band sidebar. */
function CompactCaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className="hs-surface-card flex min-h-[5.5rem] w-full min-w-0 overflow-hidden">
      <div className="relative w-24 shrink-0 overflow-hidden sm:w-28">
        <Image
          src={study.image}
          alt={study.image_alt ?? ''}
          fill
          className="object-cover object-center"
          sizes="112px"
        />
      </div>
      <div className="flex min-w-0 flex-1 items-center bg-[#003087] px-4 py-3">
        <span className="text-sm font-bold leading-snug text-white" style={fr}>
          {study.title}
        </span>
      </div>
    </div>
  )
}

/** Full-width "Case studies" band for the public home — featured app card plus smaller previews, links to /case-studies. */
export function HomeCaseStudiesBand({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const featured = caseStudies.find((c) => c.id === 'featured-app') ?? caseStudies[0]
  const others = caseStudies.filter((c) => c !== featured).slice(0, 3)
  return (
    <section
      className="relative overflow-x-clip py-12 md:py-16"
      style={{ background: 'linear-gradient(135deg, #003087 0%, #00449E 55%, var(--nhs-blue) 100%)' }}
      aria-labelledby="case-studies-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 id="case-studies-heading" className="text-2xl font-bold leading-tight text-white md:text-3xl" style={fr}>
              Case studies
            </h2>
            <p className="mt-3 mb-0 text-base leading-relaxed text-white/85">
              Real-world examples of how NHS systems are commissioning and scaling digital therapeutics.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-white underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See all case studies
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          <div className="lg:col-span-2">
            <FeaturedCaseStudyCard study={featured} />
          </div>
          <div className="flex flex-col gap-4">
            {others.map((study) => (
              <CompactCaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
