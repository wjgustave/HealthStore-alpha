import Link from 'next/link'
import QuestionPage from '@/components/guided-start/QuestionPage'
import { getServerContext } from '@/lib/context/serverContext'
import { ROLE_LABELS, BUYER_CONTEXT_LABELS, contextToSearchParams } from '@/lib/context/types'

export default async function CheckAnswersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const ctx = await getServerContext(params)
  const qs = contextToSearchParams(ctx).toString()

  const rows = [
    { key: 'Role', value: ctx.role ? ROLE_LABELS[ctx.role] : 'Not provided', changeHref: `/start/role?${qs}` },
    { key: 'Buying context', value: ctx.buyer_context ? BUYER_CONTEXT_LABELS[ctx.buyer_context] : 'Not provided', changeHref: `/start/organisation?${qs}` },
    { key: 'Area', value: ctx.geography_label, changeHref: `/start/place?${qs}` },
    { key: 'Priority', value: ctx.priority_label ?? 'Not provided', changeHref: `/start/priority?${qs}` },
  ]

  return (
    <QuestionPage title="Check your answers" backHref={`/start/priority?${qs}`}>
      <dl style={{ margin: '0 0 24px' }}>
        {rows.map((row) => (
          <div key={row.key} className="hs-summary-row">
            <dt>{row.key}</dt>
            <dd>
              {row.value}{' '}
              <Link href={row.changeHref} style={{ color: '#005eb8', fontSize: 14 }}>Change</Link>
            </dd>
          </div>
        ))}
      </dl>
      <Link href={`/opportunities?${qs}`} className="hs-btn hs-btn-primary">
        View opportunities
      </Link>
    </QuestionPage>
  )
}
