'use client'

import { useRouter } from 'next/navigation'
import QuestionPage from '@/components/guided-start/QuestionPage'
import GuidedOptionButton from '@/components/guided-start/GuidedOptionButton'
import type { BuyerContext } from '@/lib/context/types'
import { BUYER_CONTEXT_LABELS, contextToSearchParams, mergeContext } from '@/lib/context/types'
import { useCommissionerContext } from '@/lib/context/useCommissionerContext'

const OPTIONS = Object.entries(BUYER_CONTEXT_LABELS) as [BuyerContext, string][]

export default function StartOrganisationClient() {
  const router = useRouter()
  const { context } = useCommissionerContext()

  function select(buyer_context: BuyerContext) {
    const next = mergeContext(context, { buyer_context })
    router.push(`/start/place?${contextToSearchParams(next).toString()}`)
  }

  return (
    <QuestionPage
      title="Do you represent an NHS organisation that may commission or deploy this service?"
      hint="We ask this to understand your buying context. You can still explore the service without being a buyer."
      backHref={`/start/role?${contextToSearchParams(context).toString()}`}
    >
      <div className="hs-question-options">
        {OPTIONS.map(([id, label]) => (
          <GuidedOptionButton key={id} label={label} onSelect={() => select(id)} />
        ))}
      </div>
    </QuestionPage>
  )
}
