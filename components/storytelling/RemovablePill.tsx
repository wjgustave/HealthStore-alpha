'use client'

import { X } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Removable / interactive chip. [Provenance: Bespoke — NHS Tag is static + square]
 *
 * The NHS Tag is a static, square status label, so a dismissible filter chip is
 * inferred from the pill token already in globals.css. When `onRemove` is given it
 * renders a labelled remove button (NHS focus ring inherited from :focus-visible).
 */
export function RemovablePill({
  children,
  onRemove,
  removeLabel,
  className = '',
}: {
  children: ReactNode
  onRemove?: () => void
  /** Accessible label for the remove control, e.g. "Remove COPD filter". */
  removeLabel?: string
  className?: string
}) {
  return (
    <span className={`pill${className ? ` ${className}` : ''}`}>
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? 'Remove'}
          className="-mr-1 inline-flex items-center justify-center rounded-full p-0.5 transition-colors hover:bg-[#E6F0FB]"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
    </span>
  )
}

export default RemovablePill
