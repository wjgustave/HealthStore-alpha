import Link from 'next/link'
import Image from 'next/image'
import type { App } from '@/lib/data'
import { DtacBadge, MaturityBadge, EvidenceBadge, EffortBadge, SupervisionBadge, ConditionTag } from './Badges'

const conditionColours: Record<string, string> = {
  copd: '#005EB8', insomnia: '#330072', weight_management: '#007F3B', msk: '#D5840D', eating_disorders: '#DA291C',
}

export default function AppCard({ app, selected, onSelect }: {
  app: App; selected?: boolean; onSelect?: (id: string) => void
}) {
  const accentColor = conditionColours[app.condition_tags[0]] ?? '#005EB8'

  return (
    <div
      className="app-card rounded-xl bg-white border relative flex flex-col"
      style={{
        borderColor: selected ? accentColor : 'var(--border)',
        boxShadow: selected ? `0 0 0 2px ${accentColor}33, var(--shadow-md)` : 'var(--shadow-sm)',
      }}
    >
      <div className="rounded-t-xl h-1.5" style={{ background: accentColor }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {app.logo_path && (
              <Image src={app.logo_path} alt={`${app.app_name} logo`} width={36} height={36}
                className="rounded-lg flex-shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-base leading-tight" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
                {app.app_name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{app.supplier_name}</p>
            </div>
          </div>
          {onSelect && (
            <button
              onClick={() => onSelect(app.id)}
              title={selected ? 'Remove from compare' : 'Add to compare'}
              className="flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors"
              style={{
                borderColor: selected ? accentColor : 'var(--border)',
                background: selected ? accentColor : 'transparent',
                color: selected ? '#fff' : 'var(--text-muted)',
              }}
            >
              {selected ? '✓' : '+'}
            </button>
          )}
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1 mb-3">
          {app.condition_tags.map(t => <ConditionTag key={t} tag={t} />)}
          <SupervisionBadge model={app.supervision_model} />
        </div>

        {/* Value prop */}
        <p className="text-xs flex-1 leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {app.one_line_value_proposition}
        </p>

        {/* Status grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <div>
            <span className="block" style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Maturity</span>
            <MaturityBadge level={app.maturity_level} />
          </div>
          <div>
            <span className="block" style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Evidence</span>
            <EvidenceBadge strength={app.evidence_strength} />
          </div>
          <div>
            <span className="block" style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Local effort</span>
            <EffortBadge level={app.local_wraparound} />
          </div>
          <div>
            <span className="block" style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>DTAC</span>
            <DtacBadge status={app.dtac_status} />
          </div>
        </div>

        {/* NHSE funding flag */}
        {app.nhse_125k_eligible === true && (
          <div className="mb-3 rounded-md px-2.5 py-1.5 text-xs font-medium flex items-center gap-1.5"
            style={{ background: '#E6F5EC', color: '#004B22' }}>
            <span>★</span> NHSE £125k funding eligible
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/apps/${app.slug}`}
          className="mt-auto text-center rounded-lg py-2.5 text-sm font-semibold transition-colors"
          style={{ background: accentColor, color: '#fff' }}
        >
          View full assessment →
        </Link>
      </div>
    </div>
  )
}
