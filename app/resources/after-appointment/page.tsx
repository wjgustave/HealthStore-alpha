import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'After a patient appointment — NHS HealthStore' }

const AFTER_LINKS = [
  {
    href: '/resources/after-appointment/continued-access-to-alternative-care',
    title: 'Continued access to alternative care',
  },
  {
    href: '/resources/after-appointment/clinical-responsibility',
    title: 'Clinical responsibility',
  },
] as const

export default function AfterAppointmentPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb
        items={[{ label: 'Resource library', href: '/resources' }, { label: 'After a patient appointment' }]}
      />
      <h1 className="page-title-h1">After a patient appointment</h1>
      <p
        className="hs-measure"
        style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 40 }}
      >
        What happens once the consultation has ended — the care a patient is entitled to if they choose not to use a
        digital therapeutic, and who holds clinical responsibility from that point on.
      </p>

      <ul className="nhsuk-list" style={{ maxWidth: '40rem' }}>
        {AFTER_LINKS.map(item => (
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
