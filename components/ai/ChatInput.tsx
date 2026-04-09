'use client'
import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'

type Props = {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [])

  return (
    <div
      className="border-t px-4 py-3"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask about apps, funding, costs, business cases..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            fontFamily: 'Frutiger, Arial, sans-serif',
            // @ts-expect-error CSS custom property for focus ring
            '--tw-ring-color': 'var(--nhs-blue)',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-40"
          style={{
            background: value.trim() && !disabled ? 'var(--nhs-blue)' : 'var(--border)',
            color: '#fff',
          }}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
