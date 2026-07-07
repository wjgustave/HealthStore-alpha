import NhsHeader from './NhsHeader'
import NhsFooter from './NhsFooter'
import NhsFrontendInit from './NhsFrontendInit'

export default function NhsPageLayout({
  children,
  isLoggedIn,
  contextLabel,
  banner,
}: {
  children: React.ReactNode
  isLoggedIn: boolean
  contextLabel?: string
  banner?: React.ReactNode
}) {
  return (
    <>
      <a className="nhsuk-skip-link" href="#main-content">Skip to main content</a>
      {banner}
      <NhsHeader isLoggedIn={isLoggedIn} contextLabel={contextLabel} />
      <main className="nhsuk-main-wrapper" id="main-content" role="main">
        <div className="nhsuk-width-container">{children}</div>
      </main>
      <NhsFooter isLoggedIn={isLoggedIn} />
      <NhsFrontendInit />
    </>
  )
}
