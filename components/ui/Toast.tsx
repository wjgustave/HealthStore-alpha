'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

/**
 * Global feedback service.
 *
 * [Provenance: Bespoke — no NHS/GOV.UK equivalent.] The closest DS component is
 * the GOV.UK Notification banner, which is not a transient toast. Built to NHS
 * principles: NHS status colours (green/red/blue), split polite/assertive live
 * regions, manual dismissal. Proposed for the NHS backlog.
 *
 * One `ToastProvider` mounted high in `AppShell` exposes `useToast()` with
 * `success` / `error` / `info`. Toasts render in a top-centre portal split
 * across two live regions (FB-3): success + info announce politely via
 * `role="status"`, errors interrupt via `role="alert"`. Toasts auto-dismiss
 * and are manually dismissible.
 */
export type ToastType = 'success' | 'error' | 'info'

/** Optional inline action (e.g. "Undo") rendered in the toast (R7 UX-08). */
export type ToastAction = { label: string; onClick: () => void }

type ToastOptions = { action?: ToastAction }

type ToastItem = { id: number; type: ToastType; message: string; action?: ToastAction }

type ToastApi = {
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

/** Errors linger longer than transient confirmations. */
const DURATION: Record<ToastType, number> = { success: 4000, info: 4000, error: 6000 }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (type: ToastType, message: string, action?: ToastAction) => {
      const id = (idRef.current += 1)
      setToasts(prev => [...prev, { id, type, message, action }])
      const timer = setTimeout(() => dismiss(id), DURATION[type])
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach(clearTimeout)
      map.clear()
    }
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      success: (message, options) => push('success', message, options?.action),
      error: (message, options) => push('error', message, options?.action),
      info: (message, options) => push('info', message, options?.action),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}

const TONE: Record<ToastType, { border: string; icon: typeof Info; iconColor: string }> = {
  success: { border: '#007F3B', icon: CheckCircle2, iconColor: '#007F3B' },
  error: { border: 'var(--nhs-red)', icon: AlertTriangle, iconColor: 'var(--nhs-red)' },
  info: { border: 'var(--nhs-blue)', icon: Info, iconColor: 'var(--nhs-blue)' },
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const tone = TONE[toast.type]
  const Icon = tone.icon
  return (
    <div
      className="pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg border bg-white px-4 py-4 shadow-lg"
      style={{ borderColor: '#CBD5E1', borderLeft: `4px solid ${tone.border}` }}
    >
      <Icon className="mt-1 h-4 w-4 shrink-0" style={{ color: tone.iconColor }} aria-hidden />
      <span className="min-w-0 flex-1 hs-text-label" style={{ color: '#212B32' }}>
        {toast.message}
      </span>
      {toast.action ? (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick()
            onDismiss(toast.id)
          }}
          className="-my-1 shrink-0 rounded px-2 py-1 hs-text-label hs-font-bold underline-offset-2 transition-colors hover:underline"
          style={{ color: tone.iconColor }}
        >
          {toast.action.label}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="-mr-1 -mt-1 shrink-0 rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[#F0F4F5] hover:text-[var(--text-primary)]"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  )
}

function Toaster({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const polite = toasts.filter(t => t.type !== 'error')
  const assertive = toasts.filter(t => t.type === 'error')
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[300] flex flex-col items-center gap-2 px-4 pt-4">
      <div role="status" aria-live="polite" aria-atomic="false" className="flex w-full flex-col items-center gap-2">
        {polite.map(t => (
          <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="false" className="flex w-full flex-col items-center gap-2">
        {assertive.map(t => (
          <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
    </div>,
    document.body,
  )
}
