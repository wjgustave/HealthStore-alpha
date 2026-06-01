const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

export function DashboardWelcome({
  displayName,
  organisationName,
  subtitle,
}: {
  displayName?: string
  organisationName?: string
  subtitle?: string
}) {
  const name = displayName?.trim()
  return (
    <div>
      <h2
        className="mb-1"
        style={{ ...fr, fontWeight: 700, fontSize: 'var(--text-page-title)', color: 'var(--text-primary)' }}
      >
        {name ? `Welcome back, ${name}` : 'Welcome back'}
      </h2>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
        {subtitle ??
          (organisationName
            ? `Your organisation's shared home space — ${organisationName}`
            : 'Your organisation\u2019s shared home space')}
      </p>
    </div>
  )
}
