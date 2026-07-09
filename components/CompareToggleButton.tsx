'use client'

import { Check, GitCompare } from 'lucide-react'
import { useCompareBasket } from '@/components/CompareBasketProvider'
import { Button, type ButtonSize } from '@/components/ui/Button'

/** Matches `.badge-teal` (e.g. Self-management supervision badge). */
export function CompareToggleButton({
  appId,
  className = '',
  size = 'none',
  /** PDP hero: no border ring (catalogue cards keep bordered style). */
  borderless = false,
  /** Solid NHS grey-1 button (white text, black press shadow) — PDP hero next to Express interest. */
  solid = false,
}: {
  appId: string
  /** e.g. `sm:col-span-1 w-full` for catalogue card grid */
  className?: string
  size?: ButtonSize
  borderless?: boolean
  solid?: boolean
}) {
  const { toggle, isInBasket, canAdd, ids, incompatibleCompareTooltip } = useCompareBasket()
  const added = isInBasket(appId)
  const atCapacity = !added && ids.length >= 4
  /** Use aria-disabled (not native disabled) so the control stays in the tab order. */
  const blocked = !added && !canAdd(appId)

  /* nhsuk-colour("grey-1") fill, nhsuk-colour("black") press shadow, nhsuk-colour("white") text. */
  const solidClasses =
    'bg-[#4C6272] text-white shadow-[0_4px_0_#212B32] hover:bg-[#425563] active:shadow-none'

  return (
    <Button
      variant={solid ? 'primary' : 'toggle'}
      pressed={added}
      borderless={borderless}
      size={size}
      aria-label={added ? 'Remove from comparison tool' : 'Add to comparison tool'}
      aria-pressed={added}
      ariaDisabled={blocked}
      disabledReason={
        blocked
          ? atCapacity
            ? 'A maximum of 4 apps can be in the comparison tool.'
            : incompatibleCompareTooltip || undefined
          : undefined
      }
      onClick={() => toggle(appId)}
      className={`${solid ? solidClasses : ''} ${size === 'none' ? 'py-4 hs-text-label' : ''} ${className}`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {added ? (
          <>
            <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden />
            Added
          </>
        ) : (
          <>
            <GitCompare className="w-4 h-4 shrink-0" aria-hidden />
            Add to compare
          </>
        )}
      </span>
    </Button>
  )
}
