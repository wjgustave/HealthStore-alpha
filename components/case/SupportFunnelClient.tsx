'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import QuestionPage from '@/components/guided-start/QuestionPage'
import { contextFromSearchParams, contextToSearchParams } from '@/lib/context/types'

const SUPPORT_OPTIONS = [
  'assess_fit',
  'business_case',
  'assurance',
  'commercial_route',
  'implementation',
  'other',
] as const

const SUPPORT_LABELS: Record<(typeof SUPPORT_OPTIONS)[number], string> = {
  assess_fit: 'Assess pathway fit',
  business_case: 'Build or review business case',
  assurance: 'Clarify assurance and local work',
  commercial_route: 'Commercial route and buyer pack',
  implementation: 'Implementation planning',
  other: 'Other',
}

export default function SupportFunnelClient({ productSlug, productName }: { productSlug: string; productName: string }) {
  const searchParams = useSearchParams()
  const context = contextFromSearchParams(searchParams)
  const qs = contextToSearchParams(context).toString()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [support, setSupport] = useState<string[]>([])
  const [window, setWindow] = useState('')
  const [notes, setNotes] = useState('')
  const [otp, setOtp] = useState('')
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')

  async function submitCase() {
    setError('')
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        role,
        organisation,
        productSlug,
        productName,
        context,
        supportRequested: support,
        decisionWindow: window,
        additionalContext: notes,
        otp,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Could not create case')
      return
    }
    setReference(data.reference)
    setStep(6)
  }

  if (step === 0) {
    return (
      <QuestionPage title="Get commissioning support" backHref={`/products/${productSlug}?${qs}`}>
        <div className="hs-inset">
          <p>This creates a commissioning-support case. It is <strong>not</strong> a purchase or procurement award.</p>
        </div>
        <p>Product: <strong>{productName}</strong></p>
        <p>Area: <strong>{context.geography_label}</strong></p>
        <button type="button" className="hs-btn hs-btn-primary" onClick={() => setStep(1)}>Continue</button>
      </QuestionPage>
    )
  }

  if (step === 1) {
    return (
      <QuestionPage title="Your details" backHref={`/products/${productSlug}/support?${qs}`}>
        <div className="hs-form-group">
          <label className="hs-label" htmlFor="name">Full name</label>
          <input className="hs-input" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="hs-form-group">
          <label className="hs-label" htmlFor="email">NHS work email</label>
          <input className="hs-input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="hs-form-group">
          <label className="hs-label" htmlFor="role">Role</label>
          <input className="hs-input" id="role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="hs-form-group">
          <label className="hs-label" htmlFor="org">Organisation</label>
          <input className="hs-input" id="org" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
        </div>
        <button type="button" className="hs-btn hs-btn-primary" onClick={() => { if (!name || !email) { setError('Please enter your name and email'); return; } setError(''); setStep(2) }} disabled={!name || !email}>Continue</button>
        {error && step === 1 ? <p className="hs-error" style={{ marginTop: 8 }}>{error}</p> : null}
      </QuestionPage>
    )
  }

  if (step === 2) {
    return (
      <QuestionPage title="What help do you need?" backHref={`#`}>
        <div className="hs-checkboxes">
          {SUPPORT_OPTIONS.map((id) => (
            <div key={id} className="hs-checkbox-item">
              <input
                id={id}
                type="checkbox"
                checked={support.includes(id)}
                onChange={(e) => {
                  setSupport((s) => (e.target.checked ? [...s, id] : s.filter((x) => x !== id)))
                }}
              />
              <label htmlFor={id}>{SUPPORT_LABELS[id]}</label>
            </div>
          ))}
        </div>
        <button type="button" className="hs-btn hs-btn-primary" onClick={() => setStep(3)} disabled={support.length === 0}>Continue</button>
      </QuestionPage>
    )
  }

  if (step === 3) {
    return (
      <QuestionPage title="Timing and context" backHref={`#`}>
        <div className="hs-form-group">
          <label className="hs-label" htmlFor="window">Decision window (optional)</label>
          <input className="hs-input" id="window" value={window} onChange={(e) => setWindow(e.target.value)} placeholder="e.g. Next 6 months" />
        </div>
        <div className="hs-form-group">
          <label className="hs-label" htmlFor="notes">Additional context (optional)</label>
          <span className="hs-hint">Do not enter patient-identifiable information.</span>
          <textarea className="hs-textarea" id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button type="button" className="hs-btn hs-btn-primary" onClick={() => setStep(4)}>Check answers</button>
      </QuestionPage>
    )
  }

  if (step === 4) {
    return (
      <QuestionPage title="Check your answers" backHref={`#`}>
        <dl style={{ margin: '0 0 24px' }}>
          <div className="hs-summary-row"><dt>Product</dt><dd>{productName}</dd></div>
          <div className="hs-summary-row"><dt>Name</dt><dd>{name}</dd></div>
          <div className="hs-summary-row"><dt>Email</dt><dd>{email}</dd></div>
          <div className="hs-summary-row"><dt>Support</dt><dd>{support.map((s) => SUPPORT_LABELS[s as keyof typeof SUPPORT_LABELS]).join(', ')}</dd></div>
        </dl>
        <p style={{ fontSize: 14, color: '#4c6272', marginBottom: 16 }}>By continuing you agree prototype data will be stored for demonstration purposes.</p>
        <button type="button" className="hs-btn hs-btn-primary" onClick={() => setStep(5)}>Verify email</button>
      </QuestionPage>
    )
  }

  if (step === 5) {
    return (
      <QuestionPage title="Verify your email" backHref={`#`}>
        <div className="hs-inset">
          <p>Prototype: enter code <strong>123456</strong></p>
        </div>
        <div className="hs-form-group">
          <label className="hs-label" htmlFor="otp">One-time code</label>
          <input className="hs-input hs-input--narrow" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
        </div>
        {error ? <p className="hs-error">{error}</p> : null}
        <button type="button" className="hs-btn hs-btn-primary" onClick={submitCase}>Submit request</button>
      </QuestionPage>
    )
  }

  return (
    <QuestionPage title="Request received">
      <div className="hs-panel-success">
        <h2>Reference: {reference}</h2>
        <p>Your commissioning-support case has been created. No purchase or award has occurred.</p>
        <p><strong>Next step:</strong> HealthStore will confirm your request within 5 working days.</p>
      </div>
      <Link href={`/workspace/cases/${reference}`} className="hs-btn hs-btn-primary">View case in workspace</Link>
    </QuestionPage>
  )
}
