'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'

/**
 * Button primitive.
 *
 * Provenance:
 *  - `primary` / `secondary` / `destructive` / `on-accent` render the official
 *    NHS Button (`.nhsuk-button` + modifiers). NHS owns shape, shadow, focus and
 *    typography. Mapping: primary -> NHS action button recoloured to NHS blue
 *    (see globals.css), secondary -> --secondary (grey), destructive -> --warning
 *    (red), on-accent -> --reverse (white, for use on dark/coloured backgrounds).
 *    [Provenance: NHS]
 *  - `ghost` / `toggle` / `iconOnly` have no NHS equivalent and stay bespoke,
 *    built to NHS principles (44px target, NHS focus ring).  [Provenance: Bespoke]
 *
 * The public API is unchanged so existing call sites keep working; layout-only
 * props (`size`, `radius`, `pill`, `borderless`) apply to the bespoke paths and
 * are intentionally ignored for the NHS variants (NHS owns their sizing).
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'on-accent'
  | 'toggle'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'none'
export type ButtonRadius = 'md' | 'lg' | 'xl' | 'pill'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  radius?: ButtonRadius
  /** Content alignment. `start` is used by left-aligned, multi-line buttons. */
  align?: 'center' | 'start'
  /** Square 40x40 icon button (bespoke). */
  iconOnly?: boolean
  /** Full-width. */
  block?: boolean
  /** Pill / fully rounded (FABs, toggles — bespoke). */
  pill?: boolean
  /** Toggle "on" state (blue-tinted). Only meaningful with `variant="toggle"`. */
  pressed?: boolean
  /** Drop the border on bespoke `secondary` / `toggle`. */
  borderless?: boolean
  /** Pending state: sets aria-busy and disables. */
  loading?: boolean
  /**
   * Render as `aria-disabled` instead of native `disabled`. The control stays in
   * the tab order and clicks are blocked, for disabled states that need to remain
   * focusable and explain themselves (e.g. "compare basket full").
   */
  ariaDisabled?: boolean
  /** Tooltip shown while `ariaDisabled` (also used as the native `title`). */
  disabledReason?: string
  children?: ReactNode
}

/** NHS variants render official nhsuk-frontend button CSS. */
const NHS_VARIANT: Partial<Record<ButtonVariant, string>> = {
  primary: 'nhsuk-button',
  secondary: 'nhsuk-button nhsuk-button--secondary',
  destructive: 'nhsuk-button nhsuk-button--warning',
  'on-accent': 'nhsuk-button nhsuk-button--reverse',
}

// Paddings use NHS spacing steps (8/16/24px); min-height holds the 44px touch target.
const SIZE: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 py-2 text-[length:var(--text-caption)] gap-2',
  md: 'min-h-[44px] px-4 py-2 text-[var(--text-label)] gap-2',
  lg: 'min-h-[52px] px-6 py-2 hs-text-body gap-2',
  none: '',
}

const RADIUS: Record<ButtonRadius, string> = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  pill: 'rounded-full',
}

/** Bespoke variants (no NHS equivalent) — built to NHS principles. */
function bespokeVariantClasses(variant: ButtonVariant, pressed: boolean, borderless: boolean): string {
  const ring = borderless ? '' : 'border border-[var(--nhs-blue)]'
  switch (variant) {
    case 'ghost':
      return 'bg-transparent text-[var(--text-secondary)] hover:bg-[#eef2f7] hover:text-[var(--text-primary)]'
    case 'toggle':
      return pressed
        ? clsx('bg-[#E6F0FB] text-[var(--nhs-dark)] hover:bg-[#d7e6f8]', ring)
        : clsx('bg-white text-[var(--nhs-blue)] hover:bg-[#E6F0FB]', ring)
    default:
      return ''
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    radius,
    align = 'center',
    iconOnly = false,
    block = false,
    pill = false,
    pressed = false,
    borderless = false,
    loading = false,
    ariaDisabled = false,
    disabledReason,
    disabled,
    type,
    className,
    title,
    onClick,
    children,
    ...rest
  },
  ref,
) {
  const resolvedRadius: ButtonRadius = pill ? 'pill' : radius ?? 'md'
  // aria-disabled only applies when not natively disabled/busy.
  const softDisabled = ariaDisabled && !disabled && !loading
  const isNativeDisabled = disabled || loading

  // NHS button path (primary / secondary / destructive / on-accent), unless it's
  // an icon-only control which has no NHS equivalent.
  const nhsClass = !iconOnly ? NHS_VARIANT[variant] : undefined

  const classes = nhsClass
    ? clsx(
        nhsClass,
        // Reset NHS's in-form bottom margin; align icon + label.
        'mb-0 inline-flex items-center gap-2 align-top',
        align === 'start' ? 'justify-start text-left' : 'justify-center text-center',
        block && 'w-full',
        (softDisabled || isNativeDisabled) && 'nhsuk-button--disabled',
        className,
      )
    : clsx(
        'inline-flex hs-font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        softDisabled && 'opacity-40 cursor-not-allowed',
        align === 'start' ? 'items-start justify-start text-left' : 'items-center justify-center text-center',
        iconOnly ? 'h-10 w-10 min-h-10 p-0' : SIZE[size],
        RADIUS[resolvedRadius],
        bespokeVariantClasses(variant, pressed, borderless),
        block && 'w-full',
        className,
      )

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      disabled={isNativeDisabled}
      aria-disabled={softDisabled || undefined}
      aria-busy={loading || undefined}
      aria-pressed={variant === 'toggle' ? pressed : undefined}
      title={softDisabled ? disabledReason ?? title : title}
      onClick={softDisabled ? (e) => e.preventDefault() : onClick}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
