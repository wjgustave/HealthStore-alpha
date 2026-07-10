'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AuthCard } from '@/components/ui/AuthCard'
import { FormField, TextInput } from '@/components/ui/FormField'

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
        const next = typeof data.redirect === 'string' ? data.redirect : '/apps'
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
    <AuthCard
      title="Sign in"
      subtitle="Enter your credentials to access the store."
      footer={
        <>
          <p className="mt-6 text-center hs-text-caption" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Prototype based on publicly available information as of March 2026.
          </p>
          <p className="mt-2 text-center hs-text-caption">
            <a
              href="/cookies"
              className="hs-font-normal underline underline-offset-2 hover:opacity-90"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Cookies
            </a>
          </p>
        </>
      }
    >
      {error && (
        <div role="alert" aria-live="assertive"
          className="mb-4 flex items-center gap-2 rounded-lg p-4 hs-text-label hs-font-normal"
          style={{ background: '#FDECEA', color: '#7A1210', border: '1px solid #D5281B33' }}>
          <span className="flex-shrink-0 hs-font-bold" aria-hidden>✕</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Username" required>
          {(field) => (
            <TextInput
              {...field}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              placeholder="Enter your username"
            />
          )}
        </FormField>

        <FormField label="Password" required>
          {(field) => (
            <div className="relative">
              <TextInput
                {...field}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-[#F0F4F5]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword
                  ? <EyeOff className="h-4 w-4" style={{ color: '#768692' }} />
                  : <Eye className="h-4 w-4" style={{ color: '#768692' }} />
                }
              </button>
            </div>
          )}
        </FormField>

        <Button type="submit" block loading={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthCard>
  )
}
