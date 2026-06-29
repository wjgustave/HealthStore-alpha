'use client'

import { useState, useEffect, useRef, useId, type FormEvent } from 'react'
import { X, Send, CheckCircle } from 'lucide-react'
import { useEoi } from '@/components/EoiProvider'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FormField, TextInput, Select, Textarea } from '@/components/ui/FormField'

interface Props {
  appId: string
  appName: string
  open: boolean
  onClose: () => void
  contactPrefill: {
    name: string
    role: string
    organisation: string
    email: string
  }
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
  readOnly,
  error,
}: {
  id: string
  label: string
  value: string
  onChange?: (v: string) => void
  required?: boolean
  type?: string
  placeholder?: string
  readOnly?: boolean
  error?: string
}) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      {(field) => (
        <TextInput
          {...field}
          type={type}
          value={value}
          onChange={readOnly ? undefined : e => onChange?.(e.target.value)}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
        />
      )}
    </FormField>
  )
}

export default function ExpressInterestModal({
  appId,
  appName,
  open,
  onClose,
  contactPrefill,
}: Props) {
  const { submit } = useEoi()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organisation: '',
    email: '',
    phone: '',
    population_estimate: '',
    timeline: '',
    notes: '',
  })

  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const timelineId = useId()
  const notesId = useId()

  // Contact fields are editable only when the session provides no prefill (FRM-02).
  const nameLocked = Boolean(contactPrefill.name)
  const roleLocked = Boolean(contactPrefill.role)
  const orgLocked = Boolean(contactPrefill.organisation)
  const emailLocked = Boolean(contactPrefill.email)

  useEffect(() => {
    if (!open) return
    setFormData(prev => ({
      ...prev,
      name: contactPrefill.name,
      role: contactPrefill.role,
      organisation: contactPrefill.organisation,
      email: contactPrefill.email,
    }))
  }, [open, contactPrefill.name, contactPrefill.role, contactPrefill.organisation, contactPrefill.email])

  useEffect(() => {
    if (open) return
    setSubmitted(false)
    setSubmitError(null)
    setSubmitting(false)
    setFieldErrors({})
  }, [open])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return

    // Validate only the contact fields the user can actually edit (FRM-02 / EOI-3).
    const errors: Record<string, string> = {}
    if (!nameLocked && !formData.name.trim()) errors.name = 'Enter your name.'
    if (!roleLocked && !formData.role.trim()) errors.role = 'Enter your role.'
    if (!orgLocked && !formData.organisation.trim()) errors.organisation = 'Enter your organisation.'
    if (!emailLocked && !formData.email.trim()) errors.email = 'Enter your email address.'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    setSubmitting(true)
    setSubmitError(null)
    try {
      await submit({
        appId,
        appName,
        name: formData.name,
        role: formData.role,
        organisation: formData.organisation,
        email: formData.email,
        phone: formData.phone,
        population_estimate: formData.population_estimate,
        timeline: formData.timeline,
        notes: formData.notes,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not register your expression of interest.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => (prev[field] ? { ...prev, [field]: '' } : prev))
  }

  function handleClose() {
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy={titleId}
      initialFocusRef={closeBtnRef}
      restoreFocus="previous"
      panelClassName="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-lg"
    >
      <Button
        ref={closeBtnRef}
        variant="ghost"
        iconOnly
        onClick={handleClose}
        className="absolute top-4 right-4 text-[var(--text-muted)]"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5" aria-hidden />
      </Button>

      {submitted ? (
        <div className="text-center py-8" role="status">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ background: '#E6F5EC' }}
            aria-hidden
          >
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--nhs-green)' }} />
          </div>
          <h2
            id={titleId}
            className="hs-font-bold mb-2"
            style={{
              fontFamily: 'Frutiger, Arial, sans-serif',
              fontSize: 'var(--text-section-alt)',
              color: 'var(--nhs-dark)',
            }}
          >
            Interest registered
          </h2>
          <p className="mb-2" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
            Your expression of interest in {appName} has been recorded.
          </p>
          <p className="mb-6" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            A member of the commissioning support team will be in touch within 5 working days to discuss next steps.
          </p>
          <Button onClick={handleClose} className="px-6">
            Close
          </Button>
        </div>
      ) : (
        <>
          <h2
            id={titleId}
            className="hs-font-bold mb-1 pr-8"
            style={{
              fontFamily: 'Frutiger, Arial, sans-serif',
              fontSize: 'var(--text-section-alt)',
              color: 'var(--nhs-dark)',
            }}
          >
            Express interest in {appName}
          </h2>
          <p className="mb-6" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
            Complete this form and a commissioning support team member will contact you.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id={`${titleId}-name`}
                label="Your name"
                value={formData.name}
                onChange={v => handleChange('name', v)}
                required={!nameLocked}
                readOnly={nameLocked}
                error={fieldErrors.name}
              />
              <Field
                id={`${titleId}-role`}
                label="Role"
                value={formData.role}
                onChange={v => handleChange('role', v)}
                required={!roleLocked}
                readOnly={roleLocked}
                error={fieldErrors.role}
              />
            </div>
            <Field
              id={`${titleId}-org`}
              label="Organisation / ICB"
              value={formData.organisation}
              onChange={v => handleChange('organisation', v)}
              required={!orgLocked}
              readOnly={orgLocked}
              error={fieldErrors.organisation}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id={`${titleId}-email`}
                label="Email"
                type="email"
                value={formData.email}
                onChange={v => handleChange('email', v)}
                required={!emailLocked}
                readOnly={emailLocked}
                error={fieldErrors.email}
              />
              <Field
                id={`${titleId}-phone`}
                label="Phone (optional)"
                type="tel"
                value={formData.phone}
                onChange={v => handleChange('phone', v)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id={`${titleId}-pop`}
                label="Estimated patient population"
                value={formData.population_estimate}
                onChange={v => handleChange('population_estimate', v)}
                placeholder="e.g. 2,000 COPD patients"
              />
              <FormField id={timelineId} label="Desired timeline">
                {(field) => (
                  <Select
                    {...field}
                    value={formData.timeline}
                    onChange={e => handleChange('timeline', e.target.value)}
                  >
                    <option value="">Select…</option>
                    <option value="immediate">Within 3 months</option>
                    <option value="medium">3–6 months</option>
                    <option value="planning">6–12 months</option>
                    <option value="exploratory">Exploratory only</option>
                  </Select>
                )}
              </FormField>
            </div>
            <FormField id={notesId} label="Additional context (optional)">
              {(field) => (
                <Textarea
                  {...field}
                  value={formData.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  rows={3}
                  className="resize-none"
                  placeholder="Any specific requirements, questions or constraints…"
                />
              )}
            </FormField>
            {submitError ? (
              <p
                role="alert"
                className="hs-text-label rounded-md px-4 py-2"
                style={{ background: '#FEF3F2', color: '#912018', border: '1px solid #FECDCA' }}
              >
                {submitError}
              </p>
            ) : null}
            <div className="pt-2 flex items-center gap-4">
              <Button type="submit" loading={submitting} className="flex-1 disabled:cursor-wait">
                <Send className="w-4 h-4" aria-hidden />
                {submitting ? 'Submitting…' : 'Submit expression of interest'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}
