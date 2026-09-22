'use client'

import { useRouter } from 'next/navigation'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/ui/Button'
import { SUPPLIER_ONBOARD_BASE_PATH, type OnboardingSection, type OnboardingTask } from '@/lib/supplierOnboarding'

/**
 * Placeholder page for an onboarding task whose questions have not been
 * authored yet. Once `questions` are added in lib/supplierOnboarding.ts the
 * route renders TaskQuestionPage instead and this is no longer shown.
 */
export default function TaskStubPage({
  task,
  section,
}: {
  task: OnboardingTask
  section: OnboardingSection
}) {
  const router = useRouter()

  return (
    <div className="hs-page">
      <div className="max-w-2xl">
        <BackLink href={SUPPLIER_ONBOARD_BASE_PATH} />
        <span className="nhsuk-caption-l">{section.title}</span>
        <h1 className="page-title-h1">{task.title}</h1>

        <div className="nhsuk-inset-text">
          <span className="nhsuk-u-visually-hidden">Information: </span>
          <p>Questions for this task will be added here.</p>
        </div>

        <Button type="button" variant="secondary" onClick={() => router.push(SUPPLIER_ONBOARD_BASE_PATH)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
