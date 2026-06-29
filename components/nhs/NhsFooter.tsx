import Link from 'next/link'

export default function NhsFooter({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <footer style={{ borderTop: '1px solid #d8dde0', marginTop: 64, padding: '32px 24px 48px', background: '#f0f4f5' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 14, color: '#4c6272', marginBottom: 16 }}>
          <Link href="/guidance" style={{ color: '#005eb8' }}>Guidance</Link>
          <Link href="/cookies" style={{ color: '#005eb8' }}>Cookies</Link>
          {isLoggedIn && <Link href="/account/organisation" style={{ color: '#005eb8' }}>Account</Link>}
        </div>
        <p style={{ fontSize: 13, color: '#4c6272', margin: '0 0 8px' }}>
          © Crown copyright. HealthStore prototype — illustrative data only.
        </p>
        <p style={{ fontSize: 12, color: '#768692', margin: 0 }}>
          Prototype service. Figures are illustrative unless labelled as observed operational data. Review date: June 2026.
        </p>
      </div>
    </footer>
  )
}
