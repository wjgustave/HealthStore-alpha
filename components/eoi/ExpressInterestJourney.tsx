'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useEoi } from '@/components/EoiProvider'
import { Button } from '@/components/ui/Button'
import { FormField, TextInput, Textarea } from '@/components/ui/FormField'

/**
 * Express interest journey — GOV.UK question-page pattern built from NHS
 * design system components (form groups, checkboxes, radios, error summary,
 * summary list, confirmation panel). One question per page; a working back
 * link on every step; submission goes through the existing EOI store.
 *
 * Steps: start → details → verify email (prototype OTP 123456) → support →
 * timing → check answers (submits) → confirmation.
 */

const HELP_OPTIONS = [
  { id: 'assess_fit', label: 'Assess pathway fit' },
  { id: 'business_case', label: 'Build or review a business case' },
  { id: 'assurance', label: 'Clarify assurance and local work' },
  { id: 'commercial_route', label: 'Commercial route and buyer pack' },
  { id: 'implementation', label: 'Implementation planning' },
  { id: 'other', label: 'Other' },
] as const

const TIMELINE_OPTIONS = [
  { id: 'immediate', label: 'Within 3 months' },
  { id: 'medium', label: '3 to 6 months' },
  { id: 'planning', label: '6 to 12 months' },
  { id: 'exploratory', label: 'Exploratory only' },
] as const

const PROTOTYPE_OTP = '123456'

type Step = 'start' | 'details' | 'help' | 'timing' | 'check' | 'verify' | 'done'

const STEP_ORDER: Step[] = ['start', 'details', 'verify', 'help', 'timing', 'check', 'done']

type FieldError = { field: string; message: string }

function BackLink({ onClick, href }: { onClick?: () => void; href?: string }) {
  const inner = (
    <>
      <svg
        className="nhsuk-icon nhsuk-icon__chevron-left"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        height="24"
        width="24"
      >
        <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z" />
      </svg>
      Back
    </>
  )
  return (
    <div className="nhsuk-back-link">
      {href ? (
        <Link href={href} className="nhsuk-back-link__link">
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className="nhsuk-back-link__link">
          {inner}
        </button>
      )}
    </div>
  )
}

