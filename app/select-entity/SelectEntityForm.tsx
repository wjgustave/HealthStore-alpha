'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { COMMISSIONING_ENTITIES } from '@/lib/commissioningEntities'
import { AuthCard } from '@/components/ui/AuthCard'

export default function SelectEntityForm() {
  const router = useRouter()
  const [entityId, setEntityId] = useState<string>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!entityId) {
      setError('Select a commissioning entity to continue.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/select-commissioning-entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId }),
      })
      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Select an ICB"
      subtitle="This is the ICB you are accessing the store for."
      footer={
        <p className="mt-6 text-center text-xs" style={{ color: '#4c6272' }}>
          Prototype based on publicly available information as of March 2026.
        </p>
      }
    >
      {error && (
        <div id="select-entity-error" role="alert" aria-live="assertive"
          className="mb-4 flex items-center gap-2 rounded-lg p-3 text-sm font-medium"
          style={{ background: '#FDECEA', color: '#7A1210', border: '1px solid #DA291C33' }}>
          <span className="flex-shrink-0 font-bold" aria-hidden>✕</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset>
          <legend id="select-entity-legend" className="sr-only">Commissioning entity</legend>
          <div
            role="radiogroup"
            aria-labelledby="select-entity-legend"
            aria-required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'select-entity-error' : undefined}
            className="hs-question-options"
          >
            {COMMISSIONING_ENTITIES.map((entity) => (
              <label
                key={entity.id}
                className="hs-checkbox-item"
                style={{
                  padding: '12px 14px',
                  border: `2px solid ${entityId === entity.id ? '#005eb8' : '#d8dde0'}`,
                  borderRadius: 6,
                  background: entityId === entity.id ? '#f0f6fc' : '#fff',
                }}
              >
                <input
                  type="radio"
                  name="entity"
                  value={entity.id}
                  checked={entityId === entity.id}
                  onChange={() => setEntityId(entity.id)}
                />
                <span style={{ fontSize: 16, color: '#212b32' }}>{entity.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="hs-btn hs-btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Continuing…' : 'Continue to store'}
        </button>
      </form>
    </AuthCard>
  )
}
