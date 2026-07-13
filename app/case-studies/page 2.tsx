import Link from 'next/link'
import { getHomeCaseStudies } from '@/lib/data'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { CaseStudyCard } from '@/components/home/CaseStudies'

export const metadata = { title: 'Case studies — NHS HealthStore' }

export default function CaseStudiesPage() {
  const caseStudies = getHomeCaseStudies()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageBreadcrumb items={[{ label: 'Case studies' }]} />
      <div className="mb-10">
        <h1 className="page-title-h1">Case studies</h1>
        <p
          className="m-0 max-w-2xl leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          Real-world examples of how NHS systems are commissioning and scaling digital therapeutics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.id} study={study} href={study.href} />
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--nhs-blue)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--nhs-blue)' }}
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
