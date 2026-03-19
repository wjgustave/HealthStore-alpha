'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  accent?: string
}

export default function CollapsibleSection({ title, defaultOpen = true, children, accent }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        {accent && (
          <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: accent }} />
        )}
        <h2 className="text-lg font-bold flex-1"
          style={{ fontFamily: 'Frutiger, Arial, sans-serif', color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <ChevronDown
          className="w-5 h-5 transition-transform duration-200 flex-shrink-0"
          style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            {children}
          </div>
        </div>
      )}
    </section>
  )
}
