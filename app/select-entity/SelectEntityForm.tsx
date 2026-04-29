'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { COMMISSIONING_ENTITIES } from '@/lib/commissioningEntities'
import { setHomeLayoutPreferenceAfterAuth } from '@/lib/homeLayoutStorage'

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
        setHomeLayoutPreferenceAfterAuth('v2')
        router.push('/')
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #003087 0%, #005EB8 60%, #0072CE 100%)' }}>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div style={{ background: '#005EB8', height: 6 }} />

          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <Image src="/logos/nhs-blue-alt.svg" alt="" width={90} height={36} className="flex-shrink-0" />
                <span style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontWeight: 700, fontSize: 'var(--text-card-title)', color: '#003087' }}>
                  HealthStore
                </span>
              </div>
              <span className="badge badge-blue">Prototype</span>
            </div>

            <h1 className="text-center mb-1"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-page-title)', fontWeight: 700, color: '#1A2332' }}>
              Select an ICB
            </h1>
            <p className="text-center mb-6" style={{ fontSize: 'var(--text-body)', color: '#768692' }}>
              This is the ICB you are accessing the store for.
            </p>

            {error && (
              <div role="alert" aria-live="assertive"
                className="rounded-lg p-3 mb-4 text-sm font-medium flex items-center gap-2"
                style={{ background: '#FDECEA', color: '#7A1210', border: '1px solid #DA291C33' }}>
                <span className="font-bold flex-shrink-0">✕</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <fieldset>
                <legend className="sr-only">Commissioning entity</legend>
                <div className="space-y-3">
                  {COMMISSIONING_ENTITIES.map((entity) => (
                    <label
                      key={entity.id}
                      className={`flex items-start gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
                        entityId === entity.id ? 'border-[#005EB8] bg-[#E6F0FB]' : ''
                      }`}
                      style={{ borderColor: entityId === entity.id ? '#005EB8' : '#DEE4EA' }}
                    >
                      <input
                        type="radio"
                        name="entity"
                        value={entity.id}
                        checked={entityId === entity.id}
                        onChange={() => setEntityId(entity.id)}
                        className="mt-1"
                      />
                      <span className="text-sm font-medium" style={{ color: '#1A2332' }}>{entity.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 enabled:hover:!bg-[#004B8C]"
                style={{ background: '#005EB8' }}
              >
                {loading ? 'Continuing…' : 'Continue to store'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Based on publicly available information as of March 2026.
        </p>
      </div>
    </div>
  )
}
