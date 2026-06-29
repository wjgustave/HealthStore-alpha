import Link from 'next/link'
import { getHomeCaseStudies } from '@/lib/data'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { CaseStudyCard } from '@/components/home/CaseStudies'

export const metadata = { title: 'Case studies — HealthStore' }

export default function CaseStudiesPage() {
  const caseStudies = getHomeCaseStudies()

  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'Case studies' }]} />
      <div className="hs-section">
        <h1 className="page-title-h1">Case studies</h1>
        <p
          className="m-0 hs-measure leading-relaxed"
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
          className="hs-text-label hs-font-bold text-[var(--nhs-blue)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--nhs-blue)' }}
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
