import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import type { ConceptFeaturedContent, ConceptGridContent } from '@/lib/conceptHomeTypes'
import type { App } from '@/lib/data'
import type { HomeCampaignItem, HomeNewsItem } from '@/lib/homeContentTypes'
import {
  ConditionTag,
  DtacBadge,
  EffortBadge,
  EvidenceBadge,
  MaturityBadge,
} from '@/components/Badges'
import { EditorialImage } from './EditorialImage'
import { EditorialPillRow } from './EditorialPills'
import { formatHomeDate } from './formatDate'
import {
  DatasetOverviewBand,
  FundingSection,
  ImpactSection,
  PrototypeNoteSection,
  RemovedAppsSection,
  type HomeFragmentsProps,
} from './HomeFragments'
import { OriginalBrowseByCondition } from './HomeLayoutOriginal'
import { STORE_ACCENT } from '@/lib/storeAccent'

const fr: CSSProperties = { fontFamily: 'Frutiger, Arial, sans-serif' }

export type HomeLayoutV4Props = HomeFragmentsProps & {
  conceptGrid: ConceptGridContent
  conceptFeatured: ConceptFeaturedContent
  featuredApp: App | undefined
}

function ExternalConceptLink({
  href,
  className,
  style,
  children,
}: {
  href: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const external = /^https?:\/\//.test(href)
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  )
}

/** Figma-style story tile: photo fills most of the card; navy band is only as tall as the headline (more image, less blue). */
function ConceptStoryCard({ story }: { story: ConceptGridContent['story'] }) {
  return (
    <div className="group flex h-full min-h-[min(28rem,70vh)] w-full min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-md lg:min-h-[26rem]">
      <div className="relative min-h-[15rem] flex-1 overflow-hidden">
        <Image
          src={story.image}
          alt={story.alt ?? ''}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 38vw"
          priority
        />
      </div>
      <div className="shrink-0 bg-[#003087] px-5 py-4 md:px-6 md:py-5">
        <ExternalConceptLink
          href={story.href}
          className="flex items-end justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="text-lg font-bold leading-snug text-white md:text-xl" style={fr}>
            {story.title}
          </span>
          <ChevronRight className="h-6 w-6 shrink-0 text-white opacity-95" aria-hidden />
        </ExternalConceptLink>
      </div>
    </div>
  )
}

function promoImageClassName(promoId: string): string {
  const base = 'h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.06]'
  if (promoId === 'dtx-ready') {
    return `${base} scale-[1.14] [object-position:42%_42%]`
  }
  if (promoId === 'patient-help') {
    return `${base} origin-bottom scale-[1.32] [object-position:50%_92%]`
  }
  return 'h-full w-full object-cover'
}

function ConceptPromoCard({ promo }: { promo: ConceptGridContent['promos'][0] }) {
  const isNavy = promo.variant === 'navy'
  return (
    <div
      className={`flex min-h-[11rem] min-w-0 flex-1 basis-0 flex-row overflow-hidden rounded-xl shadow-md lg:min-h-0 ${isNavy ? 'bg-[#003087]' : 'bg-[#330072]'}`}
    >
      <div className={`flex min-h-0 min-w-0 flex-1 flex-col justify-center px-5 py-5 ${isNavy ? 'order-1' : 'order-2'}`}>
        <ExternalConceptLink
          href={promo.href}
          className="group flex items-start justify-between gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <div>
            <h3 className="text-base font-bold leading-snug text-white md:text-lg" style={fr}>
              {promo.title}
            </h3>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-white/80">{promo.description}</p>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/90" aria-hidden />
        </ExternalConceptLink>
      </div>
      <div
        className={`group/img relative min-h-[7.5rem] w-[42%] shrink-0 self-stretch overflow-hidden sm:w-[40%] lg:min-h-0 ${isNavy ? 'order-2' : 'order-1'}`}
      >
        <Image
          src={promo.image}
          alt={promo.image_alt ?? ''}
          fill
          className={promoImageClassName(promo.id)}
          sizes="(max-width: 640px) 42vw, 220px"
        />
      </div>
    </div>
  )
}

