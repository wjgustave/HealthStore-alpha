import Link from 'next/link'

export default function QuestionPage({
  title,
  hint,
  backHref,
  children,
}: {
  title: string
  hint?: string
  backHref?: string
  children: React.ReactNode
}) {
  return (
    <>
      {backHref ? (
        <Link href={backHref} className="hs-back-link">← Back</Link>
      ) : null}
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 8px' }}>{title}</h1>
      {hint ? <p style={{ color: '#4c6272', marginBottom: 16, maxWidth: 640 }}>{hint}</p> : null}
      {children}
    </>
  )
}
