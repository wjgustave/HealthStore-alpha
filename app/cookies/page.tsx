import type { Metadata } from 'next'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import ResetCookieConsentButton from '@/components/ResetCookieConsentButton'

export const metadata: Metadata = {
  title: 'Cookies — HealthStore',
  description: 'How HealthStore uses cookies and similar technologies, including analytics with Hotjar.',
}

export default function CookiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageBreadcrumb items={[{ label: 'Cookies' }]} />
      <div className="mb-10">
        <h1 className="page-title-h1">Cookies</h1>
        <p
          className="m-0 max-w-2xl leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          This page explains how we use cookies and browser storage for this prototype.
        </p>
      </div>

      <div className="space-y-10 max-w-3xl">
        <section aria-labelledby="cookies-storage-heading">
          <h2
            id="cookies-storage-heading"
            className="mt-0 mb-3 font-bold"
            style={{
              fontFamily: 'Frutiger, Arial, sans-serif',
              fontSize: 'var(--text-section-alt)',
              color: 'var(--text-primary)',
            }}
          >
            Cookie choice (browser storage)
          </h2>
          <div className="space-y-3" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p className="m-0">
              When you accept or reject analytics, we store that choice in your browser&apos;s{' '}
              <strong>local storage</strong> (not an HTTP cookie) so we do not ask you again on every visit. If you clear
              site data for this site, you will be asked again.
            </p>
          </div>
        </section>

        <section aria-labelledby="cookies-analytics-heading">
          <h2
            id="cookies-analytics-heading"
            className="mt-0 mb-3 font-bold"
            style={{
              fontFamily: 'Frutiger, Arial, sans-serif',
              fontSize: 'var(--text-section-alt)',
              color: 'var(--text-primary)',
            }}
          >
            Analytics (Hotjar) only if you accept
          </h2>
          <div className="space-y-3" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p className="m-0">
              If you choose <strong>Accept analytics cookies</strong>, we load Hotjar to help us understand how this
              prototype is used and improve it.
            </p>
            <p className="m-0">
              If you choose <strong>Reject analytics cookies</strong>, we do not load Hotjar on your device.
            </p>
          </div>
        </section>

        <section aria-labelledby="cookies-change-heading">
          <h2
            id="cookies-change-heading"
            className="mt-0 mb-3 font-bold"
            style={{
              fontFamily: 'Frutiger, Arial, sans-serif',
              fontSize: 'var(--text-section-alt)',
              color: 'var(--text-primary)',
            }}
          >
            Change your mind
          </h2>
          <p
            className="m-0 mb-4 max-w-2xl"
            style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}
          >
            Use the button below to clear your saved analytics choice and reload the page. The cookie banner will appear
            again so you can accept or reject analytics cookies.
          </p>
          <ResetCookieConsentButton />
        </section>
      </div>
    </div>
  )
}
