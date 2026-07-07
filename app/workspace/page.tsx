import { getServerContext } from '@/lib/context/serverContext'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { commissioningCases } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { getWorkspaceIcbData } from '@/lib/localData/workspaceData'
import WorkspaceClient from '@/components/workspace/WorkspaceClient'

export const dynamic = 'force-dynamic'

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const ctx = await getServerContext(params)
  const session = await getSession()
  const workspaceData = getWorkspaceIcbData(ctx)

  let cases: (typeof commissioningCases.$inferSelect)[] = []
  try {
    const database = db()
    if (session.organizationId) {
      cases = await database
        .select()
        .from(commissioningCases)
        .where(eq(commissioningCases.organizationId, session.organizationId))
        .orderBy(desc(commissioningCases.createdAt))
        .limit(10)
    } else {
      cases = await database.select().from(commissioningCases).orderBy(desc(commissioningCases.createdAt)).limit(5)
    }
  } catch {
    // DB optional in prototype
  }

  const hasDeployments = workspaceData.deployments.length > 0 || cases.length > 0

  return (
    <WorkspaceClient
      orgName={session.profileOrganisationName ?? 'Your organisation'}
      context={ctx}
      workspaceData={workspaceData}
      hasDeployments={hasDeployments}
      cases={cases.map((c) => ({
        reference: c.reference,
        status: c.status,
        nextAction: c.nextAction,
        ownerQueue: c.ownerQueue ?? 'Triage',
        productName: c.productName ?? undefined,
      }))}
    />
  )
}
