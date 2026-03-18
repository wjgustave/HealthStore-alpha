import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'NHS Commissioner DTx Store',
  description: 'Decision-support tool for NHS digital health technology procurement',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--surface)' }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Nav />
        <main id="main-content">{children}</main>
        <footer className="mt-20 border-t py-10 px-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm" style={{ color: 'var(--nhs-blue)' }}>NHS Commissioner DTx Store</span>
                <span className="badge badge-blue">Prototype</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Based on publicly available information as of March 2026. Not a procurement framework or national endorsement list.
              </p>
            </div>
            <div className="flex gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              <a href="/apps" className="hover:underline">Browse apps</a>
              
              <a href="/funding" className="hover:underline">Funding</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
