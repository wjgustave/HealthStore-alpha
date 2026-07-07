'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import QuestionPage from '@/components/guided-start/QuestionPage'
import GuidedOptionButton from '@/components/guided-start/GuidedOptionButton'
import type { CommissionerRole } from '@/lib/context/types'
import { ROLE_LABELS } from '@/lib/context/types'
import { contextToSearchParams, mergeContext, DEFAULT_CONTEXT } from '@/lib/context/types'
import { useCommissionerContext } from '@/lib/context/useCommissionerContext'

const ROLES = Object.entries(ROLE_LABELS) as [CommissionerRole, string][]

export default function StartRoleClient() {
  const router = useRouter()
  const { context } = useCommissionerContext()

  function select(role: CommissionerRole) {
    const next = mergeContext(context, { role })
    router.push(`/start/organisation?${contextToSearchParams(next).toString()}`)
  }

  return (
    <QuestionPage
      title="What is your role?"
      hint="Four quick questions so we can show you local need, pathway opportunities and assured digital therapeutics. We don't ask for budgets or patient data — just your role, context, area and priority."
      backHref="/"
    >
      <div className="hs-question-options">
        {ROLES.map(([id, label]) => (
          <GuidedOptionButton key={id} label={label} onSelect={() => select(id)} />
        ))}
      </div>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        <Link href={`/start/organisation?${contextToSearchParams(mergeContext(DEFAULT_CONTEXT, context)).toString()}`} style={{ color: '#005eb8' }}>
          I do not know
        </Link>
      </p>
    </QuestionPage>
  )
}
