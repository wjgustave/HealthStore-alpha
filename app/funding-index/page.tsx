import { getAllFunding, getAllApps } from '@/lib/data'
import { FundingDirectoryCard } from '@/components/FundingDirectoryCard'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Funding index — NHS HealthStore' }

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
    showCount = true,
  }: {
    title: string
    sectionId: string
    items: typeof funding
    color: string
    showCount?: boolean
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
          {showCount && (
            <span className="badge" style={{ background: color + '22', color }}>
              {items.length}
            </span>
          )}
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
      <PageBreadcrumb items={[{ label: 'Funding index' }]} />
      <div className="hs-section">
        <h1 className="page-title-h1">Funding index</h1>
        <p
          className="m-0 leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          This Funding Index provides information on funding opportunities and integration support for NHS commissioners purchasing digital therapeutics (DTx). We encourage commissioners to confirm the availability of funding opportunities before submitting a business case applying for funding.
        </p>
      </div>

      <Section title="Currently open" sectionId="open" items={open} color="#007F3B" showCount={false} />
      <Section title="Upcoming" sectionId="upcoming" items={upcoming} color="#7A4800" showCount={false} />
      <Section title="Closed (confirm current status)" sectionId="closed" items={closed} color="#7A4800" />
    </div>
  )
}
