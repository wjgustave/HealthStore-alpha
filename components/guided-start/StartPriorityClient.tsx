'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import QuestionPage from '@/components/guided-start/QuestionPage'
import GuidedOptionButton from '@/components/guided-start/GuidedOptionButton'
import { contextToSearchParams, mergeContext } from '@/lib/context/types'
import { useCommissionerContext } from '@/lib/context/useCommissionerContext'

const PRIORITIES = [
  { id: 'copd', type: 'condition' as const, label: 'Respiratory admissions and COPD management' },
  { id: 'cardiac_rehab', type: 'condition' as const, label: 'Cardiac rehabilitation waiting times and capacity' },
  { id: 'msk_back_pain', type: 'condition' as const, label: 'MSK and physiotherapy referral demand' },
  { id: 'admissions', type: 'service_pressure' as const, label: 'Unplanned admissions across multiple pathways' },
  { id: 'waiting', type: 'service_pressure' as const, label: 'Outpatient and community waiting list pressure' },
  { id: 'equity', type: 'outcome_inequality' as const, label: 'Health inequalities and access to treatment' },
]

export default function StartPriorityClient() {
  const router = useRouter()
  const { context } = useCommissionerContext()

  function select(id: string, type: 'condition' | 'service_pressure' | 'outcome_inequality', label: string) {
    const next = mergeContext(context, {
      priority_type: type,
      priority_id: id,
      priority_label: label,
    })
    router.push(`/start/check-answers?${contextToSearchParams(next).toString()}`)
  }

  return (
    <QuestionPage
      title="What problem are you trying to address?"
      hint="This helps us highlight the most relevant opportunity. You will still see all supported pathways in your area."
      backHref={`/start/place?${contextToSearchParams(context).toString()}`}
    >
      <div className="hs-question-options">
        {PRIORITIES.map((p) => (
          <GuidedOptionButton key={p.id} label={p.label} onSelect={() => select(p.id, p.type, p.label)} />
        ))}
      </div>

      <p style={{ marginTop: 20, fontSize: 14 }}>
        <Link
          href={`/start/check-answers?${contextToSearchParams(mergeContext(context, { priority_type: 'other', priority_id: 'other', priority_label: 'Show all pathways' })).toString()}`}
          style={{ color: '#005eb8' }}
        >
          Skip — show me everything
        </Link>
      </p>
    </QuestionPage>
  )
}
