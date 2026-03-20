import { dtacLabels, maturityLabels, effortLabels, evidenceLabels, supervisionLabels } from '@/lib/data'

export function DtacBadge({ status }: { status: string }) {
  const label = dtacLabels[status] ?? status
  const cls = status === 'passed' ? 'badge-green'
    : status === 'passed_refresh_required' ? 'badge-amber'
    : status === 'required_not_confirmed' ? 'badge-green'
    : 'badge-grey'
  return <span className={`badge ${cls}`}>{label}</span>
}

export function MaturityBadge({ level }: { level: string }) {
  const label = maturityLabels[level] ?? level
  const cls = level === 'scaled' ? 'badge-green'
    : level === 'multi_site_live' ? 'badge-blue'
    : level === 'limited_live' ? 'badge-amber'
    : 'badge-grey'
  return <span className={`badge ${cls}`}>{label}</span>
}

export function EvidenceBadge({ strength }: { strength: string }) {
  const label = evidenceLabels[strength] ?? strength
  const cls = strength === 'established' ? 'badge-green'
    : strength === 'promising' ? 'badge-blue'
    : strength === 'scaled' ? 'badge-teal'
    : 'badge-grey'
  return <span className={`badge ${cls}`}>{label}</span>
}

export function EffortBadge({ level }: { level: string }) {
  const label = effortLabels[level] ?? level
  const cls = `badge effort-${level}`
  return <span className={`badge ${cls}`}>{label}</span>
}

export function SupervisionBadge({ model }: { model: string }) {
  const label = supervisionLabels[model] ?? model
  const cls = model === 'active_remote_management' ? 'badge-purple'
    : model === 'non_continuous_review' ? 'badge-blue'
    : model === 'guided_self_help' ? 'badge-teal'
    : 'badge-grey'
  return <span className={`badge ${cls}`}>{label}</span>
}

export function NiceTypeBadge({ type }: { type: string }) {
  const cls = type === 'EVA' ? 'badge-blue' : type === 'HTG' ? 'badge-teal' : type === 'MTG' ? 'badge-purple' : 'badge-grey'
  return <span className={`badge ${cls}`}>{type}</span>
}

export function ConditionTag({ tag }: { tag: string }) {
  const labels: Record<string, string> = {
    copd: 'COPD', insomnia: 'Insomnia', weight_management: 'Weight management',
    msk: 'MSK', eating_disorders: 'Eating disorders', cardiac_rehab: 'Cardiac rehab',
  }
  const label = labels[tag] ?? tag
  return (
    <span
      className="badge"
      style={{
        background: '#fff',
        color: 'rgb(0, 94, 184)',
        border: '1px solid rgb(0, 94, 184)',
      }}
    >
      {label}
    </span>
  )
}

export function FundingStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    open: 'Open', closed: 'Closed', closed_confirm: 'Closed – confirm', periodic: 'Periodic'
  }
  const cls = status === 'open' ? 'badge-green' : status === 'periodic' ? 'badge-blue' : 'badge-grey'
  return <span className={`badge ${cls}`}>{labels[status] ?? status}</span>
}

export function AlertBox({ type, children }: { type: 'warning' | 'info' | 'danger'; children: React.ReactNode }) {
  const styles = {
    warning: { bg: '#FEF5E6', border: '#D5840D', text: '#7A4800', icon: '⚠' },
    info: { bg: '#E6F0FB', border: '#005EB8', text: '#003087', icon: 'ℹ' },
    danger: { bg: '#FDECEA', border: '#DA291C', text: '#7A1210', icon: '✕' },
  }
  const s = styles[type]
  const role = type === 'danger' ? 'alert' : 'status'
  return (
    <div
      role={role}
      className="rounded-lg p-4 flex gap-3 text-sm"
      style={{ background: s.bg, borderLeft: `4px solid ${s.border}`, color: s.text }}
    >
      <span className="font-bold flex-shrink-0" aria-hidden>
        {s.icon}
      </span>
      <div>{children}</div>
    </div>
  )
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-bold mb-1" style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--text-primary)' }}>{title}</h2>
      {description && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      <div className="mt-3 h-0.5 rounded" style={{ background: 'linear-gradient(90deg, var(--nhs-blue), transparent)' }} />
    </div>
  )
}
