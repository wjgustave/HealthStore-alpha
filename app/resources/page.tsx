import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Resource library — HealthStore' }

const RESOURCES = [
  {
    href: '/resources/guidance',
    title: 'Guidance and evidence',
    description: 'Evidence standards, buyer guidance and methods for commissioning digital therapeutics.',
  },
  {
    href: '/resources/news',
    title: 'News',
    description: 'Curated updates for commissioners: policy, guidance and system context.',
  },
  {
    href: '/resources/campaigns',
    title: 'Campaigns',
    description: 'National and regional programmes relevant to digital health commissioning.',
  },
  {
    href: '/resources/case-studies',
    title: 'Case studies',
    description: 'Real-world deployment stories and outcomes from NHS settings.',
  },
] as const

export default function ResourcesPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'Resource library' }]} />
      <div className="hs-section">
        <h1 className="page-title-h1">Resource library</h1>
        <p
          className="m-0 hs-measure leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          Guidance, news, campaigns and case studies to support commissioning decisions.
        </p>
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
        {RESOURCES.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="hs-surface-card-sm block h-full p-6 no-underline transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: 'var(--nhs-blue)', color: 'inherit' }}
            >
              <h2 className="m-0 hs-text-card-title-sm hs-font-bold" style={{ color: 'var(--nhs-blue)' }}>
                {item.title}
              </h2>
              <p className="mt-2 mb-0 hs-text-label leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
