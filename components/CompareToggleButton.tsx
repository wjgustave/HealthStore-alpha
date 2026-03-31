'use client'

import '@awesome.me/webawesome/dist/components/icon/icon.js'
import { Check } from 'lucide-react'
import { useCompareBasket } from '@/components/CompareBasketProvider'

/** Matches `.badge-teal` (e.g. Self-management supervision badge). */
export function CompareToggleButton({
  appId,
  className = '',
  /** PDP hero: no border ring (catalogue cards keep bordered style). */
  borderless = false,
}: {
  appId: string
  /** e.g. `sm:col-span-1 w-full` for catalogue card grid */
  className?: string
  borderless?: boolean
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
      className={`rounded-lg py-4 text-sm font-semibold text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nhs-blue)] ${className} ${
        borderless ? 'border-0' : 'border'
      } ${
        blocked
          ? `cursor-help bg-white text-[#005EB8] opacity-45 hover:bg-white ${borderless ? '' : 'border-[#005EB8]'}` 
          : added
            ? `bg-[#E1F4F5] text-[#004B50] hover:bg-[#cde8eb] ${borderless ? '' : 'border-[#B8E0E4] hover:border-[#9fd4d9]'}` 
            : `bg-white text-[#005EB8] hover:bg-[#E6F0FB] ${borderless ? '' : 'border-[#005EB8]'}`
      }`}
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        {added ? (
          <>
            <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden />
            Added
          </>
        ) : (
          <>
            <wa-icon
              name="code-compare"
              family="classic"
              variant="solid"
              className="shrink-0 text-base leading-none inline-block align-middle text-current"
              aria-hidden
            />
            Compare
          </>
        )}
      </span>
    </button>
  )
}
