'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SUPPLIER_ONBOARD_BASE_PATH } from '@/lib/supplierOnboarding'
import { useOnboardingProgress } from './useOnboardingProgress'

/**
 * Onboarding submitted — confirmation. [Provenance: NHS]
 *
 * Mirrors the Expression of interest confirmation: NHS Panel with the reference
 * number, then "What happens next". Guard: without a recorded submission there
 * is nothing to confirm, so direct visits return to the task list.
 */
export default function OnboardingConfirmationPage() {
  const router = useRouter()
  const { hydrated, submission } = useOnboardingProgress()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (hydrated && !submission) router.replace(SUPPLIER_ONBOARD_BASE_PATH)
  }, [hydrated, submission, router])

  useEffect(() => {
    if (submission) {
      window.scrollTo(0, 0)
      headingRef.current?.focus()
    }
  }, [submission])

  if (!submission) return null

  return (
    <div className="hs-page">
      <div className="max-w-2xl">
        <div className="nhsuk-panel" style={{ textAlign: 'center' }}>
          <h1 ref={headingRef} tabIndex={-1} className="nhsuk-panel__title outline-none">
            Onboarding form submitted
          </h1>
          <div className="nhsuk-panel__body">
            Your reference number
            <br />
            <strong>{submission.reference}</strong>
          </div>
        </div>
        <p style={{ fontSize: 'var(--text-body)' }}>
          We have sent you a confirmation email with your reference number and a copy of your answers.
        </p>
        <h2 className="nhsuk-heading-m nhsuk-u-margin-top-6">What happens next</h2>
        <p style={{ fontSize: 'var(--text-body)' }}>
          The HealthStore onboarding team will review your submission and the evidence you have
          provided. We will contact you within 10 working days if we need any further information
          or to confirm the outcome of the review.
        </p>
        <p style={{ fontSize: 'var(--text-body)' }}>
          Your product will not be listed on the NHS HealthStore until the review is complete.
        </p>
      </div>
    </div>
  )
}
