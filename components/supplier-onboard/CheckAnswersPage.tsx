'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/ui/Button'
import {
  CHECKBOX_SEPARATOR,
  CONFIRMED_VALUE,
  CONFIRMATION_PATH,
  MULTI_UPLOAD_CONFIRMED_SUFFIX,
  SECTIONS,
  SUBMISSION_DECLARATION,
  SUPPLIER_ONBOARD_BASE_PATH,
  UPLOAD_REFERENCE_SUFFIX,
  isQuestionAnswered,
  isValidIsoDate,
  parseUploadedDocuments,
  taskStepHref,
  type OnboardingQuestion,
  type TaskAnswers,
} from '@/lib/supplierOnboarding'
import { useOnboardingProgress } from './useOnboardingProgress'

const NOT_PROVIDED = 'Not provided'

/**
 * Check your answers. [Provenance: NHS / GOV.UK "Check answers" pattern]
 *
 * Replays every answer from every section as NHS Summary lists (one per task,
 * grouped under the numbered section headings from the task list), each row
 * with a Change link back to its question page. The declaration sits above the
 * NHS green "Confirm and submit" action; confirming records a reference and
 * moves to the confirmation page.
 *
 * Guard: reachable only once every task is Completed (the Submit button that
 * leads here is disabled otherwise); direct visits are sent back to the list.
 */
export default function CheckAnswersPage() {
  const router = useRouter()
  const { hydrated, allComplete, getAnswers, completeSubmission } = useOnboardingProgress()
  const [submitting, setSubmitting] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (hydrated && !allComplete && !submitting) router.replace(SUPPLIER_ONBOARD_BASE_PATH)
  }, [hydrated, allComplete, submitting, router])

  useEffect(() => {
    if (hydrated && allComplete) headingRef.current?.focus()
  }, [hydrated, allComplete])

  if (!hydrated || !allComplete) return null

  function confirmAndSubmit() {
    if (submitting) return
    setSubmitting(true)
    completeSubmission()
    router.push(CONFIRMATION_PATH)
  }

  return (
    <div className="hs-page">
      <div className="max-w-3xl">
        <BackLink href={SUPPLIER_ONBOARD_BASE_PATH} />
        <h1 ref={headingRef} tabIndex={-1} className="page-title-h1 outline-none">
          Check your answers before submitting
        </h1>

        {SECTIONS.map((section, sectionIndex) => (
          <section key={section.id} aria-labelledby={`${section.id}-check-heading`} className="nhsuk-u-margin-bottom-7">
            <h2 id={`${section.id}-check-heading`} className="nhsuk-heading-m">
              {sectionIndex + 1}. {section.title}
            </h2>
            {section.tasks.map((task) => {
              const answers = getAnswers(task.id)
              return (
                <div key={task.id} className="nhsuk-u-margin-bottom-5">
                  {/* Task title shown only when it is not simply repeated by its single question. */}
                  {(task.questions.length !== 1 || task.questions[0].label !== task.title) && (
                    <h3 className="nhsuk-heading-s nhsuk-u-margin-bottom-2">{task.title}</h3>
                  )}
                  <dl className="nhsuk-summary-list">
                    {task.questions.map((question, index) => (
                      <div key={question.id} className="nhsuk-summary-list__row">
                        <dt className="nhsuk-summary-list__key">{question.label}</dt>
                        <dd className="nhsuk-summary-list__value">{formatAnswer(question, answers)}</dd>
                        <dd className="nhsuk-summary-list__actions">
                          <Link className="hs-link-button" href={taskStepHref(task, index + 1)}>
                            Change<span className="nhsuk-u-visually-hidden"> {question.label}</span>
                          </Link>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )
            })}
          </section>
        ))}

        <h2 className="nhsuk-heading-m">Submit your onboarding form</h2>
        <p className="nhsuk-body-m">{SUBMISSION_DECLARATION}</p>
        <Button variant="confirm" onClick={confirmAndSubmit} loading={submitting}>
          {submitting ? 'Submitting…' : 'Confirm and submit'}
        </Button>
      </div>
    </div>
  )
}

/** Human-readable replay of one answer, per question type. */
function formatAnswer(question: OnboardingQuestion, answers: TaskAnswers): ReactNode {
  const raw = answers[question.id] ?? ''
  const empty = <span className="nhsuk-u-secondary-text-color">{NOT_PROVIDED}</span>

  switch (question.type) {
    case 'radios':
      return question.options.find((o) => o.value === raw)?.label ?? empty

    case 'checkboxes': {
      const chosen = raw.split(CHECKBOX_SEPARATOR).filter(Boolean)
      const labels = question.options.filter((o) => chosen.includes(o.value)).map((o) => o.label)
      return labels.length > 0 ? labels.join(', ') : empty
    }

    case 'textarea':
      return raw.trim() ? <span style={{ whiteSpace: 'pre-wrap' }}>{raw.trim()}</span> : empty

    case 'date': {
      if (!isValidIsoDate(raw)) return empty
      const [y, m, d] = raw.split('-').map(Number)
      return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    case 'upload': {
      if (!isQuestionAnswered(question, answers)) return empty
      return (
        <>
          {answers[`${question.id}${UPLOAD_REFERENCE_SUFFIX}`]}
          <br />
          <span className="nhsuk-u-secondary-text-color nhsuk-body-s">{raw}</span>
        </>
      )
    }

    case 'multi-upload': {
      const docs = parseUploadedDocuments(raw)
      const confirmed = answers[`${question.id}${MULTI_UPLOAD_CONFIRMED_SUFFIX}`] === CONFIRMED_VALUE
      if (docs.length === 0) return empty
      return (
        <>
          <ul className="nhsuk-list nhsuk-u-margin-bottom-2">
            {docs.map((doc, i) => (
              <li key={`${doc.uploadedAt}-${i}`}>
                {doc.reference}
                <br />
                <span className="nhsuk-u-secondary-text-color nhsuk-body-s">{doc.name}</span>
              </li>
            ))}
          </ul>
          <span className="nhsuk-body-s nhsuk-u-margin-bottom-0">
            {docs.length} {docs.length === 1 ? 'document' : 'documents'}
            {confirmed ? ', marked as complete' : ''}
          </span>
        </>
      )
    }
  }
}
