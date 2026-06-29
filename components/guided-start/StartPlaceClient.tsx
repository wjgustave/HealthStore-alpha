'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import QuestionPage from '@/components/guided-start/QuestionPage'
import GuidedOptionButton from '@/components/guided-start/GuidedOptionButton'
import { contextToSearchParams, mergeContext } from '@/lib/context/types'
import { useCommissionerContext } from '@/lib/context/useCommissionerContext'
import { listSupportedIcbs } from '@/lib/localData/referenceData'

export default function StartPlaceClient() {
  const router = useRouter()
  const { context } = useCommissionerContext()
  const icbs = listSupportedIcbs()

  function selectNational() {
    const next = mergeContext(context, {
      geography_type: 'national',
      geography_id: undefined,
      geography_label: 'England (illustrative baseline)',
    })
    router.push(`/start/priority?${contextToSearchParams(next).toString()}`)
  }

  function selectIcb(id: string, name: string) {
    const next = mergeContext(context, {
      geography_type: 'icb',
      geography_id: id,
      geography_label: name,
    })
    router.push(`/start/priority?${contextToSearchParams(next).toString()}`)
  }

  return (
    <QuestionPage
      title="Which organisation or area are you interested in?"
      hint="We use this to show local denominators where available. Population data is derived — we do not ask you to enter it."
      backHref={`/start/organisation?${contextToSearchParams(context).toString()}`}
    >
      <div className="hs-question-options">
        <GuidedOptionButton label="England (national illustrative baseline)" onSelect={selectNational} />
        {icbs.map((icb) => (
          <GuidedOptionButton key={icb.id} label={icb.name} onSelect={() => selectIcb(icb.id, icb.name)} />
        ))}
      </div>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        <Link href={`/start/priority?${contextToSearchParams(context).toString()}`} style={{ color: '#005eb8' }}>
          Not sure — use national baseline
        </Link>
      </p>
    </QuestionPage>
  )
}
