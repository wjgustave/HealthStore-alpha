export type InsightVariant = 'default' | 'warn' | 'good'

export default function InsightCallout({
  children,
  variant = 'default',
  title,
}: {
  children: React.ReactNode
  variant?: InsightVariant
  title?: string
}) {
  const styles: Record<InsightVariant, React.CSSProperties> = {
    default: { borderLeftColor: '#005eb8', background: '#fff' },
    warn: { borderLeftColor: '#ffb81c', background: '#fff9ee' },
    good: { borderLeftColor: '#007f3b', background: '#f0f7f2' },
  }

  return (
    <div
      style={{
        borderLeft: '8px solid',
        padding: '14px 20px',
        fontSize: 16,
        lineHeight: 1.5,
        color: '#212b32',
        ...styles[variant],
      }}
    >
      {title ? <strong style={{ display: 'block', marginBottom: 6 }}>{title}</strong> : null}
      {children}
    </div>
  )
}
