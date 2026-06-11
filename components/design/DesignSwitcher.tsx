'use client'

import { useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Palette } from 'lucide-react'
import {
  DESIGN_COOKIE,
  DESIGN_COOKIE_MAX_AGE,
  DESIGN_IDS,
  DESIGN_LABELS,
  type DesignId,
} from '@/lib/design/config'
import { useDesign } from './DesignProvider'

function writeDesignCookie(design: DesignId) {
  document.cookie = `${DESIGN_COOKIE}=${design}; path=/; max-age=${DESIGN_COOKIE_MAX_AGE}; samesite=lax`
}

export default function DesignSwitcher() {
  const active = useDesign()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  // Optimistic local state so the toggle highlights instantly before refresh.
  const [selected, setSelected] = useState<DesignId>(active)

  // The login screen renders without global chrome — keep the switcher off it.
  if (pathname === '/login') return null

  function selectDesign(next: DesignId) {
    if (next === selected) return
    setSelected(next)
    writeDesignCookie(next)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[60] print:hidden"
      role="group"
      aria-label="Switch visual design"
    >
      <div
        className="flex items-center gap-1 rounded-full border bg-white/95 p-1 shadow-lg backdrop-blur"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="flex items-center gap-1 pl-2 pr-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          <Palette className="h-3.5 w-3.5" aria-hidden style={{ color: 'var(--nhs-blue)' }} />
          Design
        </span>
        {DESIGN_IDS.map(id => {
          const isActive = selected === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => selectDesign(id)}
              aria-pressed={isActive}
              disabled={isPending && isActive}
              className="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
              style={{
                background: isActive ? 'var(--nhs-blue)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {DESIGN_LABELS[id].short}
            </button>
          )
        })}
      </div>
    </div>
  )
}
