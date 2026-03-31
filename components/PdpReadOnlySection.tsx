import type { ReactNode } from 'react'

/**
 * Read-only PDP block for shared excerpt views (no expand/collapse client chrome).
 */
export function PdpReadOnlySection({
  title,
  description,
  children,
  className = '',
  id,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
  /** Optional DOM id for in-page anchors (e.g. shared excerpt deep links). */
  id?: string
}) {
  return (
    <section
      id={id}
      className={`rounded-xl border bg-white overflow-hidden ${className}`.trim()}
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: '#F7F9FC' }}>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {description ? (
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}
