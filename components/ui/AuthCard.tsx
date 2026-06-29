import type { ReactNode } from 'react'

/**
 * Authentication card shell aligned with the HealthStore white-header aesthetic.
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
      style={{ background: '#f0f4f5' }}
    >
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-lg bg-white border border-[#d8dde0] shadow-sm">
          <div style={{ background: '#005eb8', height: 4 }} />
          <div className="p-8">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-3 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 16" width={72} height={28} role="img" aria-label="NHS">
                  <path fill="#005eb8" d="M0 0h40v16H0z" />
                  <path fill="#fff" d="M3.9 1.5h4.4l2.6 9h.1l1.8-9h3.3l-2.7 13H9l-2.7-9h-.1l-1.8 9H1.1M17.3 1.5h3.6l-1 4.9h4L25 1.5h3.5l-2.7 13h-3.5l1.1-5.6h-4.1l-1.2 5.6h-3.5M37.7 4.4c-.7-.3-1.6-.6-2.9-.6-1.4 0-2.5.2-2.5 1.3 0 1.8 5.1 1.2 5.1 5.1 0 3.6-3.3 4.5-6.4 4.5-1.3 0-2.9-.3-4-.7l.8-2.7c.7.4 2 .7 3.1.7s2.8-.2 2.8-1.5c0-2.1-5.1-1.3-5.1-5 0-3.4 3-4.4 5.9-4.4 1.6 0 3.1.2 4 .6" />
                </svg>
                <span style={{ fontWeight: 600, fontSize: 20, color: '#212b32' }}>
                  HealthStore
                </span>
              </div>
              {badge ? (
                <span className="hs-tag hs-tag-blue" style={{ fontSize: 12 }}>
                  {badge}
                </span>
              ) : null}
            </div>

            <h1
              className="mb-1 text-center"
              style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212b32' }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="mb-6 text-center" style={{ fontSize: 16, color: '#4c6272' }}>
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
