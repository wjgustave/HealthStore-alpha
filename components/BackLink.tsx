import Link from 'next/link'

/**
 * Back link. [Provenance: NHS]
 *
 * Official NHS Back link (`.nhsuk-back-link`) — a single "Back" affordance placed
 * above the page heading. Renders a Next `Link` when `href` is given, otherwise a
 * button (e.g. `history.back()`).
 */
export function BackLink({
  href,
  onClick,
  children = 'Back',
  className = '',
}: {
  href?: string
  onClick?: () => void
  children?: React.ReactNode
  className?: string
}) {
  const content = (
    <>
      <svg
        className="nhsuk-icon nhsuk-icon__chevron-left"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        width="24"
        height="24"
      >
        <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z" />
      </svg>
      {children}
    </>
  )

  return (
    <div className={`nhsuk-back-link${className ? ` ${className}` : ''}`}>
      {href ? (
        <Link className="nhsuk-back-link__link" href={href}>
          {content}
        </Link>
      ) : (
        <button type="button" className="nhsuk-back-link__link" onClick={onClick}>
          {content}
        </button>
      )}
    </div>
  )
}

export default BackLink
