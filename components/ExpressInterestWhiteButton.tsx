'use client'

import '@awesome.me/webawesome/dist/components/icon/icon.js'

/** White CTA in the coloured express-interest callout (PDP). Hero accent button is separate. */
export function ExpressInterestWhiteButton({ accent }: { accent: string }) {
  return (
    <button
      type="button"
      data-express-interest
      className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 transition-colors hover:bg-[#E6F0FB]"
      style={{
        background: '#fff',
        color: accent,
        borderRadius: 8,
        padding: '12px 24px',
        fontSize: 'var(--text-label)',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <wa-icon
        name="envelope"
        family="classic"
        variant="solid"
        className="shrink-0 text-[1em] leading-none inline-block align-middle text-current"
        aria-hidden
      />
      Express interest
    </button>
  )
}
