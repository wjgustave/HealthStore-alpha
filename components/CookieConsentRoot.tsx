'use client'

import { useCallback, useEffect, useState } from 'react'
import CookieBanner from '@/components/CookieBanner'
import HotjarWhenConsented from '@/components/HotjarWhenConsented'
import { getStoredConsent, setStoredConsent, type AnalyticsConsent } from '@/lib/cookieConsentStorage'

type ConsentUiState = 'pending' | 'undecided' | AnalyticsConsent

export default function CookieConsentRoot({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentUiState>('pending')

  useEffect(() => {
    const stored = getStoredConsent()
    setState(stored ?? 'undecided')
  }, [])

  const accept = useCallback(() => {
    setStoredConsent('analytics')
    setState('analytics')
  }, [])

  const reject = useCallback(() => {
    setStoredConsent('rejected')
    setState('rejected')
  }, [])

  return (
    <>
      {/*
        Opt-out policy (Round 4, CONSENT-1 B): analytics run while the banner is still
        showing (state 'undecided') and after the user accepts. They are only switched
        off once the user explicitly rejects. See /cookies for the user-facing wording.
      */}
      {state === 'analytics' || state === 'undecided' ? <HotjarWhenConsented /> : null}
      {state === 'undecided' ? <CookieBanner onAccept={accept} onReject={reject} /> : null}
      {children}
    </>
  )
}
