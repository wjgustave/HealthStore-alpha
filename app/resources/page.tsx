import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Resource library — NHS HealthStore' }

const RESOURCES = [
  {
    href: '#',
    title: 'Guidance and evidence',
    description: 'Evidence standards, buyer guidance and methods for commissioning digital therapeutics.',
  },
  {
    href: '#',
    title: 'Digital commissioning toolkits',
    description: 'Practical materials to plan, mobilise and evaluate digital therapeutic deployments.',
  },
  {
    href: '#',
    title: 'Campaigns',
    description: 'National and regional programmes relevant to digital health commissioning.',
  },
  {
    href: '#',
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
          Guidance, digital commissioning toolkits, campaigns and case studies to support commissioning decisions.
        </p>
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
        {RESOURCES.map(item => (
          <li key={item.title} className="min-h-0">
            <Link
              href={item.href}
              className="app-card group flex h-full min-h-0 flex-col p-6 text-left no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: 'inherit', outlineColor: 'var(--nhs-blue)' }}
            >
              <h2
                className="m-0 hs-font-bold underline underline-offset-2"
                style={{
                  fontFamily: 'Frutiger, Arial, sans-serif',
                  fontSize: 'var(--text-card-title-sm)',
                  color: 'var(--nhs-blue)',
                }}
              >
                {item.title}
              </h2>
              <p
                className="mb-0 mt-2 leading-relaxed"
                style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.55 }}
              >
                {item.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
