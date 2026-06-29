import { Suspense } from 'react'
import StartRoleClient from '@/components/guided-start/StartRoleClient'

export default function StartRolePage() {
  return (
    <Suspense>
      <StartRoleClient />
    </Suspense>
  )
}
