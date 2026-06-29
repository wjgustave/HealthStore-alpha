import { notFound } from 'next/navigation'
import { getServerContext } from '@/lib/context/serverContext'
import { getConditionById, getOpportunityForCondition } from '@/lib/domain/opportunities'
import { getAppBySlug } from '@/lib/data'
import OpportunityDetailView from '@/components/opportunity/OpportunityDetailView'

export default async function OpportunityConditionPage({
  params,
  searchParams,
}: {
  params: Promise<{ condition: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { condition: conditionId } = await params
  const sp = await searchParams
  const ctx = await getServerContext(sp)

  const conditionDomain = getConditionById(conditionId)
  if (!conditionDomain) notFound()

  const opportunity = getOpportunityForCondition(conditionId, ctx)

  const products = conditionDomain.productSlugs
    .map((slug) => getAppBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getAppBySlug>>[]

  return (
    <OpportunityDetailView
      context={ctx}
      condition={conditionDomain}
      opportunity={opportunity}
      products={products}
    />
  )
}
