'use client'

import Link from 'next/link'
import { ChevronRight, AlertTriangle, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

/**
 * Dashboard widget container: the canonical `.hs-surface-card` chrome plus the
 * shared full-height flex column and optional footer link. Header/body are passed
 * as children (use `WidgetHeading` for the common icon + title + count row).
 */
export function WidgetShell({
  children,
  footerHref,
  footerLabel,
  className = '',
}: {
  children: ReactNode
  footerHref?: string
  footerLabel?: ReactNode
  className?: string
}) {
  return (
    <div className={`hs-surface-card flex h-full min-h-0 w-full min-w-0 flex-col p-6 ${className}`.trim()}>
      {children}
      {footerHref ? (
        <Link
          href={footerHref}
          className="mt-6 flex shrink-0 items-center justify-between rounded-lg border px-4 py-4 hs-text-label hs-font-bold transition-colors hover:bg-[#F0F4F5]"
          style={{ borderColor: 'var(--border)', color: 'var(--nhs-blue)' }}
        >
          {footerLabel}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  )
}

/** Muted body line for loading / empty states (keeps widgets visually consistent). */
export function WidgetMessage({ children }: { children: ReactNode }) {
  return (
    <p className="flex-1 hs-text-label" style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  )
}

/**
 * Distinct error state for a widget body (UX-03): an assertive inline alert plus a
 * "Try again" affordance, so a failed fetch never reads as a genuinely empty list.
 */
export function WidgetError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex-1">
      <div
        role="alert"
        className="flex items-start gap-2 rounded-lg px-4 py-2 hs-text-label"
        style={{ background: '#FDECEA', color: '#7A1210' }}
      >
        <AlertTriangle className="mt-1 h-4 w-4 shrink-0" aria-hidden />
        <span className="min-w-0">{message}</span>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4 gap-2">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Try again
        </Button>
      ) : null}
    </div>
  )
}

/** Standard widget header: icon + title on the left, optional count pill on the right. */
export function WidgetHeading({
  icon,
  title,
  count,
  countColor,
  className = 'mb-4',
}: {
  icon?: ReactNode
  title: ReactNode
  count?: ReactNode
  countColor?: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between gap-2 ${className}`.trim()}>
      <h3 className="flex items-center gap-2 hs-text-card-title-sm hs-font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
        {icon}
        {title}
      </h3>
      {count != null ? (
        <span
          className="min-w-[1.5rem] rounded-md px-2 py-1 text-center hs-text-caption hs-font-bold text-white"
          style={{ background: countColor ?? 'var(--nhs-blue)' }}
        >
          {count}
        </span>
      ) : null}
    </div>
  )
}
