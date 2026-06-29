'use client'

import type { ScenarioId } from '@/lib/context/types'

export default function ScenarioControls({
  value,
  onChange,
}: {
  value: ScenarioId
  onChange: (s: ScenarioId) => void
}) {
  const options: { id: ScenarioId; label: string; hint: string }[] = [
    { id: 'conservative', label: 'Conservative', hint: 'Lower effect' },
    { id: 'central', label: 'Central', hint: 'Base assumptions' },
    { id: 'evidence_led', label: 'Evidence-led', hint: 'Upper bound' },
  ]

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const active = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              padding: '10px 16px',
              border: active ? '2px solid #005eb8' : '1px solid #d8dde0',
              borderRadius: 6,
              background: active ? '#e6f0fb' : '#fff',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ display: 'block', fontSize: 14, fontWeight: active ? 600 : 500, color: active ? '#005eb8' : '#212b32' }}>
              {o.label}
            </span>
            <span style={{ display: 'block', fontSize: 12, color: '#4c6272', marginTop: 2 }}>
              {o.hint}
            </span>
          </button>
        )
      })}
    </div>
  )
}