function ErrorSummary({ errors }: { errors: FieldError[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [errors])
  if (errors.length === 0) return null
  return (
    <div
      ref={ref}
      className="nhsuk-error-summary"
      aria-labelledby="eoi-error-summary-title"
      role="alert"
      tabIndex={-1}
    >
      <h2 className="nhsuk-error-summary__title" id="eoi-error-summary-title">
        There is a problem
      </h2>
      <div className="nhsuk-error-summary__body">
        <ul className="nhsuk-list nhsuk-error-summary__list">
          {errors.map((e) => (
            <li key={e.field}>
              <a href={`#${e.field}`}>{e.message}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ExpressInterestJourney({
  appId,
  appName,
  appSlug,
}: {
  appId: string
  appName: string
  appSlug: string
}) {
  const { submit } = useEoi()

  const [step, setStep] = useState<Step>('start')
  /** Set when the user arrives at a question via a Change link on Check your answers. */
  const [returnToCheck, setReturnToCheck] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [phone, setPhone] = useState('')
  const [help, setHelp] = useState<string[]>([])
  const [helpOtherDetails, setHelpOtherDetails] = useState('')
  const [timeline, setTimeline] = useState('')
  const [population, setPopulation] = useState('')
  const [notes, setNotes] = useState('')
  const [otp, setOtp] = useState('')

  const [errors, setErrors] = useState<FieldError[]>([])
  const [submitting, setSubmitting] = useState(false)

  /** Seconds until the prototype code can be resent; every (re)send starts a 30s cooldown. */
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendConfirmation, setResendConfirmation] = useState('')
  /** The imaginary code is first "sent" when the user reaches the verify step. */
  const codeSentRef = useRef(false)

  useEffect(() => {
    if (step === 'verify' && !codeSentRef.current) {
      codeSentRef.current = true
      setResendCooldown(30)
    }
  }, [step])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    headingRef.current?.focus()
  }, [step])

  function errorFor(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message
  }

  function goTo(next: Step) {
    setErrors([])
    setStep(next)
  }

  function goBack() {
    if (returnToCheck) {
      setReturnToCheck(false)
      goTo('check')
      return
    }
    const i = STEP_ORDER.indexOf(step)
    if (i > 0) goTo(STEP_ORDER[i - 1])
  }

  function changeAnswer(target: Step) {
    setReturnToCheck(true)
    goTo(target)
  }

  function continueFrom(next: Step, stepErrors: FieldError[]) {
    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors([])
    if (returnToCheck) {
      setReturnToCheck(false)
      setStep('check')
      return
    }
    setStep(next)
  }

  function validateDetails(): FieldError[] {
    const errs: FieldError[] = []
    if (!name.trim()) errs.push({ field: 'eoi-name', message: 'Enter your full name' })
    if (!email.trim()) {
      errs.push({ field: 'eoi-email', message: 'Enter your NHS work email address' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.push({
        field: 'eoi-email',
        message: 'Enter an email address in the correct format, like name@nhs.net',
      })
    }
    if (!role.trim()) errs.push({ field: 'eoi-role', message: 'Enter your role' })
    if (!organisation.trim()) errs.push({ field: 'eoi-org', message: 'Enter your organisation' })
    return errs
  }

  function handleResendCode() {
    if (resendCooldown > 0) return
    setResendCooldown(30)
    setResendConfirmation(
      `We have sent a new code to ${email.trim() || 'your NHS work email address'}. In this prototype the code is still ${PROTOTYPE_OTP}.`,
    )
  }

  function handleVerify(e: FormEvent) {
    e.preventDefault()
    continueFrom(
      'help',
      otp.trim() !== PROTOTYPE_OTP
        ? [{ field: 'eoi-otp', message: 'Enter the correct one-time code' }]
        : [],
    )
  }

  async function handleSubmit() {
    if (submitting) return
    setErrors([])
    setSubmitting(true)
    try {
      const helpLabels = HELP_OPTIONS.filter((o) => help.includes(o.id)).map((o) =>
        o.id === 'other' && helpOtherDetails.trim() ? `Other (${helpOtherDetails.trim()})` : o.label,
      )
      const combinedNotes = [
        helpLabels.length > 0 ? `Support requested: ${helpLabels.join(', ')}` : '',
        notes.trim(),
      ]
        .filter(Boolean)
        .join('\n\n')
      await submit({
        appId,
        appName,
        name,
        role,
        organisation,
        email,
        phone,
        population_estimate: population,
        timeline,
        notes: combinedNotes,
      })
      goTo('done')
    } catch (err) {
      setErrors([
        {
          field: 'eoi-check-answers',
          message:
            err instanceof Error ? err.message : 'Could not register your expression of interest.',
        },
      ])
    } finally {
      setSubmitting(false)
    }
  }

  const timelineLabel = TIMELINE_OPTIONS.find((o) => o.id === timeline)?.label ?? 'Not provided'
  const helpSummary =
    HELP_OPTIONS.filter((o) => help.includes(o.id))
      .map((o) =>
        o.id === 'other' && helpOtherDetails.trim()
          ? `Other (${helpOtherDetails.trim()})`
          : o.label,
      )
      .join(', ') || 'Not provided'

  return (
    <div className="hs-page">
      <div className="max-w-2xl">
        {step === 'start' && (
          <>
            <BackLink href={`/apps/${appSlug}`} />
            <h1 ref={headingRef} tabIndex={-1} className="page-title-h1 outline-none">
              Express interest in {appName}
            </h1>
            <div className="nhsuk-inset-text">
              <span className="nhsuk-u-visually-hidden">Information: </span>
              <p>
                This registers an expression of interest with the NHS HealthStore commissioning
                support team. It is not a purchase or a procurement award.
              </p>
            </div>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
              We will ask for your details, what support you need and your timing. It takes about 2
              minutes. A member of the commissioning support team will then contact you.
            </p>
            <Button onClick={() => goTo('details')}>Continue</Button>
          </>
        )}

        {step === 'details' && (
          <>
            <BackLink onClick={goBack} />
            <ErrorSummary errors={errors} />
            <h1 ref={headingRef} tabIndex={-1} className="page-title-h1 outline-none">
              Your details
            </h1>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                continueFrom('verify', validateDetails())
              }}
            >
              <FormField id="eoi-name" label="Full name" required error={errorFor('eoi-name')}>
                {(field) => (
                  <TextInput
                    {...field}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    spellCheck={false}
                  />
                )}
              </FormField>
              <FormField
                id="eoi-email"
                label="NHS work email address"
                required
                error={errorFor('eoi-email')}
              >
                {(field) => (
                  <TextInput
                    {...field}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    spellCheck={false}
                  />
                )}
              </FormField>
              <FormField id="eoi-role" label="Role" required error={errorFor('eoi-role')}>
                {(field) => (
                  <TextInput {...field} value={role} onChange={(e) => setRole(e.target.value)} />
                )}
              </FormField>
              <FormField
                id="eoi-org"
                label="Organisation or ICB"
                required
                error={errorFor('eoi-org')}
              >
                {(field) => (
                  <TextInput
                    {...field}
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    autoComplete="organization"
                  />
                )}
              </FormField>
              <FormField id="eoi-phone" label="Phone (optional)">
                {(field) => (
                  <TextInput
                    {...field}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    spellCheck={false}
                    className="nhsuk-input--width-20"
                  />
                )}
              </FormField>
              <Button type="submit">Continue</Button>
            </form>
          </>
        )}

        {step === 'verify' && (
          <>
            <BackLink onClick={goBack} />
            <ErrorSummary errors={errors} />
            <h1 ref={headingRef} tabIndex={-1} className="page-title-h1 outline-none">
              Verify your email
            </h1>
            <div className="nhsuk-inset-text">
              <span className="nhsuk-u-visually-hidden">Information: </span>
              <p>
                Prototype: enter code <strong>{PROTOTYPE_OTP}</strong>. In a live service we would
                email a one-time code to {email.trim() || 'your NHS work email address'}.
              </p>
            </div>
            <form noValidate onSubmit={handleVerify}>
              <FormField id="eoi-otp" label="One-time code" required error={errorFor('eoi-otp')}>
                {(field) => (
                  <TextInput
                    {...field}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    spellCheck={false}
                    className="nhsuk-input--width-5"
                  />
                )}
              </FormField>
              <Button type="submit">Continue</Button>
            </form>
            <details className="nhsuk-details mt-6">
              <summary className="nhsuk-details__summary">
                <span className="nhsuk-details__summary-text">I did not receive an email</span>
              </summary>
              <div className="nhsuk-details__text">
                <p>
                  It can take a few minutes for the email to arrive. You need to wait 30 seconds
                  before a new code can be sent.
                </p>
                <p>
                  Check your junk or spam folder — emails from the NHS HealthStore can sometimes
                  end up there.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
                </Button>
                {resendConfirmation ? (
                  <p role="status" style={{ marginTop: 8 }}>
                    {resendConfirmation}
                  </p>
                ) : null}
              </div>
            </details>
          </>
        )}

        {step === 'help' && (
          <>
            <BackLink onClick={goBack} />
            <ErrorSummary errors={errors} />
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                const stepErrors: FieldError[] = []
                if (help.length === 0) {
                  stepErrors.push({
                    field: `eoi-help-${HELP_OPTIONS[0].id}`,
                    message: 'Select what support you need',
                  })
                }
                if (help.includes('other') && !helpOtherDetails.trim()) {
                  stepErrors.push({
                    field: 'eoi-help-other-details',
                    message: 'Give more details about the support you need',
                  })
                }
                continueFrom('timing', stepErrors)
              }}
            >
              <div
                className={`nhsuk-form-group${errorFor(`eoi-help-${HELP_OPTIONS[0].id}`) ? ' nhsuk-form-group--error' : ''}`}
              >
                <fieldset className="nhsuk-fieldset" aria-describedby="eoi-help-hint">
                  <legend className="nhsuk-fieldset__legend">
                    <h1 ref={headingRef} tabIndex={-1} className="page-title-h1 outline-none nhsuk-fieldset__heading">
                      What support do you need?
                    </h1>
                  </legend>
                  <div id="eoi-help-hint" className="nhsuk-hint">
                    Select all that apply.
                  </div>
                  {errorFor(`eoi-help-${HELP_OPTIONS[0].id}`) ? (
                    <span className="nhsuk-error-message" role="alert">
                      <span className="nhsuk-u-visually-hidden">Error:</span> Select what help you
                      need
                    </span>
                  ) : null}
                  <div className="nhsuk-checkboxes nhsuk-checkboxes--conditional">
                    {HELP_OPTIONS.map((o) => {
                      const isOther = o.id === 'other'
                      return (
                        <Fragment key={o.id}>
                          <div className="nhsuk-checkboxes__item">
                            <input
                              className="nhsuk-checkboxes__input"
                              id={`eoi-help-${o.id}`}
                              type="checkbox"
                              checked={help.includes(o.id)}
                              aria-controls={isOther ? 'conditional-eoi-help-other' : undefined}
                              aria-expanded={isOther ? help.includes('other') : undefined}
                              onChange={(e) =>
                                setHelp((s) =>
                                  e.target.checked ? [...s, o.id] : s.filter((x) => x !== o.id),
                                )
                              }
                            />
                            <label
                              className="nhsuk-checkboxes__label nhsuk-label"
                              htmlFor={`eoi-help-${o.id}`}
                            >
                              {o.label}
                            </label>
                          </div>
                          {isOther && help.includes('other') ? (
                            <div
                              className="nhsuk-checkboxes__conditional"
                              id="conditional-eoi-help-other"
                            >
                              <FormField
                                id="eoi-help-other-details"
                                label="Give more details"
                                required
                                error={errorFor('eoi-help-other-details')}
                              >
                                {(field) => (
                                  <TextInput
                                    {...field}
                                    value={helpOtherDetails}
                                    onChange={(e) => setHelpOtherDetails(e.target.value)}
                                  />
                                )}
                              </FormField>
                            </div>
                          ) : null}
                        </Fragment>
                      )
                    })}
                  </div>
                </fieldset>
              </div>
              <Button type="submit">Continue</Button>
            </form>
          </>
        )}

        {step === 'timing' && (
          <>
            <BackLink onClick={goBack} />
            <h1 ref={headingRef} tabIndex={-1} className="page-title-h1 outline-none">
              Timing and context
            </h1>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                continueFrom('check', [])
              }}
            >
              <div className="nhsuk-form-group">
                <fieldset className="nhsuk-fieldset">
                  <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--s">
                    Desired timeline (optional)
                  </legend>
                  <div className="nhsuk-radios">
                    {TIMELINE_OPTIONS.map((o) => (
                      <div key={o.id} className="nhsuk-radios__item">
                        <input
                          className="nhsuk-radios__input"
                          id={`eoi-timeline-${o.id}`}
                          type="radio"
                          name="eoi-timeline"
                          checked={timeline === o.id}
                          onChange={() => setTimeline(o.id)}
                        />
                        <label
                          className="nhsuk-radios__label nhsuk-label"
                          htmlFor={`eoi-timeline-${o.id}`}
                        >
                          {o.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <FormField
                id="eoi-population"
                label="Estimated patient population (optional)"
                hint="For example, 2,000 COPD patients."
              >
                {(field) => (
                  <TextInput
                    {...field}
                    value={population}
                    onChange={(e) => setPopulation(e.target.value)}
                    className="nhsuk-input--width-20"
                  />
                )}
              </FormField>
              <FormField
                id="eoi-notes"
                label="Additional context (optional)"
                hint="Do not enter patient-identifiable information."
              >
                {(field) => (
                  <Textarea
                    {...field}
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                )}
              </FormField>
              <Button type="submit">Continue</Button>
            </form>
          </>
        )}

        {step === 'check' && (
          <>
            <BackLink onClick={goBack} />
            <ErrorSummary errors={errors} />
            <h1 ref={headingRef} tabIndex={-1} className="page-title-h1 outline-none">
              Check your answers
            </h1>
            <dl className="nhsuk-summary-list" id="eoi-check-answers">
              <div className="nhsuk-summary-list__row nhsuk-summary-list__row--no-actions">
                <dt className="nhsuk-summary-list__key">Product</dt>
                <dd className="nhsuk-summary-list__value">{appName}</dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Full name</dt>
                <dd className="nhsuk-summary-list__value">{name}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('details')}>
                    Change<span className="nhsuk-u-visually-hidden"> your details</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Email</dt>
                <dd className="nhsuk-summary-list__value">{email}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('details')}>
                    Change<span className="nhsuk-u-visually-hidden"> email</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Role</dt>
                <dd className="nhsuk-summary-list__value">{role}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('details')}>
                    Change<span className="nhsuk-u-visually-hidden"> role</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Organisation</dt>
                <dd className="nhsuk-summary-list__value">{organisation}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('details')}>
                    Change<span className="nhsuk-u-visually-hidden"> organisation</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Phone</dt>
                <dd className="nhsuk-summary-list__value">{phone.trim() || 'Not provided'}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('details')}>
                    Change<span className="nhsuk-u-visually-hidden"> phone</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Support requested</dt>
                <dd className="nhsuk-summary-list__value">{helpSummary}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('help')}>
                    Change<span className="nhsuk-u-visually-hidden"> what support you need</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Desired timeline</dt>
                <dd className="nhsuk-summary-list__value">{timelineLabel}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('timing')}>
                    Change<span className="nhsuk-u-visually-hidden"> desired timeline</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Patient population</dt>
                <dd className="nhsuk-summary-list__value">{population.trim() || 'Not provided'}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('timing')}>
                    Change<span className="nhsuk-u-visually-hidden"> patient population</span>
                  </button>
                </dd>
              </div>
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Additional context</dt>
                <dd className="nhsuk-summary-list__value">{notes.trim() || 'Not provided'}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <button type="button" className="hs-link-button" onClick={() => changeAnswer('timing')}>
                    Change<span className="nhsuk-u-visually-hidden"> additional context</span>
                  </button>
                </dd>
              </div>
            </dl>
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
              By continuing you agree that prototype data will be stored for demonstration
              purposes.
            </p>
            <Button onClick={() => void handleSubmit()} loading={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </Button>
          </>
        )}

        {step === 'done' && (
          <>
            <div className="nhsuk-panel" style={{ textAlign: 'center' }}>
              <h1 ref={headingRef} tabIndex={-1} className="nhsuk-panel__title outline-none">
                Expression of interest submitted
              </h1>
              <div className="nhsuk-panel__body">
                Your reference number
                <br />
                <strong>HSC6589L</strong>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-body)' }}>
              We have sent you a confirmation email with your reference number.
            </p>
            <h2 className="nhsuk-heading-m nhsuk-u-margin-top-6">What happens next</h2>
            <p style={{ fontSize: 'var(--text-body)' }}>
              A member of the HealthStore commissioning support team will be in touch within 5
              working days to discuss next steps.
            </p>
            <h2 className="nhsuk-heading-m nhsuk-u-margin-top-6">Support for success</h2>
            <p style={{ fontSize: 'var(--text-body)' }}>
              Our{' '}
              <Link href="/resources/guidance" className="nhsuk-link nhsuk-link--no-visited-state">
                commissioning toolkits
              </Link>{' '}
              offer best practice and guidance for making the most of a commissioned DTx.
            </p>
            <p style={{ fontSize: 'var(--text-body)' }}>
              <Link href="/resources" className="nhsuk-link nhsuk-link--no-visited-state">
                Resource library
              </Link>
            </p>
            <p style={{ fontSize: 'var(--text-body)' }}>
              <Link href={`/apps/${appSlug}`} className="nhsuk-link nhsuk-link--no-visited-state">
                Return to {appName}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
