export function DashboardWelcome({
  organisationName,
  subtitle,
}: {
  organisationName?: string
  subtitle?: string
}) {
  const org = organisationName?.trim()
  const defaultSubtitle = org
    ? `${org}\u2019s shared space`
    : 'Your organisation\u2019s shared space'

  return (
    <div>
      <h1 className="page-title-h1 mb-1">Dashboard</h1>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
        {subtitle ?? defaultSubtitle}
      </p>
    </div>
  )
}
