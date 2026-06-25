'use client'

import { clearStoredConsent } from '@/lib/cookieConsentStorage'
import { Button } from '@/components/ui/Button'

export default function ResetCookieConsentButton() {
  return (
    <Button
      onClick={() => {
        clearStoredConsent()
        window.location.reload()
      }}
    >
      Show cookie banner again
    </Button>
  )
}