function CommissionedWidget({ commissioned }: { commissioned: ConceptGridContent['commissioned'] }) {
  return (
    <div
      className="flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border bg-white p-5 shadow-md"
      style={{ borderColor: 'var(--border)' }}
    >
      <h3 className="mb-1 text-lg font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
        {commissioned.title}
      </h3>
      <p className="mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        {commissioned.illustrative_note}
      </p>
      <div className="mb-4 flex items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {commissioned.app_display_name}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
          style={{ background: commissioned.status_variant === 'live' ? '#007F3B' : '#005EB8' }}
        >
          {commissioned.status_label}
        </span>
      </div>
      <ul className="m-0 min-h-0 flex-1 list-none space-y-4 p-0">
        {commissioned.metrics.map((m) => (
          <li key={m.label}>
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {m.label}
            </div>
            <div className="text-2xl font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
              {m.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {m.sublabel}
            </div>
          </li>
        ))}
      </ul>
      <ExternalConceptLink
        href={commissioned.dashboard_href}
        className="mt-5 flex shrink-0 items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ borderColor: 'var(--border)', color: '#005EB8', outlineColor: '#005EB8' }}
      >
        {commissioned.dashboard_label}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </ExternalConceptLink>
    </div>
  )
}

function NewsListConcept({ news }: { news: HomeNewsItem[] }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-md" style={{ borderColor: 'var(--border)' }}>
      <h3 className="mb-4 text-lg font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
        Latest news
      </h3>
      <ul className="m-0 list-none p-0">
        {news.map((item) => (
          <li key={item.id} className="border-t border-[var(--border)] pt-5 first:border-t-0 first:pt-0">
            <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} />
            <time className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }} dateTime={item.date}>
              {formatHomeDate(item.date)}
            </time>
            <ExternalConceptLink href={item.href} className="mt-1 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
              <span className="font-bold text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</span>
            </ExternalConceptLink>
            <p className="mt-1 mb-0 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CampaignsColumnConcept({ campaigns }: { campaigns: HomeCampaignItem[] }) {
  const featured = campaigns.find((c) => c.featured) ?? campaigns[0]
  const rest = campaigns.filter((c) => c !== featured)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold md:px-1" style={{ ...fr, color: 'var(--text-primary)' }}>
        Campaigns and initiatives
      </h3>
      {featured && (
        <div className="overflow-hidden rounded-xl bg-[#003087] shadow-md">
          <div className="relative aspect-[2/1] w-full min-h-[120px] max-h-[180px] overflow-hidden sm:aspect-[21/8]">
            <EditorialImage
              itemId={featured.id}
              imageKey={featured.image_key}
              alt=""
              className="object-cover object-[82%_center] sm:object-[80%_center]"
              priority
            />
          </div>
          <div className="px-5 py-4">
            <span className="mb-2 inline-block rounded bg-white/15 px-2 py-0.5 text-xs font-bold text-white">Featured</span>
            <ExternalConceptLink href={featured.href} className="flex items-start justify-between gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <span className="font-bold text-white" style={fr}>
                {featured.title}
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-white" aria-hidden />
            </ExternalConceptLink>
            <p className="mt-2 mb-0 text-sm text-white/80">{featured.summary}</p>
          </div>
        </div>
      )}
      <ul className="m-0 list-none space-y-3 p-0">
        {rest.map((item) => (
          <li key={item.id} className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} className="mb-1" />
            <ExternalConceptLink href={item.href} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
              <span className="font-bold text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</span>
            </ExternalConceptLink>
            <p className="mt-1 mb-0 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {item.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FeaturedTherapeuticBand({
  concept,
  app,
}: {
  concept: ConceptFeaturedContent
  app: App | undefined
}) {
  return (
    <section
      className="relative overflow-x-clip py-12 md:py-16"
      style={{ background: 'linear-gradient(135deg, #003087 0%, #00449E 55%, #005EB8 100%)' }}
      aria-labelledby="featured-therapeutic-heading"
    >
      <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-6 lg:grid-cols-12 lg:gap-10 lg:px-0 lg:pl-6 lg:pr-0">
        <div className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-7 lg:pr-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="w-full max-w-[340px] shrink-0 rounded-xl border bg-white p-5 shadow-lg" style={{ borderColor: 'var(--border)' }}>
              <div className="mb-1 inline-block rounded-full bg-gradient-to-r from-[#005EB8] to-[#41B6E6] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {concept.badge_label}
              </div>
              {app ? (
                <>
                  <div className="mb-3 flex items-center gap-3">
                    {app.logo_path && (
                      <Image src={app.logo_path} alt="" width={40} height={40} className="rounded-md object-contain" />
                    )}
                    <div>
                      <div className="font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
                        {app.app_name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {app.supplier_name}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {app.condition_tags?.map((t: string) => <ConditionTag key={t} tag={t} />)}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {app.one_line_value_proposition}
                  </p>
                  <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="mb-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        Maturity
                      </div>
                      <MaturityBadge level={app.maturity_level} />
                    </div>
                    <div>
                      <div className="mb-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        Evidence
                      </div>
                      <EvidenceBadge strength={app.evidence_strength} />
                    </div>
                    <div>
                      <div className="mb-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        Local effort
                      </div>
                      <EffortBadge level={app.local_wraparound} />
                    </div>
                    <div>
                      <div className="mb-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        DTAC
                      </div>
                      <DtacBadge status={app.dtac_status} />
                    </div>
                  </div>
                  <Link
                    href={`/apps/${app.slug}`}
                    className="block w-full rounded-lg py-3 text-center text-sm font-semibold text-white"
                    style={{ background: STORE_ACCENT }}
                  >
                    View details →
                  </Link>
                </>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  App &quot;{concept.featured_app_slug}&quot; not found in catalogue.
                </p>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="featured-therapeutic-heading" className="text-2xl font-bold leading-tight text-white md:text-3xl" style={fr}>
                {concept.headline}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/85">{concept.body}</p>
            </div>
          </div>
        </div>
        <div
          className="relative order-1 min-h-[220px] w-full min-w-0 overflow-hidden rounded-xl lg:order-2 lg:col-span-5 lg:min-h-[360px] lg:-mt-16 lg:-mb-16 lg:rounded-none lg:rounded-l-2xl lg:w-[calc(100%+max(0px,(100vw-80rem)/2))] lg:-mr-[max(0px,calc((100vw-80rem)/2))]"
        >
          <Image
            src={concept.right_image}
            alt={concept.right_image_alt}
            fill
            className="object-cover object-[50%_32%]"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
        </div>
      </div>
    </section>
  )
}

export function HomeLayoutV4(props: HomeLayoutV4Props) {
  const { conceptGrid, conceptFeatured, featuredApp, ...rest } = props
  const [promoA, promoB] = conceptGrid.promos

  return (
    <div className="home-v4 flex flex-col gap-12 md:gap-14" style={{ background: 'var(--surface)' }}>
      <OriginalBrowseByCondition conditions={rest.conditions} />
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-6">
        <div className="flex min-h-0 lg:col-span-5">
          <ConceptStoryCard story={conceptGrid.story} />
        </div>
        <div className="flex min-h-0 flex-col gap-4 lg:col-span-4 lg:h-full lg:min-h-[26rem]">
          {promoA && <ConceptPromoCard promo={promoA} />}
          {promoB && <ConceptPromoCard promo={promoB} />}
        </div>
        <div className="flex min-h-0 lg:col-span-3">
          <CommissionedWidget commissioned={conceptGrid.commissioned} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <NewsListConcept news={rest.news} />
        <CampaignsColumnConcept campaigns={rest.campaigns} />
      </div>

      <FeaturedTherapeuticBand concept={conceptFeatured} app={featuredApp} />

      <DatasetOverviewBand apps={rest.apps} conditions={rest.conditions} hideNiceGuidance />
      <ImpactSection dash={rest.dash} />
      <FundingSection openFunding={rest.openFunding} />
      <RemovedAppsSection removedApps={rest.removedApps} />
      <PrototypeNoteSection dash={rest.dash} />
    </div>
  )
}
