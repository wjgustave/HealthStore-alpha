import Image from 'next/image'
import type { ReactNode } from 'react'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

/**
 * Shared authentication card shell: full-screen NHS gradient, centred white card with a
 * 6px NHS-blue top bar, logo + prototype badge, heading and optional subtitle. Used by
 * the login and entity-selection screens. `footer` renders below the card.
 */
export function AuthCard({
  title,
  subtitle,
  badge = 'Prototype',
  children,
  footer,
}: {
  title: ReactNode
  subtitle?: ReactNode
  badge?: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #003087 0%, var(--nhs-blue) 60%, #0072CE 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div style={{ background: 'var(--nhs-blue)', height: 6 }} />
          <div className="p-8">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-3 flex items-center gap-2.5">
                <Image src="/logos/nhs-blue-alt.svg" alt="" width={90} height={36} className="flex-shrink-0" />
                <span style={{ ...fr, fontWeight: 700, fontSize: 'var(--text-card-title)', color: '#003087' }}>
                  HealthStore
                </span>
              </div>
              {badge ? <span className="badge badge-blue">{badge}</span> : null}
            </div>

            <h1
              className="mb-1 text-center"
              style={{ ...fr, fontSize: 'var(--text-page-title)', fontWeight: 700, color: '#1A2332' }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="mb-6 text-center" style={{ fontSize: 'var(--text-body)', color: '#768692' }}>
                {subtitle}
              </p>
            ) : null}

            {children}
          </div>
        </div>
        {footer}
      </div>
    </div>
  )
}
