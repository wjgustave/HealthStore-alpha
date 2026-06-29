import type { Metadata } from 'next'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import ResetCookieConsentButton from '@/components/ResetCookieConsentButton'

export const metadata: Metadata = {
  title: 'Cookies — HealthStore',
  description: 'How HealthStore uses cookies and similar technologies, including analytics with Hotjar.',
}

export default function CookiesPage() {
  return (
    <div className="hs-page">
      <PageBreadcrumb items={[{ label: 'Cookies' }]} />
      <div className="hs-section">
        <h1 className="page-title-h1">Cookies</h1>
        <p
          className="m-0 hs-measure leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          This page explains how we use cookies and browser storage for this prototype.
        </p>
      </div>

      <div className="space-y-10 max-w-3xl">
        <section aria-labelledby="cookies-storage-heading">
          <h2
            id="cookies-storage-heading"
            className="mt-0 mb-4 hs-font-bold"
            style={{
              fontFamily: 'Frutiger, Arial, sans-serif',
              fontSize: 'var(--text-section-alt)',
              color: 'var(--text-primary)',
            }}
          >
            Cookie choice (browser storage)
          </h2>
          <div className="space-y-4" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
            className="mt-0 mb-4 hs-font-bold"
            style={{
              fontFamily: 'Frutiger, Arial, sans-serif',
              fontSize: 'var(--text-section-alt)',
              color: 'var(--text-primary)',
            }}
          >
            Analytics (Hotjar)
          </h2>
          <div className="space-y-4" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p className="m-0">
              We use Hotjar to help us understand how this prototype is used and improve it. While the cookie banner is
              still showing &mdash; before you have made a choice &mdash; analytics may run.
            </p>
            <p className="m-0">
              If you choose <strong>Accept analytics cookies</strong>, Hotjar continues to load.
            </p>
            <p className="m-0">
              If you choose <strong>Reject analytics cookies</strong>, we stop loading Hotjar on your device.
            </p>
          </div>
        </section>

        <section aria-labelledby="cookies-change-heading">
          <h2
            id="cookies-change-heading"
            className="mt-0 mb-4 hs-font-bold"
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
