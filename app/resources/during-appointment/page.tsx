import Link from 'next/link'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export const metadata = { title: 'During the appointment — NHS HealthStore' }

const DURING_LINKS = [
  {
    href: '/resources/during-appointment/how-dtx-improve-outcomes',
    title: 'How digital therapeutics (DTx) improve patient outcomes',
  },
  {
    href: '/resources/during-appointment/why-nhs-england-advocates-dtx',
    title: 'Why NHS England is an advocate of digital therapeutics (DTx)',
  },
  {
    href: '/resources/during-appointment/what-is-expected-of-patients',
    title: 'Make it clear what is expected of patients and keep it simple',
  },
  {
    href: '/resources/during-appointment/clinical-software-integration',
    title: 'Integration with clinical software',
  },
  {
    href: '/resources/during-appointment/overcoming-barriers',
    title: 'Overcoming barriers to using DTx',
  },
] as const

export default function DuringAppointmentPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb
        items={[{ label: 'Resource library', href: '/resources' }, { label: 'During the appointment' }]}
      />
      <h1 className="page-title-h1">During the appointment</h1>
      <p
        className="hs-measure"
        style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 40 }}
      >
        What to cover in the consultation — the case for digital therapeutics, what to expect of patients, how the
        recommendation reaches them, and how to work around the barriers they may face.
      </p>

      <ul className="nhsuk-list" style={{ maxWidth: '40rem' }}>
        {DURING_LINKS.map(item => (
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
