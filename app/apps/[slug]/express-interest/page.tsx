import { notFound } from 'next/navigation'
import { getAllAppsUnfiltered, getAppBySlug } from '@/lib/data'
import ExpressInterestJourney from '@/components/eoi/ExpressInterestJourney'

export async function generateStaticParams() {
  return getAllAppsUnfiltered().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  return {
    title: app ? `Express interest in ${app.app_name} — NHS HealthStore` : 'Not found',
  }
}

export default async function ExpressInterestPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()

  return <ExpressInterestJourney appId={app.id} appName={app.app_name} appSlug={app.slug} />
}
