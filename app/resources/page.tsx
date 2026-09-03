import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { ClickableChevronCard } from '@/components/ui/ClickableChevronCard'

export const metadata = { title: 'Resource library — NHS HealthStore' }

const RESOURCES = [
  {
    href: '/resources/guidance',
    title: 'Training and guidance',
    description: 'Core training materials and guidance for recommending and deploying digital therapeutics.',
  },
  {
    href: '/resources/preparing-to-recommend',
    title: 'Preparing to recommend a DTx',
    description: 'What to check before recommending a digital therapeutic — suitability, pathway fit and local readiness.',
  },
  {
    href: '/resources/prior-to-appointment',
    title: 'Prior to patient appointment',
    description: 'Preparation steps before the consultation, including patient information and enrolment readiness.',
  },
  {
    href: '/resources/during-appointment',
    title: 'During patient appointment',
    description: 'How to introduce, explain and enrol a patient onto a digital therapeutic in clinic.',
  },
  {
    href: '/resources/after-appointment',
    title: 'After a patient appointment',
    description: 'Follow-up actions after enrolment — documentation, support contacts and early engagement checks.',
  },
  {
    href: '#',
    title: 'Long-term management of a DTx',
    description: 'Ongoing monitoring, review and pathway management once a digital therapeutic is in use.',
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
          Training and practical guidance for recommending, enrolling and managing digital therapeutics with patients.
        </p>
      </div>

      {/* NHS secondary cards — same pattern as nhs.uk/nhs-services Urgent / Mental health / Vaccination */}
      <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map(item => (
          <li key={item.title} className="flex h-full min-h-0">
            <ClickableChevronCard
              variant="secondary"
              href={item.href}
              title={item.title}
              description={item.description}
              headingLevel={2}
              className="flex h-full w-full flex-col"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
