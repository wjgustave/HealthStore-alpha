import { getAllFunding, getAllApps } from '@/lib/data'
import { FundingDirectoryCard } from '@/components/FundingDirectoryCard'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Funding directory — HealthStore' }

export default function FundingPage() {
  const funding = getAllFunding()
  const apps = getAllApps()

  const open = funding.filter(f => f.status === 'open')
  const upcoming = funding.filter(f => f.status === 'upcoming' || f.status === 'periodic')
  const closed = funding.filter(f => f.status === 'closed' || f.status === 'closed_confirm')

  function Section({
    title,
    sectionId,
    items,
    color,
  }: {
    title: string
    sectionId: string
    items: typeof funding
    color: string
  }) {
    if (!items.length) return null
    const headingId = `funding-section-${sectionId}`
    return (
      <section className="hs-section-lg" aria-labelledby={headingId}>
        <div className="mb-6 flex items-center gap-4">
          <h2
            id={headingId}
            className="hs-text-section-alt hs-font-bold"
            style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
          <span className="badge" style={{ background: color + '22', color }}>
            {items.length}
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {items.map(f => (
            <FundingDirectoryCard key={f.id} f={f} apps={apps} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'Funding directory' }]} />
      <div className="hs-section">
        <h1 className="page-title-h1">Funding directory</h1>
        <p
          className="m-0 hs-measure leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          Funding opportunities and adoption support relevant to NHS commissioners procuring digital therapeutics.
          Confirm current availability with sponsoring organisations before submitting business cases.
        </p>
      </div>

      <Section title="Currently open" sectionId="open" items={open} color="#007F3B" />
      <Section title="Upcoming" sectionId="upcoming" items={upcoming} color="#7A4800" />
      <Section title="Closed (confirm current status)" sectionId="closed" items={closed} color="#7A4800" />

      <div
        className="hs-surface-card mt-10 rounded-xl border p-6 hs-text-label"
        style={{ borderColor: 'var(--border)', background: '#F0F4F5', color: 'var(--text-muted)', lineHeight: 1.6 }}
      >
        <strong style={{ color: 'var(--text-secondary)' }}>Disclaimer: </strong>
        Funding information is based on publicly available information as of March 2026. Deadlines and eligibility criteria
        change — verify with the sponsoring organisation before use in business cases.
      </div>
    </div>
  )
}
