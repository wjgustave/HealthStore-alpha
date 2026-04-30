'use client'

import { clearStoredConsent } from '@/lib/cookieConsentStorage'

export default function ResetCookieConsentButton() {
  return (
    <button
      type="button"
      className="inline-flex px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer text-white border-0"
      style={{ background: 'var(--nhs-blue)' }}
      onClick={() => {
        clearStoredConsent()
        window.location.reload()
      }}
    >
      Show cookie banner again
    </button>
  )
}
