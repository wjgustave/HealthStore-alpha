import Link from 'next/link'
import { getHomeCampaigns } from '@/lib/data'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Campaigns and initiatives — HealthStore' }

export default function CampaignsPage() {
  const campaigns = getHomeCampaigns()

  return (
    <div className="hs-page-narrow">
      <PageBreadcrumb items={[{ label: 'Campaigns and initiatives' }]} />
      <div className="hs-section">
        <h1 className="page-title-h1">Campaigns and initiatives</h1>
        <p
          className="m-0 hs-measure leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          Programmes and campaigns that may shape local commissioning conversations. Placeholder page — more to follow.
        </p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-6 p-0">
        {campaigns.map((item) => (
          <li
            key={item.id}
            className="hs-surface-card-sm p-6"
          >
            {item.organisation ? (
              <p className="mb-1 hs-text-caption hs-font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {item.organisation}
              </p>
            ) : null}
            <h2 className="hs-text-card-title-sm hs-font-bold" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </h2>
            <p className="mt-1 mb-0 hs-text-label leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.summary}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <Link
          href="/"
          className="hs-text-label hs-font-bold text-[var(--nhs-blue)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--nhs-blue)' }}
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
