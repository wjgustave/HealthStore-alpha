'use client'

import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/** White CTA in the coloured express-interest callout (PDP). Hero accent button is separate. */
export function ExpressInterestWhiteButton({ accent }: { accent: string }) {
  return (
    <Button
      variant="on-accent"
      data-express-interest
      size="none"
      style={{ color: accent }}
      className="w-full sm:w-auto min-w-[200px] px-6 py-4 text-[var(--text-label)]"
    >
      <span className="inline-flex items-center justify-center gap-2">
        <Mail className="h-4 w-4 shrink-0" aria-hidden />
        Express interest
      </span>
    </Button>
  )
}
