import type { CSSProperties } from 'react'
import { isVisibleCondition } from '@/lib/visibleConditions'

const pillText: CSSProperties = {
  fontSize: 12,
  lineHeight: '1.25',
  fontWeight: 600,
  padding: '3px 8px',
  borderRadius: 6,
  border: 'none',
  display: 'inline-block',
}

const CONDITION_LABELS: Record<string, string> = {
  copd: 'COPD',
  insomnia: 'Insomnia',
  weight_management: 'Weight management',
  msk: 'MSK',
  eating_disorders: 'Eating disorders',
  cardiac_rehab: 'Cardiac rehab',
}

const CONDITION_TINT: Record<string, { bg: string; color: string }> = {
  copd: { bg: 'rgba(0, 94, 184, 0.14)', color: '#003d7a' },
  cardiac_rehab: { bg: 'rgba(174, 37, 115, 0.14)', color: '#7a1a4a' },
}

export function EditorialTopicPill({ label }: { label: string }) {
  return (
    <span style={{ ...pillText, background: '#E8ECEF', color: '#3d4f5f' }}>
      {label}
    </span>
  )
}

/** Evidence type / category — same visual language as topic pills on home editorial only */
export function EditorialCategoryPill({ label }: { label: string }) {
  return (
    <span style={{ ...pillText, background: '#E2E8F0', color: '#334155' }}>
      {label}
    </span>
  )
}

export function EditorialConditionPill({ tag }: { tag: string }) {
  const label = CONDITION_LABELS[tag] ?? tag
  const tint = CONDITION_TINT[tag] ?? { bg: 'rgba(0, 48, 135, 0.1)', color: '#003087' }
  return (
    <span style={{ ...pillText, background: tint.bg, color: tint.color }}>
      {label}
    </span>
  )
}

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
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {topics.map((t) => (
        <EditorialTopicPill key={t} label={t} />
      ))}
      {conditions.filter(isVisibleCondition).map((t) => (
        <EditorialConditionPill key={t} tag={t} />
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
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <EditorialCategoryPill label={evidenceType} />
      {conditions.filter(isVisibleCondition).map((t) => (
        <EditorialConditionPill key={t} tag={t} />
      ))}
    </div>
  )
}
