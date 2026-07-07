'use client'

import Link from 'next/link'
import type { CommissionerContext } from '@/lib/context/types'
import { contextToSearchParams } from '@/lib/context/types'

export default function LocalContextSelector({
  context,
  compact = false,
}: {
  context: CommissionerContext
  compact?: boolean
}) {
  const changeHref = `/start/place?${contextToSearchParams(context).toString()}`

  if (compact) {
    return (
      <p style={{ fontSize: 14, color: '#4c6272', marginBottom: 16 }}>
        Showing information for <strong>{context.geography_label}</strong>.{' '}
        <Link href={changeHref} style={{ color: '#005eb8' }}>Change area</Link>
      </p>
    )
  }

  return (
    <div style={{ background: '#f0f4f5', borderLeft: '4px solid #005eb8', borderRadius: 4, padding: '12px 16px', marginBottom: 24 }}>
      <p style={{ margin: '0 0 4px', fontSize: 14 }}>
        <strong>Context:</strong> {context.geography_label}
        {context.priority_label ? ` · ${context.priority_label}` : ''}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: '#4c6272' }}>
        Data basis: {context.geography_type === 'national' ? 'England illustrative baseline' : 'ICB-level prototype data'}.
        {' '}<Link href={changeHref} style={{ color: '#005eb8' }}>Change area</Link>
      </p>
    </div>
  )
}
