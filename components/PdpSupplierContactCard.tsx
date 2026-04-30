import { NOT_STATED } from '@/lib/compareFieldFormat'

export default function PdpSupplierContactCard({ email }: { email?: string | null }) {
  const trimmed = (email ?? '').trim()
  const showEmailLink = trimmed.length > 0

  return (
    <div className="hs-surface-card-sm bg-white rounded-xl border p-5 space-y-3" style={{ borderColor: 'var(--border)' }}>
      <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        Supplier contact information
      </div>
      <div className="text-sm">
        <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
          Email
        </div>
        {showEmailLink ? (
          <a href={`mailto:${trimmed}`} className="font-medium break-all hover:underline" style={{ color: '#005EB8' }}>
            {trimmed}
          </a>
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>{NOT_STATED}</span>
        )}
      </div>
    </div>
  )
}
