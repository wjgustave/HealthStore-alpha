'use client'

import { Button } from '@/components/ui/Button'

/** White CTA in the coloured express-interest callout (PDP). Hero accent button is separate. */
export function ExpressInterestWhiteButton({ accent: _accent }: { accent: string }) {
  return (
    <Button
      variant="on-accent"
      data-express-interest
      size="none"
      style={{ color: 'var(--text-primary)' }}
      className="w-full sm:w-auto min-w-[200px] px-6 py-4 text-[var(--text-label)]"
    >
      Express interest
    </Button>
  )
}
