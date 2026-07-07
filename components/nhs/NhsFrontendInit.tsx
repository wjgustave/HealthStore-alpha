'use client'

import { useEffect } from 'react'

/** Initialise NHS.UK frontend component JavaScript (accordions, details, etc.). */
export default function NhsFrontendInit() {
  useEffect(() => {
    document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' nhsuk-frontend-supported' : '')
    import('nhsuk-frontend').then(({ initAll }) => {
      initAll()
    })
  }, [])
  return null
}
