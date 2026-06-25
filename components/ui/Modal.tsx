'use client'

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useEscape } from './useEscape'
import { useFocusTrap } from './useFocusTrap'
import { useLockBodyScroll } from './useLockBodyScroll'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export type ModalVariant = 'center' | 'drawer'

export interface ModalProps {
  open: boolean
  onClose: () => void
  /** `center` = centred dialog, `drawer` = right-hand slide-over (MOD-1). */
  variant?: ModalVariant
  /** id of the heading that labels the dialog. */
  labelledBy?: string
  /** id of the description text. */
  describedBy?: string
  /** Fallback accessible name when there is no visible heading. */
  ariaLabel?: string
  /** Element to focus on open (MOD-4). Defaults to the first focusable node. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Where focus returns on close (MOD-3). `trigger` uses `triggerRef`. */
  restoreFocus?: 'previous' | 'trigger'
  triggerRef?: RefObject<HTMLElement | null>
  /** Allow backdrop click + Escape to close (default true). */
  dismissable?: boolean
  /** Block all dismissal — backdrop, Escape (MOD-5, e.g. while submitting). */
  lockDismiss?: boolean
  /** Keep children mounted (but inert + off-screen) while closed, preserving
      their internal state — used by the AI drawer to retain the conversation. */
  keepMounted?: boolean
  /** Tailwind z-index utility for the overlay. */
  zIndexClass?: string
  /** Classes applied to the dialog panel (layout, surface, padding). */
  panelClassName?: string
  /** Classes applied to the scrim. */
  scrimClassName?: string
  children: ReactNode
}

const EXIT_MS = 220

function focusFirst(panel: HTMLElement | null) {
  if (!panel) return
  const first = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].find(
    el => el.getAttribute('aria-hidden') !== 'true' && !el.hasAttribute('disabled'),
  )
  ;(first ?? panel).focus()
}

export function Modal({
  open,
  onClose,
  variant = 'center',
  labelledBy,
  describedBy,
  ariaLabel,
  initialFocusRef,
  restoreFocus = 'previous',
  triggerRef,
  dismissable = true,
  lockDismiss = false,
  keepMounted = false,
  zIndexClass = 'z-[100]',
  panelClassName,
  scrimClassName,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [render, setRender] = useState(open)
  const [entered, setEntered] = useState(false)

  const canDismiss = dismissable && !lockDismiss

  useEffect(() => setMounted(true), [])

  // Mount/unmount with an enter/exit transition window.
  useEffect(() => {
    if (open) {
      setRender(true)
      const id = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(id)
    }
    setEntered(false)
    const t = setTimeout(() => setRender(false), EXIT_MS)
    return () => clearTimeout(t)
  }, [open])

  // Focus capture on open, restore on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const triggerEl = triggerRef?.current ?? null
    const id = requestAnimationFrame(() => {
      if (initialFocusRef?.current) initialFocusRef.current.focus()
      else focusFirst(panelRef.current)
    })
    return () => {
      cancelAnimationFrame(id)
      const target = restoreFocus === 'trigger' ? triggerEl : previouslyFocused
      target?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useLockBodyScroll(open)
  useEscape(open && canDismiss, onClose)
  useFocusTrap(panelRef, open)

  if (!mounted || (!render && !keepMounted)) return null

  const isDrawer = variant === 'drawer'
  const inert = keepMounted && !open

  const overlay = (
    <div
      className={clsx(
        'fixed inset-0',
        zIndexClass,
        isDrawer ? 'flex justify-end' : 'flex items-center justify-center p-4',
        !open && 'pointer-events-none',
      )}
      role="presentation"
      aria-hidden={inert || undefined}
      inert={inert || undefined}
    >
      <div
        aria-hidden
        onClick={canDismiss ? onClose : undefined}
        className={clsx(
          'absolute inset-0 transition-opacity duration-200',
          entered ? 'opacity-100' : 'opacity-0',
          scrimClassName ?? (isDrawer ? 'bg-black/30' : ''),
        )}
        style={
          !isDrawer && !scrimClassName
            ? { background: 'rgba(0,48,135,0.4)', backdropFilter: 'blur(4px)' }
            : undefined
        }
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        className={clsx(
          'relative outline-none',
          isDrawer
            ? clsx('h-full transition-transform duration-300 ease-out', entered ? 'translate-x-0' : 'translate-x-full')
            : clsx('transition-all duration-200', entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'),
          panelClassName,
        )}
      >
        {children}
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}

export default Modal
