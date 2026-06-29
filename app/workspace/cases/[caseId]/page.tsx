import Link from 'next/link'
import { db } from '@/lib/db'
import { commissioningCases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import CommissioningCaseTracker from '@/components/case/CommissioningCaseTracker'
import { InsightCallout } from '@/components/charts'

export const dynamic = 'force-dynamic'

export default async function CaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params
  let caseRow = null
  try {
    const database = db()
    const rows = await database.select().from(commissioningCases).where(eq(commissioningCases.reference, caseId)).limit(1)
    caseRow = rows[0] ?? null
  } catch {
    // DB optional
  }

  if (!caseRow) {
    return (
      <>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Case {caseId}</h1>
        <InsightCallout>
          Case details are available when the database is connected. Reference recorded: {caseId}
        </InsightCallout>
        <Link href="/workspace" className="hs-back-link">← Back to workspace</Link>
      </>
    )
  }

  return (
    <>
      <Link href="/workspace" className="hs-back-link">← Back to workspace</Link>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 24 }}>Commissioning support case</h1>
      <CommissioningCaseTracker
        reference={caseRow.reference}
        status={caseRow.status}
        nextAction={caseRow.nextAction}
        ownerQueue={caseRow.ownerQueue ?? 'Triage'}
        productName={caseRow.productName ?? undefined}
      />
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '24px 0 12px' }}>Support requested</h2>
      <ul style={{ paddingLeft: 20, color: '#4c6272', lineHeight: 1.6 }}>
        {caseRow.supportRequested.map((s) => (
          <li key={s}>{s.replace(/_/g, ' ')}</li>
        ))}
      </ul>
      <div style={{ marginTop: 24 }}>
        <InsightCallout variant="warn">
          This request is not a purchase or procurement award.
        </InsightCallout>
      </div>
    </>
  )
}
