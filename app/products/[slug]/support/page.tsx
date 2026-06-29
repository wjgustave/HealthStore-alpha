import { Suspense } from 'react'
import { getAppBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import SupportFunnelClient from '@/components/case/SupportFunnelClient'

export default async function ProductSupportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()

  return (
    <Suspense>
      <SupportFunnelClient productSlug={slug} productName={app.app_name} />
    </Suspense>
  )
}
