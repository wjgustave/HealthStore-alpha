import { Suspense } from 'react'
import StartOrganisationClient from '@/components/guided-start/StartOrganisationClient'

export default function StartOrganisationPage() {
  return (
    <Suspense>
      <StartOrganisationClient />
    </Suspense>
  )
}
