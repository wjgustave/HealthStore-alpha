'use client'

import { useState, useEffect, useRef, useId, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { X, Send, CheckCircle } from 'lucide-react'

interface Props {
  appName: string
  open: boolean
  onClose: () => void
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-semibold mb-1.5"
        style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--nhs-red)' }} className="ml-0.5">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: '#fff' }}
      />
    </div>
  )
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ExpressInterestModal({ appName, open, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)
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

  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const timelineId = useId()
  const notesId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      setSubmitted(false)
      return
    }
    previouslyFocused.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      closeBtnRef.current?.focus()
    })
    return () => {
      document.body.style.overflow = ''
      previouslyFocused.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key !== 'Tab') return
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
        el => !el.hasAttribute('disabled')
      )
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, submitted])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleClose() {
    onClose()
  }

  if (!open || !mounted) return null

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,48,135,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-lg outline-none"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ background: '#E6F5EC' }}
              aria-hidden
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--nhs-green)' }} />
            </div>
            <h2
              className="font-bold mb-2"
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
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'var(--nhs-blue)' }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2
              id={titleId}
              className="font-bold mb-1 pr-8"
              style={{
                fontFamily: 'Frutiger, Arial, sans-serif',
                fontSize: 'var(--text-section-alt)',
                color: 'var(--nhs-dark)',
              }}
            >
              Express interest in {appName}
            </h2>
            <p className="mb-5" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
              Complete this form and a commissioning support team member will contact you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  id={`${titleId}-name`}
                  label="Your name"
                  value={formData.name}
                  onChange={v => handleChange('name', v)}
                  required
                />
                <Field
                  id={`${titleId}-role`}
                  label="Role"
                  value={formData.role}
                  onChange={v => handleChange('role', v)}
                  required
                  placeholder="e.g. Commissioner, Clinical Lead"
                />
              </div>
              <Field
                id={`${titleId}-org`}
                label="Organisation / ICB"
                value={formData.organisation}
                onChange={v => handleChange('organisation', v)}
                required
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  id={`${titleId}-email`}
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={v => handleChange('email', v)}
                  required
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
                <div>
                  <label
                    htmlFor={timelineId}
                    className="block font-semibold mb-1.5"
                    style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}
                  >
                    Desired timeline
                  </label>
                  <select
                    id={timelineId}
                    value={formData.timeline}
                    onChange={e => handleChange('timeline', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: '#fff' }}
                  >
                    <option value="">Select…</option>
                    <option value="immediate">Within 3 months</option>
                    <option value="medium">3–6 months</option>
                    <option value="planning">6–12 months</option>
                    <option value="exploratory">Exploratory only</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor={notesId}
                  className="block font-semibold mb-1.5"
                  style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}
                >
                  Additional context (optional)
                </label>
                <textarea
                  id={notesId}
                  value={formData.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: '#fff' }}
                  placeholder="Any specific requirements, questions or constraints…"
                />
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: 'var(--nhs-blue)' }}
                >
                  <Send className="w-4 h-4" aria-hidden />
                  Submit expression of interest
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-3 rounded-lg border text-sm transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
