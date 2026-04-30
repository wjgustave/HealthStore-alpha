'use client'

import Link from 'next/link'

export default function CookieBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <div
      data-cookie-banner
      role="region"
      aria-label="Cookies"
      className="w-full border-b"
      style={{
        borderColor: 'var(--border)',
        background: '#fff',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <h2
          className="m-0 mb-3 font-bold"
          style={{
            fontFamily: 'Frutiger, Arial, sans-serif',
            fontSize: 'var(--text-section-alt)',
            color: 'var(--nhs-dark)',
          }}
        >
          Cookies on HealthStore
        </h2>
        <div
          className="space-y-3 mb-5 max-w-3xl"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.5 }}
        >
          <p className="m-0">
            We use essential cookies to make this prototype work - for example to keep you signed in when you choose to
            use your account.
          </p>
          <p className="m-0">
            We&apos;d also like to use analytics cookies so we can understand how to improve the HealthStore.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white border-0 cursor-pointer"
            style={{ background: 'var(--nhs-blue)' }}
            onClick={onAccept}
          >
            Accept analytics cookies
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer bg-white"
            style={{
              color: 'var(--text-primary)',
              border: '2px solid var(--border)',
            }}
            onClick={onReject}
          >
            Reject analytics cookies
          </button>
          <Link
            href="/cookies"
            className="inline-flex justify-center sm:justify-start items-center text-sm font-semibold hover:underline px-1 py-2"
            style={{ color: 'var(--nhs-blue)' }}
          >
            View cookies
          </Link>
        </div>
      </div>
    </div>
  )
}
