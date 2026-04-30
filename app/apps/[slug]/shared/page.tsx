import { getAppBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { verifyProductShareToken } from '@/lib/productShareToken'
import { sharedKeysWithVisibleContent } from '@/lib/pdpShareVisibility'
import AppDetailClient from '../AppDetailClient'
import PdpSharedProductBody from '../PdpSharedProductBody'
import { SharedProductViewBanner } from '@/components/SharedProductViewBanner'
import { STORE_ACCENT } from '@/lib/storeAccent'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { getCommissioningContextLabel } from '@/lib/commissioningContextDisplay'

export const dynamic = 'force-dynamic'

function ShareError({
  title,
  body,
  slug,
}: {
  title: string
  body: string
  slug?: string
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div
        className="rounded-xl border p-6"
        role="alert"
        style={{ borderColor: 'var(--border)', background: '#FEF5E6' }}
      >
        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {body}
        </p>
        {slug ? (
          <p className="mt-4">
            <Link href={`/apps/${slug}`} className="text-sm font-semibold underline underline-offset-2" style={{ color: STORE_ACCENT }}>
              Open product page
            </Link>
          </p>
        ) : (
          <p className="mt-4">
            <Link href="/apps" className="text-sm font-semibold underline underline-offset-2" style={{ color: STORE_ACCENT }}>
              Find apps
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  return {
    title: app ? `Shared view — ${app.app_name} — HealthStore` : 'Shared view — HealthStore',
  }
}

export default async function SharedProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { slug } = await params
  const { t } = await searchParams

  const session = await getSession()
  if (!session.isLoggedIn || session.requiresCommissioningEntitySelection) {
    return (
      <ShareError
        title="Sign in required"
        body="Shared product links are only available to signed-in HealthStore users. If you use multi-organisation sign-in, choose your commissioning organisation first."
      />
    )
  }

  if (!t || typeof t !== 'string') {
    return (
      <ShareError
        title="This link is incomplete"
        body="The share link is missing its token. Ask the sender to create a new link from Share → Share as link."
        slug={slug}
      />
    )
  }

  const parsed = await verifyProductShareToken(t)
  if (!parsed || parsed.slug !== slug) {
    return (
      <ShareError
        title="This link is not valid"
        body="The link may be corrupted, expired, or was not issued for this product. Links expire after 14 days. Ask the sender to create a new link."
        slug={slug}
      />
    )
  }

  const sessionEnt = session.commissioningEntityId ?? ''
  if (parsed.ent !== sessionEnt) {
    return (
      <ShareError
        title="Organisation mismatch"
        body="This link was created in a different commissioning context. Switch organisation if you have access, or ask the sender to create a link while signed in with the same organisation you use."
        slug={slug}
      />
    )
  }

  const app = getAppBySlug(slug)
  if (!app) notFound()

  const commissioningOrganisationLabel = getCommissioningContextLabel(session)

  const allowedKeys = new Set(parsed.keys)

  const renderedKeys = sharedKeysWithVisibleContent(app, allowedKeys)

  if (renderedKeys.length === 0) {
    return (
      <AppDetailClient app={app} commissioningOrganisationLabel={commissioningOrganisationLabel}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <PageBreadcrumb
            items={[
              { label: 'Find apps', href: '/apps' },
              { label: 'Condition catalogue', href: '/apps/condition-catalogue' },
              { label: app.app_name },
            ]}
          />
          <SharedProductViewBanner appName={app.app_name} slug={slug} renderedKeys={[]} />
          <div
            className="rounded-xl border p-6 mt-4"
            role="status"
            style={{ borderColor: 'var(--border)', background: '#F7F9FC' }}
          >
            <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Nothing to show for this product
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The sections in this link do not have content on this product page (for example, optional blocks that
              are not filled). Ask the sender to include different sections, or open the full product page.
            </p>
            <p className="mt-4">
              <Link
                href={`/apps/${slug}`}
                className="text-sm font-semibold underline underline-offset-2"
                style={{ color: STORE_ACCENT }}
              >
                Open full product page
              </Link>
            </p>
          </div>
        </div>
      </AppDetailClient>
    )
  }

  return (
    <AppDetailClient app={app} commissioningOrganisationLabel={commissioningOrganisationLabel}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb
          items={[
            { label: 'Find apps', href: '/apps' },
            { label: 'Condition catalogue', href: '/apps/condition-catalogue' },
            { label: app.app_name },
          ]}
        />
        <SharedProductViewBanner appName={app.app_name} slug={slug} renderedKeys={renderedKeys} />
        <PdpSharedProductBody app={app} allowedKeys={allowedKeys} />
      </div>
    </AppDetailClient>
  )
}
