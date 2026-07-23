import type { ReactNode } from 'react'
import Link from 'next/link'

/**
 * Compact NHS clickable card with a right-aligned, vertically centred chevron.
 *
 * Follows the NHS “primary card with chevron” pattern
 * (service-manual.nhs.uk/design-system/components/card): whole-card hit target
 * via `.nhsuk-card__link`, chevron-right-circle icon on the right.
 *
 * Used for compact case-study previews on the home page.
 * [Provenance: NHS]
 */

function ChevronRightCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'nhsuk-icon nhsuk-icon--chevron-right-circle hs-card-chevron__icon'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      focusable="false"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-.3 5.8a1 1 0 1 0-1.5 1.4l2.9 2.8-2.9 2.8a1 1 0 0 0 1.5 1.4l3.5-3.5c.4-.4.4-1 0-1.4Z" />
    </svg>
  )
}

function CardLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//.test(href)
  if (external) {
    return (
      <a href={href} className="nhsuk-card__link">
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className="nhsuk-card__link">
      {children}
    </Link>
  )
}

export function ClickableChevronCard({
  href,
  title,
  headingLevel = 3,
}: {
  href: string
  title: string
  /** Semantic heading level for the card title. Default h3. */
  headingLevel?: 2 | 3 | 4
}) {
  const HeadingTag = (`h${headingLevel}` as 'h2' | 'h3' | 'h4')

  return (
    <div className="nhsuk-card nhsuk-card--clickable app-card hs-card-chevron">
      <div className="nhsuk-card__content hs-card-chevron__content">
        <HeadingTag className="nhsuk-card__heading nhsuk-body-s nhsuk-u-font-weight-bold hs-card-chevron__heading">
          <CardLink href={href}>{title}</CardLink>
        </HeadingTag>
        <ChevronRightCircle />
      </div>
    </div>
  )
}
