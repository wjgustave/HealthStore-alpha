'use client'

import { Sparkles } from 'lucide-react'

type Props = {
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function SuggestionPromptButton({ label, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-all hover:shadow-sm disabled:opacity-40"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--card)',
        color: 'var(--text-primary)',
        fontFamily: 'Frutiger, Arial, sans-serif',
      }}
    >
      <Sparkles
        className="mt-0.5 h-4 w-4 flex-shrink-0"
        style={{ color: 'var(--nhs-blue)' }}
      />
      <span>{label}</span>
    </button>
  )
}
