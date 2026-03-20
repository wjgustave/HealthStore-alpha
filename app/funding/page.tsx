import { getAllFunding, getAllApps, VISIBLE_CONDITIONS } from '@/lib/data'
import { FundingStatusBadge, ConditionTag } from '@/components/Badges'
import Link from 'next/link'

export const metadata = { title: 'Funding directory — HealthStore' }

export default function FundingPage() {
  const funding = getAllFunding()
  const apps = getAllApps()

  const open = funding.filter(f => f.status === 'open')
  const periodic = funding.filter(f => f.status === 'periodic')
  const closed = funding.filter(f => f.status === 'closed' || f.status === 'closed_confirm')

  function AppTags({ appTags }: { appTags: string[] }) {
    if (!appTags.length) return null
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {appTags.map(id => {
          const app = apps.find(a => a.id === id || a.slug === id)
          return app ? (
            <Link key={id} href={`/apps/${app.slug}`}
              className="badge badge-blue hover:underline">
              {app.app_name}
            </Link>
          ) : null
        })}
      </div>
    )
  }

  function FundingCard({ f }: { f: ReturnType<typeof getAllFunding>[0] }) {
    return (
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-base" style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}>
              {f.title}
            </h3>
            <p className="mt-0.5" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>{f.sponsoring_body}</p>
          </div>
          <FundingStatusBadge status={f.status} />
        </div>

        {f.total_value && (
          <div className="inline-block px-3 py-1 rounded-lg text-sm font-bold mb-3"
            style={{ background: '#E6F5EC', color: '#004B22' }}>
            {f.total_value}
          </div>
        )}

        <p className="mb-3 leading-relaxed" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>{f.description}</p>

        {f.closing_date_note && (
          <div className="text-xs mb-3 p-2 rounded" style={{ background: '#FEF5E6', color: '#7A4800' }}>
            📅 {f.closing_date_note}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {f.condition_tags.filter(t => VISIBLE_CONDITIONS.includes(t)).map(t => <ConditionTag key={t} tag={t} />)}
        </div>

        <AppTags appTags={f.app_tags} />

        {f.notes && (
          <p className="mt-3 leading-relaxed" style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>{f.notes}</p>
        )}

        {f.external_url && (
          <a href={f.external_url} target="_blank" rel="noreferrer"
            className="inline-block mt-4 text-sm font-medium hover:underline" style={{ color: 'var(--nhs-blue)' }}>
            {f.external_url_label} ↗
          </a>
        )}
      </div>
    )
  }

  function Section({ title, items, color }: { title: string; items: typeof funding; color: string }) {
    if (!items.length) return null
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <span className="badge" style={{ background: color + '22', color }}>{items.length}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {items.map(f => <FundingCard key={f.id} f={f} />)}
        </div>
      </section>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Funding directory
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.6 }}>
          Funding opportunities and obligations relevant to NHS commissioners procuring digital therapeutics.
          Confirm current availability with sponsoring organisations before submitting business cases.
        </p>
      </div>

      {/* Mandatory obligations note */}
      <div className="rounded-xl border p-5 mb-10" style={{ borderColor: '#005EB8', background: '#E6F0FB' }}>
        <div className="font-semibold mb-1" style={{ fontSize: 'var(--text-label)', color: '#003087' }}>📋 NICE HTE19 — mandatory evidence generation obligations</div>
        <p style={{ fontSize: 'var(--text-body)', color: '#003087', lineHeight: 1.6 }}>
          All commissioners deploying NICE HTE19-recommended COPD apps must have evidence generation agreements with NICE and submit annual reports.
          This is a condition of the recommendation — not optional. See the NICE HTE19 evidence generation entry below.
        </p>
      </div>

      <Section title="Currently open" items={open} color="#007F3B" />
      <Section title="Periodic / recurring" items={periodic} color="#005EB8" />
      <Section title="Closed (confirm current status)" items={closed} color="#D5840D" />

      <div className="mt-10 rounded-xl p-5 border text-sm" style={{ borderColor: 'var(--border)', background: '#F7F9FC', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Disclaimer: </strong>
        Funding information is based on publicly available information as of March 2026.
        Deadlines and eligibility criteria change — verify with the sponsoring organisation before use in business cases.
      </div>
    </div>
  )
}
