import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import DashboardCharts from '@/app/DashboardCharts'
import { ConditionIcon } from '@/components/HealthIcons'
import { ConditionTag, FundingStatusBadge } from '@/components/Badges'
import type { HomeCampaignItem, HomeEvidenceSpotlight, HomeNewsItem } from '@/lib/homeContentTypes'
import { isVisibleCondition } from '@/lib/visibleConditions'
import { EditorialEvidenceMetaRow, EditorialPillRow } from './EditorialPills'
import { EditorialImage } from './EditorialImage'
import { formatHomeDate } from './formatDate'

/** Editorial blocks: left NHS blue accent, soft surface — distinct from product PDP cards */
const editorialShadow = 'shadow-[0_2px_12px_rgba(15,23,42,0.06)]'
const editorialInset = 'rounded-2xl border-l-4 border-[#005EB8] bg-slate-50/95 py-4 pl-4 pr-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)]'
const editorialPanel = 'overflow-hidden rounded-2xl bg-slate-50/90 ring-1 ring-slate-200/70'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

/** Minimal app shape for `DashboardCharts` and home dataset band */
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

function ExternalLink({
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

export function BrowseByConditionSection({ conditions }: Pick<HomeFragmentsProps, 'conditions'>) {
  return (
    <section className="scroll-mt-8" aria-labelledby="browse-condition-heading">
      <div className="border-l-4 pl-5 md:pl-6" style={{ borderColor: '#005EB8' }}>
        <h2
          id="browse-condition-heading"
          className="text-balance"
          style={{ ...fr, fontSize: 'var(--text-section)', fontWeight: 700, marginBottom: '0.35rem' }}
        >
          Browse by condition
        </h2>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: '42rem' }}>
          Select a condition area to view relevant digital therapeutics.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {conditions.map((c) => (
          <Link
            key={c.id}
            href={`/apps/browse?condition=${encodeURIComponent(c.id)}`}
            className="group flex gap-4 rounded-xl border bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'var(--border)', textDecoration: 'none', outlineColor: '#005EB8' }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${c.colour}18`, color: c.colour }}
            >
              <ConditionIcon condition={c.id} className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                {c.label}
              </div>
              <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
                {c.count} {c.count === 1 ? 'app' : 'apps'}
              </div>
              <span className="mt-1 inline-block text-sm font-semibold text-[#005EB8] group-hover:underline">View apps</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

const COMMISSIONER_STEPS = [
  {
    step: '1',
    title: 'Identify local need',
    description:
      'Use local prevalence data and service demand to identify which condition areas would benefit from digital therapeutic support.',
    colour: '#005EB8',
  },
  {
    step: '2',
    title: 'Review DTx options',
    description: 'Browse apps by condition, evidence strength, NICE status, assurance, deployment effort and cost model.',
    colour: '#007F3B',
  },
  {
    step: '3',
    title: 'Build your case',
    description:
      'Use evidence summaries, financial considerations and deployment information to create a commissioner business case.',
    colour: '#330072',
  },
] as const

export function CommissionerStepsSection() {
  return (
    <section className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm" style={{ borderColor: 'var(--border)' }} aria-labelledby="commissioner-steps-heading">
      <h2
        id="commissioner-steps-heading"
        style={{ ...fr, fontSize: 'var(--text-section-alt)', fontWeight: 700, marginBottom: '0.5rem' }}
      >
        How commissioners use this tool
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '40rem' }}>
        A three-step process from identifying local need to building a commissioning case.
      </p>
      <ol className="grid gap-5 md:grid-cols-3">
        {COMMISSIONER_STEPS.map((item) => (
          <li
            key={item.step}
            className="rounded-xl border bg-[#F8FAFC] p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex gap-4">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: item.colour }}
              >
                {item.step}
              </div>
              <div className="min-w-0">
                <h3 className="mb-2 font-bold" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function NiceCalloutSection() {
  return (
    <aside
      className="rounded-xl border p-5 md:p-6"
      style={{ borderColor: '#005EB8', background: 'linear-gradient(180deg, #E8F2FC 0%, #E6F0FB 100%)' }}
      aria-label="NICE COPD digital therapeutics guidance"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: '#003087' }}>
            Guidance note
          </p>
          <h2 className="mb-2 text-base font-bold md:text-lg" style={{ color: '#003087' }}>
            NICE Health Technology Evaluation HTE19 (HTG736) — COPD digital therapeutics
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: '#003087', lineHeight: 1.65, margin: 0 }}>
            Published December 2024, updated September 2025. All four COPD apps are recommended for NHS use during a 3-year evidence generation period.
            Commissioning organisations must: (1) confirm DTAC approval, (2) have evidence generation agreements with NICE, and (3) submit annual reports to NICE.
          </p>
        </div>
        <a
          href="https://www.nice.org.uk/guidance/htg736"
          target="_blank"
          rel="noopener noreferrer"
          className="badge badge-blue shrink-0 self-start whitespace-nowrap text-center"
          style={{ fontSize: 'var(--text-badge)' }}
        >
          NICE HTG736 ↗
        </a>
      </div>
    </aside>
  )
}

function NewsEmpty() {
  return <p className="text-sm text-[var(--text-muted)]">No news items at the moment.</p>
}

export function NewsSectionV1({ news }: Pick<HomeFragmentsProps, 'news'>) {
  if (!news.length) return <NewsEmpty />
  return (
    <ul className="space-y-4">
      {news.map((item) => (
        <li key={item.id} className={editorialInset}>
          <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} />
          <time className="mb-2 block text-sm" style={{ color: 'var(--text-muted)' }} dateTime={item.date}>
            {formatHomeDate(item.date)}
          </time>
          <ExternalLink href={item.href} className="block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
            <span className="text-lg font-bold text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</span>
          </ExternalLink>
          <p className="mt-2 mb-0" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {item.summary}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function NewsSectionV2({ news }: Pick<HomeFragmentsProps, 'news'>) {
  if (!news.length) return <NewsEmpty />
  const [featured, ...rest] = news
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-slate-50/95 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
          <div className="relative aspect-[16/10] w-full shrink-0 lg:aspect-[4/3]">
            <EditorialImage itemId={featured.id} imageKey={featured.image_key} alt="" className="object-cover" priority />
          </div>
          <div className="flex min-h-0 flex-1 flex-col border-l-4 border-[#005EB8] p-5">
            <span className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#005EB8' }}>
              Featured
            </span>
            <EditorialPillRow topics={featured.topic_tags} conditions={featured.condition_tags} />
            <time className="mb-2 text-sm" style={{ color: 'var(--text-muted)' }} dateTime={featured.date}>
              {formatHomeDate(featured.date)}
            </time>
            <ExternalLink href={featured.href} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
              <h3 className="text-xl font-bold leading-snug text-[var(--text-primary)] hover:text-[#005EB8]">{featured.title}</h3>
            </ExternalLink>
            <p className="mt-2 flex-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {featured.summary}
            </p>
          </div>
        </article>
      </div>
      <ul className="space-y-3 lg:col-span-2">
        {rest.map((item) => (
          <li key={item.id} className={editorialInset}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} />
                <ExternalLink href={item.href} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
                  <span className="font-bold text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</span>
                </ExternalLink>
                <p className="mt-1 mb-0 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {item.summary}
                </p>
              </div>
              <time className="shrink-0 text-sm whitespace-nowrap sm:pt-6" style={{ color: 'var(--text-muted)' }} dateTime={item.date}>
                {formatHomeDate(item.date)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function NewsSectionV3({ news }: Pick<HomeFragmentsProps, 'news'>) {
  if (!news.length) return <NewsEmpty />
  return (
    <div className={editorialPanel}>
      <ul className="divide-y divide-slate-200/80">
        {news.map((item) => (
          <li key={item.id} className="px-3 py-2.5 sm:px-4">
            <div className="grid gap-2 sm:grid-cols-12 sm:items-center sm:gap-3">
              <div className="flex items-center gap-2 sm:col-span-2">
                <div className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-md sm:block">
                  <EditorialImage itemId={item.id} imageKey={item.image_key} alt="" className="object-cover" />
                </div>
                <time className="text-xs font-medium whitespace-nowrap sm:text-sm" style={{ color: 'var(--text-muted)' }} dateTime={item.date}>
                  {formatHomeDate(item.date)}
                </time>
              </div>
              <div className="sm:col-span-7">
                <ExternalLink href={item.href} className="text-sm font-semibold sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: 'var(--text-primary)', outlineColor: '#005EB8' }}>
                  {item.title}
                </ExternalLink>
                <p className="mt-0.5 line-clamp-2 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.summary}
                </p>
              </div>
              <div className="flex flex-wrap justify-start sm:col-span-3 sm:justify-end">
                <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} className="mb-0 justify-end" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EvidenceEmpty() {
  return <p className="text-sm text-[var(--text-muted)]">No clinical evidence spotlights at the moment.</p>
}

export function EvidenceSectionV1({ evidence }: Pick<HomeFragmentsProps, 'evidence'>) {
  if (!evidence.length) return <EvidenceEmpty />
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {evidence.map((item) => (
        <li key={item.id} className={editorialInset}>
          <EditorialEvidenceMetaRow evidenceType={item.evidence_type} conditions={item.condition_tags} />
          <time className="mb-2 mt-1 block text-sm" style={{ color: 'var(--text-muted)' }} dateTime={item.date}>
            {formatHomeDate(item.date)}
          </time>
          <ExternalLink href={item.href} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
            <span className="text-base font-bold text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</span>
          </ExternalLink>
          <p className="mt-2 mb-0 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {item.dek}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function EvidenceSectionV2({ evidence }: Pick<HomeFragmentsProps, 'evidence'>) {
  if (!evidence.length) return <EvidenceEmpty />
  return (
    <div className="space-y-4">
      {evidence.map((item) => (
        <article key={item.id} className={`flex flex-col overflow-hidden rounded-2xl bg-slate-50/95 sm:flex-row ${editorialShadow}`}>
          <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:h-auto sm:w-40 sm:min-h-[148px]">
            <EditorialImage itemId={item.id} imageKey={item.image_key} alt="" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col border-l-4 border-[#005EB8] p-4 sm:py-5 sm:pr-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <EditorialEvidenceMetaRow evidenceType={item.evidence_type} conditions={item.condition_tags} />
              <time className="text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }} dateTime={item.date}>
                {formatHomeDate(item.date)}
              </time>
            </div>
            <ExternalLink href={item.href} className="mt-2 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
              <h3 className="text-lg font-bold text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</h3>
            </ExternalLink>
            <p className="m-0 mt-1 max-w-3xl" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {item.dek}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}

export function EvidenceSectionV3({ evidence }: Pick<HomeFragmentsProps, 'evidence'>) {
  if (!evidence.length) return <EvidenceEmpty />
  return (
    <div className={`overflow-x-auto ${editorialPanel}`}>
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/90 bg-slate-100/80">
            <th className="p-3 font-semibold" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-label)' }}>
              Type / condition
            </th>
            <th className="p-3 font-semibold" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-label)' }}>
              Summary
            </th>
            <th className="w-28 p-3 font-semibold" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-label)' }}>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {evidence.map((item) => (
            <tr key={item.id} className="border-t border-slate-200/80">
              <td className="align-top p-3">
                <EditorialEvidenceMetaRow evidenceType={item.evidence_type} conditions={item.condition_tags} />
              </td>
              <td className="align-top p-3">
                <ExternalLink href={item.href} className="font-semibold text-[var(--text-primary)] hover:text-[#005EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
                  {item.title}
                </ExternalLink>
                <p className="mt-1 mb-0 text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  {item.dek}
                </p>
              </td>
              <td className="align-top p-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                <time dateTime={item.date}>{formatHomeDate(item.date)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CampaignsEmpty() {
  return <p className="text-sm text-[var(--text-muted)]">No campaigns listed at the moment.</p>
}

export function CampaignsSectionV1({ campaigns }: Pick<HomeFragmentsProps, 'campaigns'>) {
  if (!campaigns.length) return <CampaignsEmpty />
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {campaigns.map((item, index) => {
        const showBanner = index === 0 || item.image_key
        return (
        <li key={item.id} className={`flex flex-col overflow-hidden rounded-2xl bg-slate-50/95 ${editorialShadow}`}>
          {showBanner && (
            <div className="relative aspect-[21/9] w-full max-h-[120px] shrink-0">
              <EditorialImage itemId={item.id} imageKey={item.image_key} alt="" className="object-cover" priority={index === 0} />
            </div>
          )}
          <div className={showBanner ? 'flex flex-1 flex-col border-l-4 border-[#005EB8] p-5' : `${editorialInset} flex flex-1 flex-col`}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {item.organisation}
            </p>
            <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} />
            <ExternalLink href={item.href} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
              <span className="text-base font-bold text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</span>
            </ExternalLink>
            <p className="mt-2 flex-1 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {item.summary}
            </p>
            <span className="mt-3 text-sm font-semibold text-[#005EB8]">Read more ↗</span>
          </div>
        </li>
        )
      })}
    </ul>
  )
}

export function CampaignsSectionV2({ campaigns }: Pick<HomeFragmentsProps, 'campaigns'>) {
  if (!campaigns.length) return <CampaignsEmpty />
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {campaigns.map((item, index) => {
        const showBanner = index === 0 || item.image_key
        return (
        <li key={item.id} className={`flex flex-col overflow-hidden rounded-2xl bg-slate-50/95 transition-shadow hover:shadow-md ${editorialShadow}`}>
          {showBanner && (
            <div className="relative aspect-[21/9] w-full min-h-[96px] max-h-[160px] shrink-0">
              <EditorialImage itemId={item.id} imageKey={item.image_key} alt="" className="object-cover" priority={index === 0} />
            </div>
          )}
          <div className={showBanner ? 'flex flex-1 flex-col border-l-4 border-[#005EB8] p-5 md:p-6' : `${editorialInset} flex flex-1 flex-col md:py-6`}>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md px-2.5 py-1 text-xs font-bold" style={{ color: '#003087', background: 'rgba(0, 48, 135, 0.08)' }}>
                {item.organisation}
              </span>
            </div>
            <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} />
            <ExternalLink href={item.href} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
              <h3 className="text-xl font-bold leading-snug text-[var(--text-primary)] hover:text-[#005EB8]">{item.title}</h3>
            </ExternalLink>
            <p className="mt-2 flex-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {item.summary}
            </p>
          </div>
        </li>
        )
      })}
    </ul>
  )
}

export function CampaignsSectionV3({ campaigns }: Pick<HomeFragmentsProps, 'campaigns'>) {
  if (!campaigns.length) return <CampaignsEmpty />
  return (
    <ul className="space-y-2">
      {campaigns.map((item) => (
        <li key={item.id}>
          <ExternalLink
            href={item.href}
            className="flex flex-col gap-2 rounded-xl bg-slate-50/95 py-3 pl-4 pr-3 shadow-sm transition-colors hover:bg-slate-100/90 sm:flex-row sm:items-center sm:justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderLeft: '4px solid #005EB8', outlineColor: '#005EB8' }}
          >
            <div className="flex min-w-0 flex-1 gap-3 sm:items-center">
              <div className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:block">
                <EditorialImage itemId={item.id} imageKey={item.image_key} alt="" className="object-cover" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {item.organisation}
                </span>
                <div className="font-semibold text-[var(--text-primary)]">{item.title}</div>
                <EditorialPillRow topics={item.topic_tags} conditions={item.condition_tags} className="mb-0 mt-1" />
              </div>
            </div>
            <span className="shrink-0 text-sm font-semibold text-[#005EB8]">Open ↗</span>
          </ExternalLink>
        </li>
      ))}
    </ul>
  )
}

export function DatasetOverviewBand({
  apps,
  conditions,
  hideNiceGuidance,
}: Pick<HomeFragmentsProps, 'apps' | 'conditions'> & { hideNiceGuidance?: boolean }) {
  return (
    <div className="rounded-2xl border bg-[#F1F5F9] p-6 md:p-8" style={{ borderColor: '#CBD5E1' }}>
      <div className="mb-6 max-w-2xl">
        <h2 style={{ ...fr, fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          Dataset overview
        </h2>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Catalogue composition and assurance signals — use alongside individual app pages for local due diligence.
        </p>
      </div>
      <DashboardCharts apps={apps} conditions={conditions} hideOuterHeading hideNiceGuidance={hideNiceGuidance} />
    </div>
  )
}

export function ImpactSection({ dash }: Pick<HomeFragmentsProps, 'dash'>) {
  const examples = dash.featured_impact?.examples ?? []
  return (
    <section className="rounded-2xl p-6 md:p-8" style={{ background: 'linear-gradient(135deg,#003087,#00449E)' }} aria-labelledby="impact-heading">
      <h2 id="impact-heading" style={{ ...fr, fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
        Real-world impact, not just theory
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.75)', marginBottom: '1.75rem', maxWidth: '36rem' }}>
        Key metrics from NHS deployments — caveats noted on each app page.
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {examples.map((ex) => (
          <Link
            key={ex.app_slug}
            href={`/apps/${ex.app_slug}`}
            className="block rounded-xl p-4 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ background: 'rgba(255,255,255,0.1)', textDecoration: 'none' }}
          >
            <div style={{ ...fr, fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>{ex.metric}</div>
            <div className="text-sm font-semibold text-white">{ex.unit}</div>
            <div className="mt-1 text-xs leading-snug md:text-[var(--text-label)]" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.45 }}>
              {ex.detail}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function FundingSection({ openFunding }: Pick<HomeFragmentsProps, 'openFunding'>) {
  if (!openFunding.length) return null
  return (
    <section aria-labelledby="funding-heading">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="funding-heading" style={{ ...fr, fontSize: 'var(--text-section-alt)', fontWeight: 700, marginBottom: '0.25rem' }}>
            Funding opportunities
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', margin: 0, maxWidth: '36rem' }}>
            Open and upcoming funding relevant to digital therapeutics commissioning.
          </p>
        </div>
        <Link href="/funding" className="text-sm font-semibold whitespace-nowrap text-[#005EB8] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: '#005EB8' }}>
          View all →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {openFunding.slice(0, 4).map((f) => (
          <div key={f.id} className="rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div className="font-semibold" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                {f.title}
              </div>
              <FundingStatusBadge status={f.status} />
            </div>
            <p className="mb-3" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {f.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {f.condition_tags?.filter(isVisibleCondition).map((t) => <ConditionTag key={t} tag={t} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function RemovedAppsSection({ removedApps }: Pick<HomeFragmentsProps, 'removedApps'>) {
  if (!removedApps.length) return null
  return (
    <section aria-labelledby="removed-heading">
      <h2 id="removed-heading" style={{ ...fr, fontSize: 'var(--text-section-alt)', fontWeight: 700, marginBottom: '0.5rem' }}>
        Removed or decommissioned apps
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1rem', maxWidth: '40rem' }}>
        Previously listed apps that have been removed from the catalogue.
      </p>
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full min-w-[640px]" style={{ fontSize: 'var(--text-body)' }}>
          <caption className="sr-only">Removed or decommissioned applications</caption>
          <thead>
            <tr className="border-b bg-[#F8FAFC]" style={{ borderColor: 'var(--border)' }}>
              {['App', 'Supplier', 'Condition', 'Removed', 'Reason'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="p-3 text-left font-semibold uppercase tracking-wide"
                  style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {removedApps.map((app, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="p-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {app.app_name}
                </td>
                <td className="p-3" style={{ color: 'var(--text-secondary)' }}>
                  {app.supplier_name}
                </td>
                <td className="p-3" style={{ color: 'var(--text-secondary)' }}>
                  {app.condition}
                </td>
                <td className="p-3" style={{ color: 'var(--text-muted)' }}>
                  {app.removal_date}
                </td>
                <td className="p-3" style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}>
                  {app.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function PrototypeNoteSection({ dash }: Pick<HomeFragmentsProps, 'dash'>) {
  return (
    <aside
      className="rounded-xl border border-dashed p-5 md:p-6"
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

function SectionIntro({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description: string
}) {
  return (
    <header className="mb-5 border-l-4 pl-5" style={{ borderColor: '#003087' }}>
      <h2 id={id} style={{ ...fr, fontSize: 'var(--text-section)', fontWeight: 700, marginBottom: '0.35rem' }}>
        {title}
      </h2>
      <p className="mb-0 max-w-2xl" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {description}
      </p>
    </header>
  )
}

export function HomeLayoutV1(props: HomeFragmentsProps) {
  return (
    <div className="flex flex-col gap-12 md:gap-14">
      <BrowseByConditionSection conditions={props.conditions} />
      <CommissionerStepsSection />
      <NiceCalloutSection />
      <section aria-labelledby="news-heading-v1">
        <SectionIntro
          id="news-heading-v1"
          title="Latest news — digital therapeutics"
          description="Curated updates for commissioners: policy, guidance and system context. External links open in a new tab."
        />
        <NewsSectionV1 news={props.news} />
      </section>
      <section aria-labelledby="evidence-heading-v1">
        <SectionIntro
          id="evidence-heading-v1"
          title="New clinical evidence and guidance"
          description="Short summaries with evidence type and relevant condition tags — verify before formal use."
        />
        <EvidenceSectionV1 evidence={props.evidence} />
      </section>
      <section aria-labelledby="campaigns-heading-v1">
        <SectionIntro
          id="campaigns-heading-v1"
          title="Campaigns and national initiatives"
          description="Programmes and campaigns that may shape local commissioning conversations."
        />
        <CampaignsSectionV1 campaigns={props.campaigns} />
      </section>
      <DatasetOverviewBand apps={props.apps} conditions={props.conditions} />
      <ImpactSection dash={props.dash} />
      <FundingSection openFunding={props.openFunding} />
      <RemovedAppsSection removedApps={props.removedApps} />
      <PrototypeNoteSection dash={props.dash} />
    </div>
  )
}

export function HomeLayoutV2(props: HomeFragmentsProps) {
  return (
    <div className="flex flex-col gap-14 md:gap-16">
      <BrowseByConditionSection conditions={props.conditions} />
      <CommissionerStepsSection />
      <NiceCalloutSection />
      <section aria-labelledby="news-heading-v2">
        <SectionIntro
          id="news-heading-v2"
          title="Latest news — digital therapeutics"
          description="Featured story plus further headlines — topic and condition pills on each item."
        />
        <NewsSectionV2 news={props.news} />
      </section>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
        <section aria-labelledby="evidence-heading-v2">
          <SectionIntro
            id="evidence-heading-v2"
            title="Clinical evidence spotlights"
            description="Condensed entries for board papers and clinical assurance discussions."
          />
          <EvidenceSectionV2 evidence={props.evidence} />
        </section>
        <section aria-labelledby="campaigns-heading-v2">
          <SectionIntro
            id="campaigns-heading-v2"
            title="Campaigns and initiatives"
            description="Wider context from national bodies and partners."
          />
          <CampaignsSectionV2 campaigns={props.campaigns} />
        </section>
      </div>
      <DatasetOverviewBand apps={props.apps} conditions={props.conditions} />
      <ImpactSection dash={props.dash} />
      <FundingSection openFunding={props.openFunding} />
      <RemovedAppsSection removedApps={props.removedApps} />
      <PrototypeNoteSection dash={props.dash} />
    </div>
  )
}

export function HomeLayoutV3(props: HomeFragmentsProps) {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <BrowseByConditionSection conditions={props.conditions} />
      <CommissionerStepsSection />
      <NiceCalloutSection />
      <section aria-labelledby="news-heading-v3">
        <SectionIntro
          id="news-heading-v3"
          title="Latest news — digital therapeutics"
          description="Compact briefing layout for quick scanning."
        />
        <NewsSectionV3 news={props.news} />
      </section>
      <section aria-labelledby="evidence-heading-v3">
        <SectionIntro
          id="evidence-heading-v3"
          title="Clinical evidence — table view"
          description="Evidence type and conditions at a glance."
        />
        <EvidenceSectionV3 evidence={props.evidence} />
      </section>
      <section aria-labelledby="campaigns-heading-v3">
        <SectionIntro
          id="campaigns-heading-v3"
          title="Campaigns"
          description="Dense list with organisation and tags."
        />
        <CampaignsSectionV3 campaigns={props.campaigns} />
      </section>
      <DatasetOverviewBand apps={props.apps} conditions={props.conditions} />
      <ImpactSection dash={props.dash} />
      <FundingSection openFunding={props.openFunding} />
      <RemovedAppsSection removedApps={props.removedApps} />
      <PrototypeNoteSection dash={props.dash} />
    </div>
  )
}
