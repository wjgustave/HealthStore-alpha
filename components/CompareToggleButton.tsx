'use client'

import { Check, Eye } from 'lucide-react'
import { useCompareBasket } from '@/components/CompareBasketProvider'

/** Matches `.badge-teal` (e.g. Guided self-help supervision badge). */
const ADDED_BG = '#E1F4F5'
const ADDED_FG = '#004B50'
const ADDED_BORDER = '#B8E0E4'

export function CompareToggleButton({
  appId,
  className = '',
}: {
  appId: string
  /** e.g. `sm:col-span-1 w-full` for catalogue card grid */
  className?: string
}) {
  const { toggle, isInBasket, canAdd, ids, incompatibleCompareTooltip } = useCompareBasket()
  const added = isInBasket(appId)
  const atCapacity = !added && ids.length >= 4
  /** Use aria-disabled (not native disabled) so the control stays in the tab order. */
  const blocked = !added && !canAdd(appId)

  return (
    <button
      type="button"
      aria-disabled={blocked}
      onClick={() => {
        if (blocked) return
        toggle(appId)
      }}
      title={
        blocked
          ? atCapacity
            ? 'A maximum of 4 apps can be in the compare list.'
            : incompatibleCompareTooltip || undefined
          : undefined
      }
      className={`rounded-lg py-4 text-sm font-semibold text-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nhs-blue)] ${blocked ? 'opacity-45 cursor-help' : ''} ${className}`}
      style={
        added
          ? {
              background: ADDED_BG,
              color: ADDED_FG,
              borderColor: ADDED_BORDER,
            }
          : {
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              background: '#fff',
            }
      }
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        {added ? (
          <>
            <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden />
            Added
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 shrink-0" strokeWidth={2.25} aria-hidden />
            Compare
          </>
        )}
      </span>
    </button>
  )
}
