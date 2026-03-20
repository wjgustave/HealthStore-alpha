import Link from 'next/link'
import Image from 'next/image'
import { getAllApps, getDashboardContent, getDashboardStats, getConditionAreas, getRemovedApps, getOpenFunding, VISIBLE_CONDITIONS } from '@/lib/data'
import { EvidenceBadge, MaturityBadge, DtacBadge, EffortBadge, FundingStatusBadge, ConditionTag } from '@/components/Badges'
import DashboardCharts from './DashboardCharts'
import { ConditionIcon } from '@/components/HealthIcons'
import { STORE_ACCENT } from '@/lib/storeAccent'

export default function HomePage() {
  const apps = getAllApps()
  const dash = getDashboardContent()
  const stats = getDashboardStats()
  const conditions = getConditionAreas()
  const removedApps = getRemovedApps()
  const openFunding = getOpenFunding()

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #003087 0%, #005EB8 60%, #0072CE 100%)' }}>
        <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_30%] md:gap-12 md:items-stretch md:min-h-[min(28rem,58vh)]">
            <div className="min-w-0 self-start" style={{ maxWidth: 680 }}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-6"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                Prototype — March 2026
              </div>
              <h1 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-hero)', lineHeight: 1.15, fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
                {dash.hero.headline}
              </h1>
              <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {dash.hero.subheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/apps" className="px-6 py-3 rounded-lg text-sm font-semibold"
                  style={{ background: '#fff', color: '#003087' }}>
                  Browse all {apps.length} apps
                </Link>
                <Link href="/funding" className="px-6 py-3 rounded-lg text-sm font-semibold border"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                  View funding
                </Link>
              </div>
            </div>
            <div
              className="relative mx-auto min-h-[14rem] w-full overflow-hidden rounded-xl md:mx-0 md:h-full md:min-h-0 md:rounded-r-xl md:rounded-l-none [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] md:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
            >
              <Image
                src="/images/home-hero.jpg"
                alt="Healthcare professionals collaborating with digital health tools"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      <div className="max-w-7xl mx-auto px-6">

        {/* Condition shortcuts */}
        <section className="mt-12 mb-10">
          <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Browse by condition
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Select a condition area to view relevant digital therapeutics.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {conditions.map(c => (
              <Link key={c.id} href={`/apps?condition=${c.id}`}
                className="app-card rounded-xl bg-white border p-4 text-center flex flex-col items-center gap-2"
                style={{ borderColor: 'var(--border)', textDecoration: 'none' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${c.colour}15`, color: c.colour }}>
                  <ConditionIcon condition={c.id} className="w-5 h-5" />
                </div>
                <div className="font-semibold" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>{c.label}</div>
                <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>{c.count} {c.count === 1 ? 'app' : 'apps'}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* How commissioners use this tool */}
        <section className="rounded-2xl border p-8 mb-10" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', fontWeight: 700, marginBottom: '0.5rem' }}>
            How commissioners use this tool
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            A three-step process from identifying local need to building a commissioning case.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Identify local need',
                description: 'Use local prevalence data and service demand to identify which condition areas would benefit from digital therapeutic support.',
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
                description: 'Use evidence summaries, financial considerations and deployment information to create a commissioner business case.',
                colour: '#330072',
              },
            ].map(item => (
              <div key={item.step} className="rounded-xl p-5" style={{ background: '#F7F9FC', border: '1px solid var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3"
                  style={{ background: item.colour }}>
                  {item.step}
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NICE context box */}
        <div className="rounded-xl border mb-10 p-5" style={{ borderColor: '#005EB8', background: '#E6F0FB' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-label)', color: '#003087', marginBottom: 4 }}>
                NICE Health Technology Evaluation HTE19 (HTG736) — COPD digital therapeutics
              </div>
              <p style={{ fontSize: 'var(--text-body)', color: '#003087', lineHeight: 1.6, margin: 0 }}>
                Published December 2024, updated September 2025. All four COPD apps are recommended for NHS use during a 3-year evidence generation period. Commissioning organisations must: (1) confirm DTAC approval, (2) have evidence generation agreements with NICE, and (3) submit annual reports to NICE.
              </p>
            </div>
            <a href="https://www.nice.org.uk/guidance/htg736" target="_blank" rel="noreferrer"
              className="badge badge-blue" style={{ whiteSpace: 'nowrap', flexShrink: 0, fontSize: 'var(--text-badge)' }}>
              NICE HTG736 ↗
            </a>
          </div>
        </div>

        {/* Featured apps */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section)', fontWeight: 700, marginBottom: '0.4rem' }}>
            Featured apps
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {apps.length} apps across {conditions.length} condition areas. Select any app for the full commissioner assessment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {apps.slice(0, 8).map((app: any) => (
              <Link key={app.id} href={`/apps/${app.slug}`}
                className="app-card rounded-xl bg-white border flex flex-col"
                style={{ borderColor: 'var(--border)', textDecoration: 'none' }}>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div className="flex items-center gap-3">
                      {app.logo_path && (
                        <Image src={app.logo_path} alt="" width={32} height={32} className="rounded-md flex-shrink-0" />
                      )}
                      <div>
                        <div style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontWeight: 700, fontSize: 'var(--text-card-title)', color: 'var(--text-primary)', marginBottom: 2 }}>{app.app_name}</div>
                        <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>{app.supplier_name}</div>
                      </div>
                    </div>
                    {app.nhse_125k_eligible && (
                      <span className="badge badge-green" style={{ flexShrink: 0 }}>★ NHSE £125k</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {app.condition_tags.map((t: string) => <ConditionTag key={t} tag={t} />)}
                  </div>
                  <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                    {app.one_line_value_proposition}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 0.75rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'Maturity', badge: <MaturityBadge level={app.maturity_level} /> },
                      { label: 'Evidence', badge: <EvidenceBadge strength={app.evidence_strength} /> },
                      { label: 'Local effort', badge: <EffortBadge level={app.local_wraparound} /> },
                      { label: 'DTAC', badge: <DtacBadge status={app.dtac_status} /> },
                    ].map(({ label, badge }) => (
                      <div key={label} style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--text-label)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
                        {badge}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg py-2 text-sm font-semibold text-center"
                    style={{ background: STORE_ACCENT, color: '#fff' }}>
                    View details →
                  </div>
                </div>
              </Link>
          ))}
        </div>

        {apps.length > 8 && (
          <div className="text-center mb-10">
            <Link href="/apps" className="px-6 py-3 rounded-lg text-sm font-semibold border"
              style={{ borderColor: 'var(--nhs-blue)', color: 'var(--nhs-blue)' }}>
              View all {apps.length} apps →
            </Link>
          </div>
        )}

        {/* Dashboard charts */}
        <DashboardCharts apps={apps} conditions={conditions} />

        {/* Impact section */}
        <section className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg,#003087,#00449E)', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Real-world impact, not just theory
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
            Key metrics from NHS deployments — caveats noted on each app page.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {(dash.featured_impact as any).examples.map((ex: any) => (
              <Link key={ex.app_slug} href={`/apps/${ex.app_slug}`}
                style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '1rem', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{ex.metric}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{ex.unit}</div>
                <div style={{ fontSize: 'var(--text-label)', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)' }}>{ex.detail}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Funding preview */}
        {openFunding.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Funding opportunities
                </h2>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
                  Open and periodic funding relevant to digital therapeutics commissioning.
                </p>
              </div>
              <Link href="/funding" className="text-sm font-semibold" style={{ color: 'var(--nhs-blue)' }}>
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {openFunding.slice(0, 4).map((f: any) => (
                <div key={f.id} className="rounded-xl bg-white border p-5" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold" style={{ fontSize: 'var(--text-card-title-sm)', color: 'var(--text-primary)' }}>{f.title}</div>
                    <FundingStatusBadge status={f.status} />
                  </div>
                  <p className="mb-3" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {f.condition_tags?.filter((t: string) => VISIBLE_CONDITIONS.includes(t)).map((t: string) => <ConditionTag key={t} tag={t} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Removed / decommissioned apps */}
        {removedApps.length > 0 && (
          <section className="mb-10">
            <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', fontWeight: 700, marginBottom: '0.5rem' }}>
              Removed or decommissioned apps
            </h2>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Previously listed apps that have been removed from the catalogue.
            </p>
            <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full" style={{ fontSize: 'var(--text-body)' }}>
                <thead>
                  <tr style={{ background: '#F7F9FC' }}>
                    <th className="text-left p-3 font-semibold uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>App</th>
                    <th className="text-left p-3 font-semibold uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>Supplier</th>
                    <th className="text-left p-3 font-semibold uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>Condition</th>
                    <th className="text-left p-3 font-semibold uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>Removed</th>
                    <th className="text-left p-3 font-semibold uppercase tracking-wide" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {removedApps.map((app, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="p-3 font-medium" style={{ color: 'var(--text-primary)' }}>{app.app_name}</td>
                      <td className="p-3" style={{ color: 'var(--text-secondary)' }}>{app.supplier_name}</td>
                      <td className="p-3" style={{ color: 'var(--text-secondary)' }}>{app.condition}</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>{app.removal_date}</td>
                      <td className="p-3" style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}>{app.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--border)', background: '#F7F9FC', marginBottom: '4rem' }}>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>About this prototype: </strong>
            {dash.about_note}
          </p>
        </div>

      </div>
    </div>
  )
}
