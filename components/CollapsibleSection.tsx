'use client'

import { useId, useState } from 'react'
import { SectionHeader } from '@/components/Badges'

export function CollapsibleSection({
  title,
  description,
  defaultOpen = true,
  children,
}: {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <section className="hs-surface-card bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between gap-3 mb-0">
        <div className="flex-1 min-w-0">
          <SectionHeader title={title} description={description} />
        </div>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex-shrink-0 mt-1 px-2 py-1 text-xs font-semibold rounded-md border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          aria-expanded={open}
          aria-controls={panelId}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      <div id={panelId} hidden={!open} className="pt-2">
        {children}
      </div>
    </section>
  )
}

export function CollapsibleInline({
  title,
  description,
  defaultOpen = true,
  children,
}: {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className="border-t pt-5 mt-5" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between gap-3 mb-0">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {description && (
            <p className="text-xs mb-0" style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex-shrink-0 px-2 py-1 text-xs font-semibold rounded-md border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          aria-expanded={open}
          aria-controls={panelId}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      <div id={panelId} hidden={!open} className="mt-4">
        {children}
      </div>
    </div>
  )
}
