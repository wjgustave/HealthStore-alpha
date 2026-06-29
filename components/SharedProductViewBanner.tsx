import Link from 'next/link'
import { PDP_SHARE_SECTION_LABELS, isValidPdpShareKey } from '@/lib/pdpShareKeys'
import { STORE_ACCENT } from '@/lib/storeAccent'

export function SharedProductViewBanner({
  appName,
  slug,
  renderedKeys,
}: {
  appName: string
  slug: string
  /** Keys actually shown (after PDP conditional logic). */
  renderedKeys: string[]
}) {
  const labels = renderedKeys.filter(isValidPdpShareKey).map(k => PDP_SHARE_SECTION_LABELS[k])

  return (
    <div
      role="region"
      aria-label="Shared product excerpt"
      className="mb-6 rounded-xl border px-4 py-4"
      style={{ borderColor: 'var(--border)', background: '#EEF6FF' }}
    >
      <p className="hs-text-label hs-font-bold" style={{ color: 'var(--text-primary)' }}>
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full hs-text-caption hs-font-bold align-middle"
          style={{ background: '#CCE5FF', color: '#003087' }}
          aria-hidden>
          i
        </span>
        You’re viewing a shared excerpt of <strong>{appName}</strong>
      </p>
      <p className="hs-text-label mt-1" style={{ color: 'var(--text-secondary)' }}>
        Only the sections included in this link are shown on the server. Sign-in and commissioning context must match the link creator.
      </p>
      <div className="mt-2">
        <Link
          href={`/apps/${slug}`}
          className="hs-text-label hs-font-bold underline underline-offset-2"
          style={{ color: STORE_ACCENT }}
        >
          Open full product page
        </Link>
      </div>
      {labels.length > 0 ? (
        <>
          <p className="hs-text-caption hs-font-bold uppercase tracking-wide mt-4 mb-1" style={{ color: 'var(--text-muted)' }}>
            Included in this view
          </p>
          <ul className="hs-text-label list-disc pl-6 space-y-1" style={{ color: 'var(--text-secondary)' }}>
            {labels.map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="sr-only" aria-live="polite">
        Shared excerpt view for {appName}.
      </p>
    </div>
  )
}
