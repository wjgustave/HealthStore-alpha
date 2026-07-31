'use client'

import { useState, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Site-wide password gate — NHS-branded standalone page (no app nav/footer).
 * One password field, no username. Validated by POST /api/gate, which sets the
 * gate cookie checked in middleware.
 */
export default function GatePage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!password.trim()) {
      setError('Enter the password')
      inputRef.current?.focus()
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        const next = new URLSearchParams(window.location.search).get('next') || '/'
        router.push(next)
        router.refresh()
      } else {
        setError('The password is not correct')
        inputRef.current?.focus()
      }
    } catch {
      setError('Unable to connect. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f0f4f5' }}>
      {/* NHS header — logo only, no navigation. [Provenance: NHS] header component */}
      <header className="nhsuk-header" role="banner">
        <div className="nhsuk-header__container">
          <div className="nhsuk-header__logo">
            <span className="nhsuk-header__link nhsuk-header__link--service">
              <svg
                className="nhsuk-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 16"
                height={40}
                width={100}
                focusable="false"
                aria-hidden="true"
              >
                <path className="nhsuk-logo__background" fill="#005eb8" d="M0 0h40v16H0z" />
                <path
                  className="nhsuk-logo__text"
                  fill="#fff"
                  d="M3.9 1.5h4.4l2.6 9h.1l1.8-9h3.3l-2.8 13H9l-2.7-9h-.1l-1.8 9H1.1M17.3 1.5h3.6l-1 4.9h4L25 1.5h3.5l-2.7 13h-3.5l1.1-5.6h-4.1l-1.2 5.6h-3.4M37.7 4.4c-.7-.3-1.6-.6-2.9-.6-1.4 0-2.5.2-2.5 1.3 0 1.8 5.1 1.2 5.1 5.1 0 3.6-3.3 4.5-6.4 4.5-1.3 0-2.9-.3-4-.7l.8-2.7c.7.4 2.1.7 3.2.7s2.8-.2 2.8-1.5c0-2.1-5.1-1.3-5.1-5 0-3.4 2.9-4.4 5.8-4.4 1.6 0 3.1.2 4 .6"
                />
              </svg>
              <span className="nhsuk-header__service-name">HealthStore</span>
            </span>
          </div>
        </div>
      </header>

      {/* AppShell already provides the <main id="main-content"> landmark around this page. */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 'clamp(32px, 8vh, 96px) var(--gutter, 16px)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '30rem' }}>
          <div
            style={{
              background: '#fff',
              border: '1px solid #d8dde0',
              padding: 'clamp(24px, 4vw, 40px)',
            }}
          >
            <h1
              className="hs-font-bold"
              style={{
                fontSize: 'var(--text-section, 1.75rem)',
                lineHeight: 1.2,
                color: 'var(--text-primary, #212b32)',
                margin: '0 0 8px',
              }}
            >
              This is a private prototype
            </h1>
            <p style={{ color: 'var(--text-secondary, #4c6272)', margin: '0 0 24px', lineHeight: 1.5 }}>
              NHS HealthStore is in private testing. Enter the password you have been given to
              continue.
            </p>

            {error && (
              <div
                className="nhsuk-error-summary"
                role="alert"
                aria-labelledby="gate-error-title"
                style={{ marginBottom: 24 }}
              >
                <h2 className="nhsuk-error-summary__title" id="gate-error-title">
                  There is a problem
                </h2>
                <div className="nhsuk-error-summary__body">
                  <ul className="nhsuk-list nhsuk-error-summary__list">
                    <li>
                      <a href="#gate-password">{error}</a>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className={`nhsuk-form-group${error ? ' nhsuk-form-group--error' : ''}`}>
                <label className="nhsuk-label" htmlFor="gate-password">
                  Password
                </label>
                {error && (
                  <span className="nhsuk-error-message" id="gate-password-error">
                    <span className="nhsuk-u-visually-hidden">Error:</span> {error}
                  </span>
                )}
                <input
                  ref={inputRef}
                  className={`nhsuk-input${error ? ' nhsuk-input--error' : ''}`}
                  id="gate-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  aria-describedby={error ? 'gate-password-error' : undefined}
                  style={{ maxWidth: '20rem' }}
                />
              </div>
              <button className="nhsuk-button" type="submit" disabled={loading} data-module="nhsuk-button">
                {loading ? 'Checking…' : 'Continue'}
              </button>
            </form>
          </div>

          <p
            className="hs-text-caption"
            style={{ color: 'var(--text-muted, #768692)', marginTop: 16, lineHeight: 1.5 }}
          >
            Prototype based on publicly available information. Illustrative data only — not a live
            NHS service.
          </p>
        </div>
      </div>
    </div>
  )
}
