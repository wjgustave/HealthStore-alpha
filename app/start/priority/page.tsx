import { Suspense } from 'react'
import StartPriorityClient from '@/components/guided-start/StartPriorityClient'

export default function StartPriorityPage() {
  return (
    <Suspense>
      <StartPriorityClient />
    </Suspense>
  )
}
