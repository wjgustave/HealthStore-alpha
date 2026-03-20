'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        const data = await res.json()
        const next = typeof data.redirect === 'string' ? data.redirect : '/'
        router.push(next)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid username or password')
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
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* NHS blue top bar */}
          <div style={{ background: '#005EB8', height: 6 }} />

          <div className="p-8">
            {/* Logo and heading */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <Image src="/logos/nhs-blue-alt.svg" alt="" width={90} height={36} className="flex-shrink-0" />
                <span style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontWeight: 700, fontSize: 'var(--text-card-title)', color: '#003087' }}>
                  HealthStore
                </span>
              </div>
              <span className="badge badge-blue">Prototype</span>
            </div>

            {/* Heading */}
            <h1 className="text-center mb-1"
              style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-page-title)', fontWeight: 700, color: '#1A2332' }}>
              Sign in
            </h1>
            <p className="text-center mb-6" style={{ fontSize: 'var(--text-body)', color: '#768692' }}>
              Enter your credentials to access the store.
            </p>

            {/* Error message */}
            {error && (
              <div role="alert" aria-live="assertive"
                className="rounded-lg p-3 mb-4 text-sm font-medium flex items-center gap-2"
                style={{ background: '#FDECEA', color: '#7A1210', border: '1px solid #DA291C33' }}>
                <span className="font-bold flex-shrink-0">✕</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-xs font-semibold mb-1.5"
                  style={{ color: '#485768' }}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  autoFocus
                  placeholder="Enter your username"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm"
                  style={{ borderColor: '#DEE4EA', color: '#1A2332', background: '#fff' }}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block font-semibold mb-1.5"
                  style={{ fontSize: 'var(--text-label)', color: '#485768' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm"
                    style={{ borderColor: '#DEE4EA', color: '#1A2332', background: '#fff' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" style={{ color: '#768692' }} />
                      : <Eye className="w-4 h-4" style={{ color: '#768692' }} />
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: '#005EB8' }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Based on publicly available information as of March 2026. Not a procurement framework.
        </p>
      </div>
    </div>
  )
}
