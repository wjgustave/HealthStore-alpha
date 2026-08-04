import { dtacLabels, maturityLabels, effortLabels, evidenceLabels, supervisionLabels } from '@/lib/data'
import { isVisibleCondition } from '@/lib/visibleConditions'

/**
 * Status/metadata tags. [Provenance: NHS] — rendered with the official NHS Tag
 * (`.nhsuk-tag` + colour modifier). NHS Tag has no generic semantic colours, so we
 * map the product's status palette to the nearest NHS tag colour.
 */
type TagColour =
  | 'white' | 'grey' | 'green' | 'aqua-green' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow'

function Tag({ colour, children }: { colour: TagColour; children: React.ReactNode }) {
  return <span className={`nhsuk-tag nhsuk-tag--${colour}`}>{children}</span>
}

export function DtacBadge({ status }: { status: string }) {
  const label = dtacLabels[status] ?? status
  const colour: TagColour = status === 'passed' ? 'green'
    : status === 'passed_refresh_required' ? 'orange'
    : status === 'required_not_confirmed' ? 'green'
    : 'grey'
  return <Tag colour={colour}>{label}</Tag>
}

const ESTABLISHED_MATURITY_LEVELS = new Set(['scaled', 'multi_site_live'])

export function MaturityBadge({
  level,
  hideEstablished = false,
}: {
  level: string
  /** Omit the badge when maturity maps to "Established" (hero / catalogue cards). */
  hideEstablished?: boolean
}) {
  if (hideEstablished && ESTABLISHED_MATURITY_LEVELS.has(level)) return null
  const label = maturityLabels[level] ?? level
  const colour: TagColour = level === 'scaled' ? 'green'
    : level === 'multi_site_live' ? 'blue'
    : level === 'limited_live' ? 'orange'
    : 'grey'
  return <Tag colour={colour}>{label}</Tag>
}

export function EvidenceBadge({ strength }: { strength: string }) {
  const label = evidenceLabels[strength] ?? strength
  const colour: TagColour = strength === 'strong' ? 'green'
    : strength === 'moderate' ? 'blue'
    : 'grey'
  return <Tag colour={colour}>{label}</Tag>
}

export function EffortBadge({ level }: { level: string }) {
  const label = effortLabels[level] ?? level
  const colour: TagColour = level === 'low' ? 'green' : level === 'medium' ? 'orange' : level === 'high' ? 'red' : 'grey'
  return <Tag colour={colour}>{label}</Tag>
}

export function SupervisionBadge({ model }: { model: string }) {
  const label = supervisionLabels[model] ?? model
  if (model === 'guided_self_help') {
    return <Tag colour="grey">{label}</Tag>
  }
  const colour: TagColour = model === 'active_remote_management' ? 'purple'
    : model === 'non_continuous_review' ? 'blue'
    : model === 'self_management_only' ? 'aqua-green'
    : 'grey'
  return <Tag colour={colour}>{label}</Tag>
}

export function NiceTypeBadge({ type }: { type: string }) {
  const colour: TagColour = type === 'EVA' ? 'blue' : type === 'HTG' ? 'aqua-green' : type === 'MTG' ? 'purple' : 'grey'
  return <Tag colour={colour}>{type}</Tag>
}

export function TopicPill({ label }: { label: string }) {
  return <Tag colour="grey">{label}</Tag>
}

const CONDITION_LABELS: Record<string, string> = {
  copd: 'COPD', insomnia: 'Insomnia', weight_management: 'Weight management',
  msk: 'MSK', eating_disorders: 'Eating disorders', cardiac_rehab: 'Cardiac rehab',
  pulmonary_rehab: 'Pulmonary rehab',
}

export function ConditionTag({ tag }: { tag: string }) {
  return <Tag colour="blue">{CONDITION_LABELS[tag] ?? tag}</Tag>
}

/**
 * Editorial pill rows (home news / campaigns / evidence). Folded in from the former
 * `EditorialPills` module so all pills render through the canonical `.badge` modifiers.
 */
export function EditorialPillRow({
  topics,
  conditions,
  className = 'mb-2',
}: {
  topics: string[]
  conditions: string[]
  className?: string
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {topics.map((t) => (
        <TopicPill key={t} label={t} />
      ))}
      {conditions.filter(isVisibleCondition).map((t) => (
        <ConditionTag key={t} tag={t} />
      ))}
    </div>
  )
}

export function EditorialEvidenceMetaRow({
  evidenceType,
  conditions,
  className = '',
}: {
  evidenceType: string
  conditions: string[]
  className?: string
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <TopicPill label={evidenceType} />
      {conditions.filter(isVisibleCondition).map((t) => (
        <ConditionTag key={t} tag={t} />
      ))}
    </div>
  )
}

export function FundingStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    open: 'Live',
    closed: 'Closed',
    closed_confirm: 'Closed – confirm',
    upcoming: 'Future',
    periodic: 'Future',
  }
  const isUpcoming = status === 'upcoming' || status === 'periodic'
  const colour: TagColour = status === 'open' ? 'green' : isUpcoming ? 'orange' : 'grey'
  return <Tag colour={colour}>{labels[status] ?? status}</Tag>
}

/**
 * Inline alert. [Provenance: NHS]
 *  - `info`             -> NHS Inset text (`.nhsuk-inset-text`)
 *  - `warning`/`danger` -> NHS Warning callout (`.nhsuk-warning-callout`)
 * NHS has no distinct "danger" callout; the warning callout is the nearest
 * equivalent, with the label varied by severity.
 */
export function AlertBox({ type, children }: { type: 'warning' | 'info' | 'danger'; children: React.ReactNode }) {
  if (type === 'info') {
    return (
      <div className="nhsuk-inset-text" role="status">
        <span className="nhsuk-u-visually-hidden">Information: </span>
        <div>{children}</div>
      </div>
    )
  }
  const label = type === 'danger' ? 'Warning' : 'Important'
  return (
    <div className="nhsuk-warning-callout" role={type === 'danger' ? 'alert' : 'status'}>
      <h3 className="nhsuk-warning-callout__label">
        <span role="text">
          <span className="nhsuk-u-visually-hidden">{label}: </span>
          {label}
        </span>
      </h3>
      <div>{children}</div>
    </div>
  )
}

export function SectionHeader({
  title,
  description,
  id,
}: {
  title: string
  description?: string
  id?: string
}) {
  return (
    <div className="mb-6">
      <h2
        id={id}
        className="hs-font-bold mb-1"
        style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-section-alt)', color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      {description && <p className="hs-text-label" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      <div className="mt-4 h-0.5 rounded" style={{ background: 'linear-gradient(90deg, var(--nhs-blue), transparent)' }} />
    </div>
  )
}
