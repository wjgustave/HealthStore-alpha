'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'

/**
 * Canonical button primitive (DS Round 2).
 *
 * Decisions applied: primary radius = md/8px (BTN-1), primary hover = #004B8C
 * (BTN-2), toggle "on" state = blue-tinted (BTN-3 Option B), icon radius = md
 * (BTN-4). Replaces the 8 bespoke buttons + inline CTAs catalogued in the v1 audit.
 *
 * Layout is driven by props (not overridable utility classes) because the project
 * has no tailwind-merge, so conflicting utilities cannot reliably be overridden.
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
  /** Square 40x40 icon button. */
  iconOnly?: boolean
  /** Full-width. */
  block?: boolean
  /** Pill / fully rounded (FABs, toggles). */
  pill?: boolean
  /** Toggle "on" state (blue-tinted). Only meaningful with `variant="toggle"`. */
  pressed?: boolean
  /** Drop the border on `secondary` / `toggle` (PDP hero uses borderless). */
  borderless?: boolean
  /** Pending state: sets aria-busy and disables. */
  loading?: boolean
  /**
   * Render as `aria-disabled` instead of native `disabled` (DIS-1). The control
   * stays in the tab order and clicks are blocked, for disabled states that need
   * to remain focusable and explain themselves (e.g. "compare basket full").
   */
  ariaDisabled?: boolean
  /** Tooltip shown while `ariaDisabled` (also used as the native `title`). */
  disabledReason?: string
  children?: ReactNode
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3.5 py-2 text-[0.8rem] gap-1.5',
  md: 'min-h-[44px] px-5 py-3 text-[var(--text-label)] gap-2',
  lg: 'min-h-[52px] px-6 py-3.5 text-base gap-2',
  none: '',
}

const RADIUS: Record<ButtonRadius, string> = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  pill: 'rounded-full',
}

function variantClasses(variant: ButtonVariant, pressed: boolean, borderless: boolean): string {
  const ring = borderless ? '' : 'border border-[var(--nhs-blue)]'
  switch (variant) {
    case 'primary':
      return 'text-white bg-[var(--nhs-blue)] hover:bg-[#004B8C]'
    case 'secondary':
      return clsx('bg-white text-[var(--nhs-blue)] hover:bg-[#E6F0FB]', ring)
    case 'ghost':
      return 'bg-transparent text-[var(--text-secondary)] hover:bg-[#eef2f7] hover:text-[var(--text-primary)]'
    case 'destructive':
      return 'text-white bg-[var(--nhs-red)] hover:bg-[#b21d12]'
    case 'on-accent':
      return 'bg-white text-[var(--nhs-blue)] hover:bg-[#E6F0FB]'
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

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      disabled={disabled || loading}
      aria-disabled={softDisabled || undefined}
      aria-busy={loading || undefined}
      title={softDisabled ? disabledReason ?? title : title}
      onClick={softDisabled ? (e) => e.preventDefault() : onClick}
      className={clsx(
        'inline-flex font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        softDisabled && 'opacity-40 cursor-not-allowed',
        align === 'start' ? 'items-start justify-start text-left' : 'items-center justify-center text-center',
        iconOnly ? 'h-10 w-10 min-h-10 p-0' : SIZE[size],
        RADIUS[resolvedRadius],
        variantClasses(variant, pressed, borderless),
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
