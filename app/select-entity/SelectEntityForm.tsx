'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { COMMISSIONING_ENTITIES } from '@/lib/commissioningEntities'
import { AuthCard } from '@/components/ui/AuthCard'
import { Button } from '@/components/ui/Button'

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
        <p className="mt-6 text-center hs-text-caption" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Prototype based on publicly available information as of March 2026.
        </p>
      }
    >
      {error && (
        <div id="select-entity-error" role="alert" aria-live="assertive"
          className="mb-4 flex items-center gap-2 rounded-lg p-4 hs-text-label hs-font-normal"
          style={{ background: '#FDECEA', color: '#7A1210', border: '1px solid #D5281B33' }}>
          <span className="flex-shrink-0 hs-font-bold" aria-hidden>✕</span>
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
            className="space-y-4"
          >
            {COMMISSIONING_ENTITIES.map((entity) => (
              <label
                key={entity.id}
                className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                  entityId === entity.id ? 'border-[var(--nhs-blue)] bg-[#E6F0FB]' : ''
                }`}
                style={{ borderColor: entityId === entity.id ? 'var(--nhs-blue)' : '#D8DDE0' }}
              >
                <input
                  type="radio"
                  name="entity"
                  value={entity.id}
                  checked={entityId === entity.id}
                  onChange={() => setEntityId(entity.id)}
                  className="mt-1"
                />
                <span className="hs-text-label hs-font-normal" style={{ color: '#212B32' }}>{entity.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" block loading={loading}>
          {loading ? 'Continuing…' : 'Continue to store'}
        </Button>
      </form>
    </AuthCard>
  )
}
