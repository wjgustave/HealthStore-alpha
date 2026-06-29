import { getAllAppsUnfiltered, getAppBySlug } from '@/lib/data'
import { resolveProductNarrative } from '@/lib/content/productNarratives'
import { getServerContext } from '@/lib/context/serverContext'
import ProductNarrativeView from '@/components/product/ProductNarrativeView'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return getAllAppsUnfiltered().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  return { title: app ? `${app.app_name} — HealthStore` : 'Product — HealthStore' }
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()

  const narrative = resolveProductNarrative(slug, app)
  const sp = await searchParams
  const context = await getServerContext(sp)

  return <ProductNarrativeView app={app} narrative={narrative} context={context} />
}
