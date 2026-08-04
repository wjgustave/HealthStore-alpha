'use client'

import { Suspense } from 'react'
import DetailsStep from '@/components/eoi/journey/steps/DetailsStep'

export default function ExpressInterestDetailsPage() {
  return (
    <Suspense fallback={null}>
      <DetailsStep />
    </Suspense>
  )
}
