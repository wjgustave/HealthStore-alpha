import { permanentRedirect } from 'next/navigation'

/**
 * Content migration Round 1: the standalone narrative product page is retired in
 * favour of the hybrid /apps/[slug] PDP (narrative spine + reference tabs on one page).
 * The narrative rendering components stay in the tree, dormant, for Rounds 2–3.
 */
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`/apps/${slug}`)
}
