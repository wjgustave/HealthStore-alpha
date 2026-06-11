import type { ReactNode } from 'react'
import { PdpShareRegion } from '@/components/PdpSharePrintContext'

/**
 * Flat PDP section (no collapse). Used inside tab panels instead of ProductPageExpander.
 * Registers with share/print via PdpShareRegion.
 */
export function PdpSection({
  shareKey,
  label,
  description,
  title,
  id,
  children,
  className = '',
}: {
  shareKey: string
  /** Share modal label (defaults to title). */
  label?: string
  description?: string
  title: string
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <PdpShareRegion shareKey={shareKey} label={label ?? title} description={description} className={`mb-8 last:mb-0 ${className}`.trim()}>
      <section id={id}>
        <h2
          className={`font-bold leading-snug ${description ? 'mb-1' : 'mb-4'}`}
          style={{ fontSize: 'var(--text-section-alt)', color: '#005EB8' }}
        >
          {title}
        </h2>
        {description ? (
          <p className="mb-4 text-sm leading-normal" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        ) : null}
        <div>{children}</div>
      </section>
    </PdpShareRegion>
  )
}
