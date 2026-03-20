'use client'

import { useState, type FormEvent } from 'react'
import { X, Send, CheckCircle } from 'lucide-react'

interface Props {
  appName: string
  open: boolean
  onClose: () => void
}

function Field({ label, value, onChange, required, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  required?: boolean; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block font-semibold mb-1.5" style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}>
        {label}{required && <span style={{ color: 'var(--nhs-red)' }} className="ml-0.5">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: '#fff' }} />
    </div>
  )
}

export default function ExpressInterestModal({ appName, open, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '', role: '', organisation: '', email: '', phone: '',
    population_estimate: '', timeline: '', notes: '',
  })

  if (!open) return null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(0,48,135,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-lg"
        style={{ boxShadow: 'var(--shadow-lg)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
          style={{ color: 'var(--text-muted)' }} aria-label="Close modal">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ background: '#E6F5EC' }}>
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--nhs-green)' }} />
            </div>
            <h2 className="font-bold mb-2" style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--nhs-dark)' }}>
              Interest registered
            </h2>
            <p className="mb-2" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
              Your expression of interest in {appName} has been recorded.
            </p>
            <p className="mb-6" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
              A member of the commissioning support team will be in touch within 5 working days to discuss next steps.
            </p>
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'var(--nhs-blue)' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-bold mb-1 pr-8"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--nhs-dark)' }}>
              Express interest in {appName}
            </h2>
            <p className="mb-5" style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
              Complete this form and a commissioning support team member will contact you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your name" value={formData.name} onChange={v => handleChange('name', v)} required />
                <Field label="Role" value={formData.role} onChange={v => handleChange('role', v)} required
                  placeholder="e.g. Commissioner, Clinical Lead" />
              </div>
              <Field label="Organisation / ICB" value={formData.organisation}
                onChange={v => handleChange('organisation', v)} required />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email" type="email" value={formData.email}
                  onChange={v => handleChange('email', v)} required />
                <Field label="Phone (optional)" type="tel" value={formData.phone}
                  onChange={v => handleChange('phone', v)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Estimated patient population" value={formData.population_estimate}
                  onChange={v => handleChange('population_estimate', v)}
                  placeholder="e.g. 2,000 COPD patients" />
                <div>
                  <label className="block font-semibold mb-1.5" style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}>
                    Desired timeline
                  </label>
                  <select value={formData.timeline} onChange={e => handleChange('timeline', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: '#fff' }}>
                    <option value="">Select…</option>
                    <option value="immediate">Within 3 months</option>
                    <option value="medium">3–6 months</option>
                    <option value="planning">6–12 months</option>
                    <option value="exploratory">Exploratory only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1.5" style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary)' }}>
                  Additional context (optional)
                </label>
                <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)}
                  rows={3} className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: '#fff' }}
                  placeholder="Any specific requirements, questions or constraints…" />
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: 'var(--nhs-blue)' }}>
                  <Send className="w-4 h-4" /> Submit expression of interest
                </button>
                <button type="button" onClick={onClose}
                  className="px-4 py-3 rounded-lg border text-sm transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
