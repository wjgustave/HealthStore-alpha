import type { ReactNode } from 'react'
import Link from 'next/link'

/**
 * NHS clickable card.
 *
 * - `compact` — title + right chevron (home case-study previews)
 * - `primary` — taller filled card with title, description and vertically
 *   centred chevron (catalogue pathway cards)
 * - `secondary` — transparent, bottom-border only (resource library). Same
 *   pattern as Urgent / Mental health / Vaccination on
 *   https://www.nhs.uk/nhs-services/
 *
 * Whole-card hit target via `.nhsuk-card__link`.
 * [Provenance: NHS — service-manual.nhs.uk/design-system/components/card]
 */

/** Compact case-study style: filled path chevron. */
function ChevronRightCircleCompact({ className }: { className?: string }) {
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

/** Primary card style from nhsuk-frontend card template. */
function ChevronRightCirclePrimary() {
  return (
    <svg
      className="nhsuk-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="13.333" cy="13.333" r="13.333" fill="" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2.667">
        <path d="M15.438 13l-3.771 3.771" />
        <path d="M11.667 9.229L15.438 13" />
      </g>
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
  description,
  headingLevel = 3,
  variant = 'compact',
  className,
}: {
  href: string
  title: string
  /** Shown under the title on primary / secondary variants. */
  description?: string
  /** Semantic heading level for the card title. Default h3. */
  headingLevel?: 2 | 3 | 4
  /**
   * `compact` — title + chevron only (home case studies).
   * `primary` — filled NHS card with description + blue chevron.
   * `secondary` — transparent, bottom-border only (nhs.uk/nhs-services).
   */
  variant?: 'compact' | 'primary' | 'secondary'
  className?: string
}) {
  const HeadingTag = (`h${headingLevel}` as 'h2' | 'h3' | 'h4')

  if (variant === 'secondary') {
    return (
      <div
        className={['nhsuk-card', 'nhsuk-card--clickable', 'nhsuk-card--secondary', className]
          .filter(Boolean)
          .join(' ')}
        style={{ marginBottom: 0, height: '100%', minHeight: '11rem' }}
      >
        <div
          className="nhsuk-card__content nhsuk-card__content--secondary"
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <HeadingTag className="nhsuk-card__heading nhsuk-heading-m">
            <CardLink href={href}>{title}</CardLink>
          </HeadingTag>
          {description ? (
            <div className="nhsuk-card__description" style={{ flex: 1 }}>
              <p>{description}</p>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (variant === 'primary') {
    return (
      <div
        className={['nhsuk-card', 'nhsuk-card--clickable', 'app-card', className].filter(Boolean).join(' ')}
        style={{ marginBottom: 0, minHeight: '11rem', height: '100%' }}
      >
        <div className="nhsuk-card__content nhsuk-card__content--primary">
          <HeadingTag className="nhsuk-card__heading nhsuk-heading-m">
            <CardLink href={href}>{title}</CardLink>
          </HeadingTag>
          {description ? <p className="nhsuk-card__description">{description}</p> : null}
          <ChevronRightCirclePrimary />
        </div>
      </div>
    )
  }

  return (
    <div className={['nhsuk-card', 'nhsuk-card--clickable', 'app-card', 'hs-card-chevron', className].filter(Boolean).join(' ')}>
      <div className="nhsuk-card__content hs-card-chevron__content">
        <HeadingTag className="nhsuk-card__heading nhsuk-body-s nhsuk-u-font-weight-bold hs-card-chevron__heading">
          <CardLink href={href}>{title}</CardLink>
        </HeadingTag>
        <ChevronRightCircleCompact />
      </div>
    </div>
  )
}
