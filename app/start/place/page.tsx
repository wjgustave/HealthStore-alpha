import { Suspense } from 'react'
import StartPlaceClient from '@/components/guided-start/StartPlaceClient'

export default function StartPlacePage() {
  return (
    <Suspense>
      <StartPlaceClient />
    </Suspense>
  )
}
