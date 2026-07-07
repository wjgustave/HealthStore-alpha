import { permanentRedirect } from 'next/navigation'

/**
 * Content migration Round 1: the /products narrative route is retired. The hybrid
 * /apps/[slug] PDP uses the Express interest flow for commissioning support, so this
 * support funnel redirects there. SupportFunnelClient stays available for future use.
 */
export default async function ProductSupportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`/apps/${slug}`)
}
