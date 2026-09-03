import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Preparing to recommend a DTx — NHS HealthStore' }

const PREPARING_LINKS = [
  {
    href: '/resources/preparing-to-recommend/what-the-nhs-healthstore-is',
    title: 'What The NHS HealthStore is',
  },
  {
    href: '/resources/preparing-to-recommend/using-nhs-healthstore',
    title: 'Using NHS HealthStore',
  },
  {
    href: '/resources/preparing-to-recommend/clinician-onboarding-guidance',
    title: 'Clinician onboarding guidance',
  },
  {
    href: '/resources/preparing-to-recommend/case-studies-and-best-practice',
    title: 'Case studies and best practice',
  },
  {
    href: '/resources/preparing-to-recommend/embedding-dtx-into-a-pathway',
    title: 'Embedding digital therapeutics (DTx) into a service or pathway',
  },
  {
    href: '/resources/preparing-to-recommend/identifying-suitable-patients',
    title: 'Identifying suitable patients for digital therapeutics (DTx) inclusion',
  },
  {
    href: '/resources/preparing-to-recommend/introducing-dtx-to-patients',
    title: 'How to introduce digital therapeutics (DTx) to your patients',
  },
] as const

export default function PreparingToRecommendPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb
        items={[
          { label: 'Resource library', href: '/resources' },
          { label: 'Preparing to recommend a DTx' },
        ]}
      />
      <h1 className="page-title-h1">Preparing to recommend a DTx</h1>
      <p
        className="hs-measure"
        style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 40 }}
      >
        What to understand before recommending a digital therapeutic — how The NHS HealthStore works, how to embed a
        DTx in a pathway, which patients are suitable, and how to introduce it in the consultation.
      </p>

      <ul className="nhsuk-list" style={{ maxWidth: '40rem' }}>
        {PREPARING_LINKS.map(item => (
          <li key={item.title} style={{ marginBottom: '1rem' }}>
            <Link
              href={item.href}
              className="nhsuk-link"
              style={{ fontSize: 'var(--text-body)', fontWeight: 600 }}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
