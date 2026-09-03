import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'Prior to patient appointment — NHS HealthStore' }

const PRIOR_LINKS = [
  {
    href: '/resources/prior-to-appointment/ardens-templates',
    title: 'Ensuring Ardens templates are updated to include digital therapeutics',
  },
  {
    href: '/resources/prior-to-appointment/self-management-and-remote-care',
    title: 'What we mean by Self-management, Remote Management and Remote Monitoring',
  },
  {
    href: '/resources/prior-to-appointment/patient-challenges',
    title: 'Recognition of the challenges that patients might have',
  },
] as const

export default function PriorToAppointmentPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb
        items={[
          { label: 'Resource library', href: '/resources' },
          { label: 'Prior to patient appointment' },
        ]}
      />
      <h1 className="page-title-h1">Prior to patient appointment</h1>
      <p
        className="hs-measure"
        style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 40 }}
      >
        Preparation before the consultation — making sure your templates capture digital therapeutics, understanding
        the different models of remote care, and recognising the barriers some patients face.
      </p>

      <ul className="nhsuk-list" style={{ maxWidth: '40rem' }}>
        {PRIOR_LINKS.map(item => (
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
