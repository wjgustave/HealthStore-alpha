'use client'

import { forwardRef, useId } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const labelStyle = { fontSize: 'var(--text-label)', color: 'var(--text-secondary)' } as const
const controlBase = 'w-full rounded-lg border px-3 py-2.5 text-sm'

type FieldRenderProps = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  'aria-required'?: true
}

/**
 * Canonical labelled field. Owns the label, optional hint and error, and wires the
 * accessibility attributes (`id`, `aria-describedby`, `aria-invalid`, `aria-required`)
 * onto the control via a render prop. Focus styling is left to the global
 * `:focus-visible` outline — controls do not add their own ring (decision FORM-2 B).
 */
export function FormField({
  label,
  hint,
  error,
  required,
  id: idProp,
  className = '',
  children,
}: {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  id?: string
  className?: string
  children: (field: FieldRenderProps) => ReactNode
}) {
  const autoId = useId()
  const id = idProp ?? autoId
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={className || undefined}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block font-semibold" style={labelStyle}>
          {label}
          {required ? (
            <span className="ml-0.5" style={{ color: 'var(--nhs-red)' }} aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {hint ? (
        <p id={hintId} className="mb-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </p>
      ) : null}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm" style={{ color: '#7A1210' }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function controlStyle(readOnly: boolean | undefined, extra?: React.CSSProperties): React.CSSProperties {
  return {
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
    background: readOnly ? '#F7F9FC' : '#fff',
    ...extra,
  }
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className = '', style, readOnly, ...props }, ref) {
    return (
      <input
        ref={ref}
        readOnly={readOnly}
        className={`${controlBase} ${readOnly ? 'cursor-default' : ''} ${className}`.trim()}
        style={controlStyle(readOnly, style)}
        aria-readonly={readOnly || undefined}
        {...props}
      />
    )
  },
)

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', style, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`${controlBase} ${className}`.trim()}
        style={controlStyle(false, style)}
        {...props}
      >
        {children}
      </select>
    )
  },
)

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = '', style, readOnly, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        readOnly={readOnly}
        className={`${controlBase} ${className}`.trim()}
        style={controlStyle(readOnly, style)}
        aria-readonly={readOnly || undefined}
        {...props}
      />
    )
  },
)
