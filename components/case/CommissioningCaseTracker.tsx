export default function CommissioningCaseTracker({
  reference,
  status,
  nextAction,
  ownerQueue,
  productName,
}: {
  reference: string
  status: string
  nextAction: string
  ownerQueue: string
  productName?: string
}) {
  const statusLabel = status.replace(/_/g, ' ')
  return (
    <div className="hs-card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
        <div><strong>Reference:</strong> {reference}</div>
        {productName ? <div><strong>Product:</strong> {productName}</div> : null}
        <div><strong>Status:</strong> <span className="hs-tag hs-tag-grey">{statusLabel}</span></div>
        <div><strong>Owner / queue:</strong> {ownerQueue}</div>
        <div><strong>Next action:</strong> {nextAction}</div>
      </div>
    </div>
  )
}
