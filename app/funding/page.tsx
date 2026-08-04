import { getAllFunding } from '@/lib/data'
import { FundingDirectoryCard } from '@/components/FundingDirectoryCard'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Funding index — NHS HealthStore' }

export default function FundingPage() {
  const funding = getAllFunding()

  // Live (open) and Future (upcoming/periodic) share one unheaded list; closed stays under its own heading.
  const active = funding.filter(
    f => f.status === 'open' || f.status === 'upcoming' || f.status === 'periodic',
  )
  const closed = funding.filter(f => f.status === 'closed' || f.status === 'closed_confirm')

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

      {active.length > 0 && (
        <section className="hs-section-lg" aria-label="Funding opportunities">
          <div className="flex flex-col gap-6">
            {active.map(f => (
              <FundingDirectoryCard key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}

      {closed.length > 0 && (
        <section className="hs-section-lg" aria-labelledby="funding-section-closed">
          <div className="mb-6 flex items-center gap-4">
            <h2
              id="funding-section-closed"
              className="hs-text-section-alt hs-font-bold"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}
            >
              Closed (confirm current status)
            </h2>
            <span className="badge" style={{ background: '#7A480022', color: '#7A4800' }}>
              {closed.length}
            </span>
          </div>
          <div className="flex flex-col gap-6">
            {closed.map(f => (
              <FundingDirectoryCard key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
