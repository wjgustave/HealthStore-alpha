'use client'

import { Suspense } from 'react'
import TimingStep from '@/components/eoi/journey/steps/TimingStep'

export default function ExpressInterestTimingPage() {
  return (
    <Suspense fallback={null}>
      <TimingStep />
    </Suspense>
  )
}
