'use client'

import { useEffect } from 'react'

/** Initialise NHS.UK frontend component JavaScript (accordions, details, etc.).
 *  Header is initialised by `Nav` (React-safe More menu) — skip duplicate header.js. */
export default function NhsFrontendInit() {
  useEffect(() => {
    document.body.classList.add('js-enabled')
    if ('noModule' in HTMLScriptElement.prototype) {
      document.body.classList.add('nhsuk-frontend-supported')
    }
    void import('nhsuk-frontend').then(mod => {
      mod.initSkipLink?.({ scope: document })
      mod.initButton?.({ scope: document })
      mod.initCharacterCount?.({ scope: document })
      mod.initCheckboxes?.({ scope: document })
      mod.initDetails?.({ scope: document })
      mod.initErrorSummary?.({ scope: document })
      mod.initRadios?.({ scope: document })
      mod.initTabs?.({ scope: document })
    })
  }, [])
  return null
}
