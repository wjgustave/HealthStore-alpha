import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ConditionIcon } from '@/components/HealthIcons'
import {
  ConditionTag,
  DtacBadge,
  EffortBadge,
  EvidenceBadge,
  MaturityBadge,
} from '@/components/Badges'
import type { App } from '@/lib/data'
import { STORE_ACCENT } from '@/lib/storeAccent'
import {
  DatasetOverviewBand,
  FundingSection,
  ImpactSection,
  NiceCalloutSection,
  PrototypeNoteSection,
  RemovedAppsSection,
  type HomeFragmentsProps,
} from './HomeFragments'

const fr: CSSProperties = { fontFamily: 'Frutiger, Arial, sans-serif' }

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

/** V1 browse grid — reused on V2 in the same position (first below hero / stats). */
export function OriginalBrowseByCondition({ conditions }: Pick<HomeFragmentsProps, 'conditions'>) {
  return (
    <section className="scroll-mt-8" aria-labelledby="browse-condition-heading-original">
      <h2
        id="browse-condition-heading-original"
        className="text-balance"
        style={{ ...fr, fontSize: 'var(--text-section)', fontWeight: 700, marginBottom: '0.35rem' }}
      >
        Browse by condition
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: '42rem' }}>
        Select a condition area to view relevant digital therapeutics.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {conditions.map((c) => (
          <Link
            key={c.id}
            href={`/apps?condition=${c.id}`}
            className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'var(--border)', textDecoration: 'none', outlineColor: '#005EB8' }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg"
              style={{ background: `${c.colour}18`, color: c.colour }}
            >
              <ConditionIcon condition={c.id} className="h-6 w-6" />
            </div>
            <div className="font-semibold" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
              {c.label}
            </div>
            <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
              {c.count} {c.count === 1 ? 'app' : 'apps'}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function OriginalCommissionerSteps() {
  return (
    <section
      className="rounded-2xl border bg-white p-6 shadow-sm md:p-8"
      style={{ borderColor: 'var(--border)' }}
      aria-labelledby="commissioner-steps-heading-original"
    >
      <h2
        id="commissioner-steps-heading-original"
        style={{ ...fr, fontSize: 'var(--text-section-alt)', fontWeight: 700, marginBottom: '0.5rem' }}
      >
        How commissioners use this tool
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '40rem' }}>
        A three-step process from identifying local need to building a commissioning case.
      </p>
      <ol className="grid gap-4 md:grid-cols-3">
        {COMMISSIONER_STEPS.map((item) => (
          <li key={item.step} className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#F7F9FC' }}>
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

function FeaturedAppsOriginal({ apps }: Pick<HomeFragmentsProps, 'apps'>) {
  const featured = apps.slice(0, 8) as App[]
  return (
    <section aria-labelledby="featured-apps-heading-original">
      <h2 id="featured-apps-heading-original" style={{ ...fr, fontSize: 'var(--text-section)', fontWeight: 700, marginBottom: '0.35rem' }}>
        Featured apps
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: '42rem' }}>
        A sample of catalogue entries — open an app for full assurance, evidence and deployment detail.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((app) => (
          <Link
            key={app.slug}
            href={`/apps/${app.slug}`}
            className="flex flex-col rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'var(--border)', textDecoration: 'none', outlineColor: '#005EB8' }}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                {app.logo_path && (
                  <Image src={app.logo_path} alt="" width={36} height={36} className="shrink-0 rounded-md object-contain" />
                )}
                <div className="min-w-0">
                  <div className="font-bold leading-tight" style={{ ...fr, fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>
                    {app.app_name}
                  </div>
                  <div className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                    {app.supplier_name}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-1">
              {app.condition_tags?.map((t: string) => (
                <ConditionTag key={t} tag={t} />
              ))}
            </div>
            <p className="mb-3 line-clamp-3 flex-1 text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
              {app.one_line_value_proposition}
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Evidence
                </div>
                <EvidenceBadge strength={app.evidence_strength} />
              </div>
              <div>
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Maturity
                </div>
                <MaturityBadge level={app.maturity_level} />
              </div>
              <div>
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Local effort
                </div>
                <EffortBadge level={app.local_wraparound} />
              </div>
              <div>
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  DTAC
                </div>
                <DtacBadge status={app.dtac_status} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/apps"
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white"
          style={{ background: STORE_ACCENT }}
        >
          View all apps →
        </Link>
      </div>
    </section>
  )
}

/** Pre–editorial homepage: stats strip in hero, browse, commissioner steps, NICE callout, featured grid, then dataset / impact / funding / removals / prototype note. */
export function HomeLayoutOriginal(props: HomeFragmentsProps) {
  return (
    <div className="flex flex-col gap-12 md:gap-14">
      <OriginalBrowseByCondition conditions={props.conditions} />
      <OriginalCommissionerSteps />
      <NiceCalloutSection />
      <FeaturedAppsOriginal apps={props.apps} />
      <DatasetOverviewBand apps={props.apps} conditions={props.conditions} />
      <ImpactSection dash={props.dash} />
      <FundingSection openFunding={props.openFunding} />
      <RemovedAppsSection removedApps={props.removedApps} />
      <PrototypeNoteSection dash={props.dash} />
    </div>
  )
}
